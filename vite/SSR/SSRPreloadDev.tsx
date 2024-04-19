import path from "path";
import { getRequestEvent } from "solid-js/web";
import { getManifest as getVinxiManifest } from "vinxi/manifest";
import { ModuleGraph } from "vite";
import { routeMap } from "../../src/routeMap";
import { createMatcher } from "./routerMatchingUtil";
import { SSRManifest } from "~/registerRoute";

const getModuleGraph = () => {
  return getVinxiManifest("client").dev.server.moduleGraph;
};

const fixUrl = (url: string) => (url.startsWith("/") ? url : "/" + url);

const withoutQuery = (url: string) => url.split("?")[0];

function renderAsset(url: string) {
  const urlWithoutSearch = withoutQuery(url);
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
  return <link rel="modulepreload" as="script" crossorigin="" href={url} />;

  // throw new Error(`unknown filetype in SSR  renderAsset: '${url}'`);
}

function renderInlineCSS(id: string, code: string) {
  return <style type="text/css" data-vite-dev-id={id} innerHTML={code} />;
}

const ignorePatterns = [/tw\.style.*\.css/, /routes\.tsx/];

const collectRec = (
  JSOutput: string[],
  CSSOutput: [id: string, code: string][],
  filepath: string,
  moduleGraph: ModuleGraph,
  visited: Set<String>
) => {
  const node = [
    ...(moduleGraph.fileToModulesMap.get(filepath)?.values() ?? []),
  ][0];
  if (!node.file || !node.id) return;
  if (visited.has(node.id)) return;
  visited.add(node.id);

  const imports = [...node.clientImportedModules.values()];
  // if (!node.id.includes("node_modules"))
  //   console.log(
  //     "dep",
  //     node.id,
  //     imports.map((x) => x.file)
  //   );

  if (!ignorePatterns.some((pattern) => pattern.test(node.id!))) {
    for (const dep of imports) {
      if (!dep.file) continue;

      collectRec(JSOutput, CSSOutput, dep.file, moduleGraph, visited);
    }
  }

  if ([".css", ".scss"].some((x) => withoutQuery(node.url).endsWith(x))) {
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
  } else if ([".js"].some((x) => withoutQuery(node.url).endsWith(x))) {
    JSOutput.push(node.url);
  }
};

export const preloadSSRDev = () => {
  const matchers: [(path: string) => boolean, string[]][] = Object.entries(
    SSRManifest
  ).map(([pattern, value]) => [createMatcher(pattern), value as string[]]);

  const pathname = new URL(getRequestEvent()!.request.url).pathname;
  const moduleGraph = getModuleGraph();

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
        new Set()
      );
    }
  }

  return [
    renderAsset("/fonts/inter-3.19-roman/Inter-Regular-Roman.woff2"),
    ...inlineCSSToPreload.map(([id, code]) => renderInlineCSS(id, code)),
    // ...filesToPreload.map(fixUrl).map(renderAsset),
  ];
};
