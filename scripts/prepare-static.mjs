import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = resolve(root, "public");

await rm(publicDir, { recursive: true, force: true });
await mkdir(publicDir, { recursive: true });

for (const directory of ["css", "img", "js", "models"]) {
  await cp(resolve(root, directory), resolve(publicDir, directory), {
    recursive: true,
  });
}

for (const file of ["index.html", "robots.txt", "_headers"]) {
  await cp(resolve(root, file), resolve(publicDir, file));
}
