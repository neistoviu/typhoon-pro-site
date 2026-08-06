interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

const immutableAsset = /^\/(?:img|models)\//;

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const assetPath = url.pathname === "/" ? "/index.html" : url.pathname;
    const assetRequest = new Request(new URL(assetPath, request.url), request);
    const response = await env.ASSETS.fetch(assetRequest);

    if (!immutableAsset.test(url.pathname) || response.status >= 400) {
      return response;
    }

    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

export default worker;
