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

const wihtoutQuery = (url: string) => url.split("?")[0];

function renderAsset(url: string) {
  const urlWithoutSearch = wihtoutQuery(url);
  if (urlWithoutSearch.endsWith(".woff2"))
    return (
      <link
        rel="preload"
        as="font"
        type="font/woff2"
        crossorigin=""
        href={url}
      />
    );
  // if (urlWithoutSearch.endsWith(".js"))
  return <link rel="modulepreload" as="script" crossorigin="" href={url} />;

  // throw new Error(`unknown filetype in SSR  renderAsset: '${url}'`);
}

function renderInlineCSS(id: string, code: string) {
  // console.log(id);
  return <style type="text/css" data-vite-dev-id={id} innerHTML={code} />;
}

const collectRec = (
  JSOutput: string[],
  CSSOutput: [id: string, code: string][],
  filepath: string,
  moduleGraph: ModuleGraph,
  visited: Set<String>,
) => {
  const node = [
    ...(moduleGraph.fileToModulesMap.get(filepath)?.values() ?? []),
  ][0];
  if (!node.file || !node.id) return;
  if (visited.has(node.id)) return;
  visited.add(node.id);

  const imports = [...node.clientImportedModules.values()];

  if (!/tw\.style.*\.css/.test(node.id) && !/routes\.tsx/.test(node.id)) {
    for (const dep of imports) {
      if (!dep.file) continue;

      // if (dep.file.includes("Gallery")) console.log(node.file, dep.file);

      collectRec(JSOutput, CSSOutput, dep.file, moduleGraph, visited);
    }
  }

  if ([".css", ".scss"].some((x) => wihtoutQuery(node.url).endsWith(x))) {
    if (!node.transformResult?.code) return;

    const start = 'const __vite__css = "';
    const end = '"\n__vite__updateStyle';
    let code = node.transformResult.code;
    code = code
      .substring(code.indexOf(start) + start.length, code.indexOf(end))
      .replaceAll("\\n", "\n")
      .replaceAll('\\"', '"')
      .replaceAll("\\\\", "\\");

    CSSOutput.push([node.id, code]);

    console.log(
      node.url,
      // imports.map((x) => x.url),
    );
  } else if ([".js"].some((x) => wihtoutQuery(node.url).endsWith(x))) {
    JSOutput.push(node.url);

    // console.log(
    //   node.url,
    //   imports.map((x) => x.url),
    // );
  } else {
    // JSOutput.push(node.url);
    // console.log(
    //   node.id,
    //   imports.map((x) => x.url),
    // );
  }
};

// const push = (set: string[], item: string) => {
//   if (set.some((x) => x == item)) return false;
//   set.push(item);
//   return true;
// };
//
// const collectRec = (
//   JSOutput: string[],
//   CSSOutput: [id: string, code: string][],
//   filepath: string,
//   moduleGraph: ModuleGraph,
// ) => {
//   const node = [
//     ...(moduleGraph.fileToModulesMap.get(filepath)?.values() ?? []),
//   ][0];
//   if (!node.file) return;
//
//   if (node.file.endsWith(".css")) {
//     if (!node.transformResult?.code || !node.id) return;
//     if (CSSOutput.some(([id]) => id == node.id)) return;
//
//     const start = 'const __vite__css = "';
//     const end = '"\n__vite__updateStyle';
//     let code = node.transformResult.code;
//     code = code
//       .substring(code.indexOf(start) + start.length, code.indexOf(end))
//       .replaceAll("\\n", "\n")
//       .replaceAll('\\"', '"')
//       .replaceAll("\\\\", "\\");
//
//     CSSOutput.push([node.id, code]);
//     return;
//   }
//
//   if (!push(JSOutput, node.url)) return;
//
//   const imports = [...node.clientImportedModules.values()];
//
//   for (const node of imports) {
//     if (!node.file) continue;
//     collectRec(JSOutput, CSSOutput, node.file, moduleGraph);
//   }
// };

const matchers: [(path: string) => boolean, string[]][] = Object.entries(
  routeMap,
).map(([pattern, value]) => [createMatcher(pattern), value as string[]]);

export const preloadSSRDev = () => {
  const pathname = new URL(getRequestEvent()!.request.url).pathname;
  const moduleGraph = getModuleGraph();
  // console.log(
  //   [...moduleGraph.fileToModulesMap.entries()]
  //     .filter(([x]) => x.includes("GallerySite"))
  //     .map(([x, v]) => [x, v.values().next().value.clientImportedModules]),
  // );

  const filesToPreload: string[] = [];
  const inlineCSSToPreload: [string, string][] = [];

  for (const [matcher, matches] of matchers) {
    if (matcher(pathname) == null) continue;
    for (const filename of matches) {
      collectRec(
        filesToPreload,
        inlineCSSToPreload,
        path.resolve(filename),
        moduleGraph,
        new Set(),
      );
    }
  }

  return [
    renderAsset("/fonts/inter-3.19-roman/Inter-Regular-Roman.woff2"),
    ...inlineCSSToPreload.map(([id, code]) => renderInlineCSS(id, code)),
    ...filesToPreload.map(fixUrl).map(renderAsset),
  ];
};
