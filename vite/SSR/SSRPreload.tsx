import fs from "fs";
import { getRequestEvent } from "solid-js/web";
import { config } from "~/config";
import { createMatcher } from "./routerMatchingUtil";
import { SSRManifest } from "../../src/registerRoute";

type Manifest = Record<string, any>;

const VITE_MANIFEST_PATH = ".vinxi/build/ssr/.vite/manifest.json";
const manifest = fs.existsSync(VITE_MANIFEST_PATH)
  ? JSON.parse(fs.readFileSync(VITE_MANIFEST_PATH).toString())
  : {};

const base = (import.meta.env.BASE_URL ?? "").replace("/_build", "");

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
  const node = manifest[filename];
  if (!node) return;

  // ignore SSR bundles
  if (node.name == "ssr" && !node.src) return;

  // console.log("collect", filename, manifest[filename]);

  for (const jsFilename of node.imports ?? []) {
    collectRec(output, jsFilename, manifest);
  }

  for (const cssFilename of node.css ?? []) {
    if (output.some((x) => x == cssFilename)) continue;

    push(output, cssFilename);
  }

  if (node.file) {
    let url = manifest[filename].file;
    url = url.startsWith("/") ? url.slice(1) : url;

    push(output, url);
  }
};

export const preloadSSR = () => {
  const pathname = new URL(getRequestEvent()!.request.url).pathname;
  const filesToPreload: string[] = [];

  const matchers: [(path: string) => boolean, string[]][] = Object.entries(
    SSRManifest
  ).map(([pattern, value]) => [
    createMatcher(`${config.base}${pattern}`),
    value as string[],
  ]);

  for (const [matcher, matches] of matchers) {
    console.log("match?", pathname, !!matcher(pathname));
    if (matcher(pathname) == null) continue;
    for (const filename of matches) {
      collectRec(filesToPreload, filename, manifest);
    }
  }

  return filesToPreload.map(formatUrl).map(renderAsset);
};
