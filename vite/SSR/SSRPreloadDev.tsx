import path from "path";
import { getRequestEvent } from "solid-js/web";
import { getManifest as getVinxiManifest } from "vinxi/manifest";
import { ModuleGraph } from "vite";
import { routeMap } from "../../src/routeMap";
import { createMatcher } from "./routerMatchingUtil";

const getModuleGraph = () => {
  return getVinxiManifest("client").dev.server.moduleGraph;
};

const fixUrl = (url: string) => (url.startsWith("/") ? url : "/" + url);

function renderAsset(url: string) {
  return <link rel="modulepreload" as="script" crossorigin="" href={url} />;
}

function renderInlineCSS(id: string, code: string) {
  return <style type="text/css" data-vite-dev-id={id} innerHTML={code} />;
}

const push = (set: string[], item: string) => {
  if (set.some((x) => x == item)) return false;
  set.push(item);
  return true;
};

const collectRec = (
  JSOutput: string[],
  CSSOutput: [id: string, code: string][],
  filepath: string,
  moduleGraph: ModuleGraph,
) => {
  const node = [
    ...(moduleGraph.fileToModulesMap.get(filepath)?.values() ?? []),
  ][0];
  if (!node.file) return;

  if (node.file.endsWith(".css")) {
    if (!node.transformResult?.code || !node.id) return;
    if (CSSOutput.some(([id]) => id == node.id)) return;

    const start = 'const __vite__css = "';
    const end = '"\n__vite__updateStyle';
    let code = node.transformResult.code;
    code = code
      .substring(code.indexOf(start) + start.length, code.indexOf(end))
      .replaceAll("\\n", "\n")
      .replaceAll("\\\\", "\\");

    CSSOutput.push([node.id, code]);
    return;
  }

  if (!push(JSOutput, node.url)) return;

  const imports = [...node.clientImportedModules.values()];

  for (const node of imports) {
    if (!node.file) continue;
    collectRec(JSOutput, CSSOutput, node.file, moduleGraph);
  }
};

const matchers: [(path: string) => boolean, string[]][] = Object.entries(
  routeMap,
).map(([pattern, value]) => [createMatcher(pattern), value as string[]]);

export const preloadSSRDev = () => {
  const pathname = new URL(getRequestEvent()!.request.url).pathname;
  const moduleGraph = getModuleGraph();

  const filesToPreload: string[] = [];
  const inlineCSSToPreload: [string, string][] = [];

  for (const [matcher, matches] of matchers) {
    console.log(pathname, matcher(pathname));
    if (matcher(pathname) == null) continue;
    for (const filename of matches) {
      collectRec(
        filesToPreload,
        inlineCSSToPreload,
        path.resolve(filename),
        moduleGraph,
      );
    }
  }

  return [
    ...inlineCSSToPreload.map(([id, code]) => renderInlineCSS(id, code)),
    ...filesToPreload.map(fixUrl).map(renderAsset),
  ];
};
