import { routeMap } from "@client/routeMap";
import { createMatcher } from "./routerMatchingUtil";
import fs from "fs";
import { getRequestEvent } from "solid-js/web";

const VITE_MANIFEST_PATH = ".vinxi/build/ssr/.vite/manifest.json";
const manifest = JSON.parse(fs.readFileSync(VITE_MANIFEST_PATH).toString());

function renderAsset(asset: string) {
  if (asset.endsWith(".css"))
    return <link href={`/${asset}`} rel="stylesheet" />;
  if (asset.endsWith(".js"))
    // return <script type="module" src={`/${asset}`}></script>;
    return (
      <link rel="modulepreload" as="script" crossorigin="" href={`/${asset}`} />
    );
}

const push = (set: string[], item: string) => {
  if (set.some((x) => x == item)) return;
  set.push(item);
};

const collectRec = (output: string[], filename: string) => {
  for (const jsFilename of manifest[filename]?.imports ?? []) {
    collectRec(output, jsFilename);
  }

  for (const cssFilename of manifest[filename]?.css ?? []) {
    if (output.some((x) => x == cssFilename)) continue;
    push(output, cssFilename);
  }

  push(output, manifest[filename].file);
};

const matchers: [(path: string) => boolean, string[]][] = Object.entries(
  routeMap,
).map(([pattern, value]) => [createMatcher(pattern), value as string[]]);

export const preloadSSR = () => {
  const pathname = new URL(getRequestEvent()!.request.url).pathname;
  // const matches = routeMap[pathname] ?? [];

  const filesToPreload: string[] = [];

  for (const [matcher, matches] of matchers) {
    if (matcher(pathname) == null) continue;
    for (const filename of matches) {
      collectRec(filesToPreload, filename);
    }
  }
  return filesToPreload.map(renderAsset);
};
