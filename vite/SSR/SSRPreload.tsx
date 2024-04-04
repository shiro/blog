import fs from "fs";
import { getRequestEvent } from "solid-js/web";
import { config } from "~/config";
import { routeMap } from "../../src/routeMap";
import { createMatcher } from "./routerMatchingUtil";

type Manifest = Record<string, any>;

const VITE_MANIFEST_PATH = ".vinxi/build/ssr/.vite/manifest.json";
const manifest = fs.existsSync(VITE_MANIFEST_PATH)
  ? JSON.parse(fs.readFileSync(VITE_MANIFEST_PATH).toString())
  : {};

const base = (import.meta.env.BASE_URL ?? "").replace("/_build", "");
console.log("<<< MI", import.meta.env.BASE_PATH, base);

const formatUrl = (url: string) => `${base}/${url}`;

function renderAsset(url: string) {
  if (url.endsWith(".css")) return <link href={url} rel="stylesheet" />;
  if (url.endsWith(".js"))
    return <link rel="modulepreload" as="script" crossorigin="" href={url} />;
}

const push = (set: string[], item: string) => {
  if (set.some((x) => x == item)) return;
  set.push(item);
};

const collectRec = (output: string[], filename: string, manifest: Manifest) => {
  console.log("collect", filename, manifest[filename]);

  for (const jsFilename of manifest[filename]?.imports ?? []) {
    collectRec(output, jsFilename, manifest);
  }

  for (const cssFilename of manifest[filename]?.css ?? []) {
    if (output.some((x) => x == cssFilename)) continue;
    push(output, cssFilename);
  }

  if (manifest[filename]?.file) {
    let url = manifest[filename].file;

    url = url.startsWith("/") ? url.slice(1) : url;

    push(output, manifest[filename].file);
  }
};

const matchers: [(path: string) => boolean, string[]][] = Object.entries(
  routeMap
).map(([pattern, value]) => [
  createMatcher(`${config.base}${pattern}`),
  value as string[],
]);

console.log("<<< VITE", routeMap, manifest);

export const preloadSSR = () => {
  const pathname = new URL(getRequestEvent()!.request.url).pathname;
  const filesToPreload: string[] = [];

  for (const [matcher, matches] of matchers) {
    if (matcher(pathname) == null) continue;
    for (const filename of matches) {
      collectRec(filesToPreload, filename, manifest);
    }
  }
  console.log("<<< preload", pathname, filesToPreload);

  return filesToPreload.map(formatUrl).map(renderAsset);
};
