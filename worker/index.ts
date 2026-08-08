interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
  LEAD_WEBHOOK_URL?: string;
}

const immutableAsset = /^\/(?:img|models)\//;
const jsonHeaders = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };

const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: jsonHeaders });

const clean = (value: unknown, max = 500) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

async function submitLead(request: Request, env: Env): Promise<Response> {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (origin && origin !== requestUrl.origin) return reply({ ok: false }, 403);
  const size = Number(request.headers.get("Content-Length") || 0);
  if (size > 32_768) return reply({ ok: false }, 413);
  if (!env.LEAD_WEBHOOK_URL) return reply({ ok: false, error: "Form is not configured" }, 503);

  let input: Record<string, unknown>;
  try {
    input = await request.json() as Record<string, unknown>;
  } catch {
    return reply({ ok: false, error: "Invalid request" }, 400);
  }

  /* Quietly accept honeypot submissions so bots do not learn the filter. */
  if (clean(input.website, 120)) return reply({ ok: true });

  const payload = {
    name: clean(input.name, 120),
    email: clean(input.email, 180).toLowerCase(),
    phone: clean(input.phone, 80),
    message: clean(input.message, 3000),
    current_status: clean(input.current_status, 160),
    production_target: clean(input.production_target, 160),
    intent: clean(input.intent, 80),
    equipment: clean(input.equipment, 120),
    source: clean(input.source, 120),
    source_section: clean(input.source_section, 120),
    formId: clean(input.formId, 120),
    button_text: clean(input.button_text, 160),
    quiz_status: clean(input.quiz_status, 80),
    quiz_volume: clean(input.quiz_volume, 80),
    utm_source: clean(input.utm_source, 240),
    utm_medium: clean(input.utm_medium, 240),
    utm_campaign: clean(input.utm_campaign, 240),
    utm_term: clean(input.utm_term, 240),
    gclid: clean(input.gclid, 300),
    ga_clientid: clean(input.ga_clientid, 240),
    ym_clientid: clean(input.ym_clientid, 240),
    ph_distinct_id: clean(input.ph_distinct_id, 240),
    page: clean(input.page, 700),
    referrer: clean(input.referrer, 700),
    locale: clean(input.locale, 40),
    roi_inputs: clean(input.roi_inputs, 1200),
    form_started_at: clean(input.form_started_at, 80),
    submission_id: clean(input.submission_id, 120),
    consent: input.consent === true,
  };

  if (!payload.name || !payload.phone || !payload.current_status ||
      !payload.production_target || !payload.consent ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return reply({ ok: false, error: "Required fields are missing" }, 400);
  }

  let upstream: Response;
  try {
    upstream = await fetch(env.LEAD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain; charset=UTF-8" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    return reply({ ok: false, error: "Lead service is unavailable" }, 502);
  }
  if (!upstream.ok) return reply({ ok: false, error: "Lead service rejected the request" }, 502);
  return reply({ ok: true });
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/lead") {
      if (request.method !== "POST") return reply({ ok: false }, 405);
      return submitLead(request, env);
    }

    const assetPath = url.pathname === "/" ? "/index.html"
      : url.pathname === "/thank-you/" ? "/thank-you.html"
      : url.pathname;
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
