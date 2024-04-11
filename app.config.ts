import { nodeTypes } from "@mdx-js/mdx";
import { defineConfig } from "@solidjs/start/config";
import path from "node:path";
import rehypeRaw from "rehype-raw";
import remarkFrontmatter from "remark-frontmatter";
import remarkShikiTwoslash from "remark-shiki-twoslash";
import { PluginOption } from "vite";
import compileTime from "vite-plugin-compile-time";
import solidSvg from "vite-plugin-solid-svg";
import { linariaVitePlugin } from "./vite/linariaVitePlugin";
// import devtools from "solid-devtools/vite";
// @ts-ignore
import _mdx from "@vinxi/plugin-mdx";
import tsconfig from "./tsconfig.json";
import { viteImagePlugin } from "./vite/viteImagePlugin";
import remarkGfm from "remark-gfm";
import rehypeShiki from "@shikijs/rehype";
import { transformerNotationDiff } from "@shikijs/transformers";

const { default: mdx } = _mdx;

const root = process.cwd();

const babelPluginLabels = [
  "solid-labels/babel",
  { dev: process.env.NODE_ENV == "development" },
];

const SSRMapPlugin = (): PluginOption => {
  // let config: UserConfig;
  let config: any;
  return {
    name: "SSRManifest",
    enforce: "post",
    config(c) {
      config = c;
    },
    transform(code, id) {
      if (!id.includes("routeMap.tsx")) return;

      const splitIdx = code.indexOf("export");
      const importCode = code.slice(0, splitIdx);
      let exportCode = code.slice(splitIdx);
      const matches = importCode.matchAll(/import ([^ ]+) from .(.*).;/g)!;

      const aliases = ((config.resolve?.alias as any[]) ?? []).map((a) => ({
        ...a,
        replacement: path.relative(root, a.replacement),
      }));

      const importMap = [...matches].reduce(
        (acc, [_, importName, importPath]) => {
          for (const { find, replacement } of aliases) {
            importPath = importPath.replace(find, replacement);
          }
          importPath += ".tsx";
          return { ...acc, [importName]: importPath };
        },
        {}
      );

      for (const [importName, importPath] of Object.entries(importMap)) {
        exportCode = exportCode.replaceAll(
          new RegExp(`${importName}(?=[^a-zA-Z0-9])`, "g"),
          `"${importPath}"`
        );
      }

      return { code: exportCode };
    },
  };
};

export default defineConfig({
  ssr: true,
  devOverlay: false,

  server: {
    baseURL: process.env.BASE_PATH,
    static: true,
    prerender: {
      failOnError: true,
      routes: ["/"],
      crawlLinks: true,
    },
  },
  // experimental: {islands: true},

  solid: {
    babel: {
      plugins: [babelPluginLabels],
    },
    ...({} as any),
  },

  extensions: ["mdx", "md"],

  vite(options) {
    return {
      // define: {
      // "import.meta.env.BASE_URL": JSON.stringify("/foo"),
      // },
      css: { postcss: "./postcss.config.js" },
      server: {
        port: 3000,
        warmup: {
          clientFiles: ["./src/app.tsx"],
        },
      },
      resolve: {
        alias: Object.fromEntries(
          Object.entries(tsconfig.compilerOptions.paths).map(([key, value]) => [
            key.replace(/\/\*$/, ""),
            path.join(process.cwd(), value[0].replace(/\/\*$/, "")),
          ])
        ),
      },
      plugins: [
        viteImagePlugin(),
        compileTime(),
        solidSvg(),
        SSRMapPlugin(),
        // devtools({
        //   autoname: true,
        //   locator: {
        //     key: "Shift",
        //     componentLocation: true,
        //     jsxLocation: true,
        //   } as any,
        // }),
        mdx.withImports({})({
          jsx: true,
          jsxImportSource: "solid-js",
          providerImportSource: "solid-mdx",
          rehypePlugins: [
            // rehypeSlug, rehypeCollectHeadings,
            [rehypeRaw, { passThrough: nodeTypes }],
            [
              rehypeShiki,
              {
                // disableImplicitReactImport: true,
                // includeJSDocInHover: true,
                // theme: "css-variables",
                // themes: { dark: "github-dark", light: "github-light" },
                theme: "github-dark",
                transformers: [
                  transformerNotationDiff(),
                  // {
                  //   line(node: any, line: any) {
                  // node.properties["data-line"] = line;
                  // if (!node.children.length) {
                  //   console.log(node, this.lines.length, line);
                  // }
                  // if ([1, 3, 4].includes(line))
                  //   this.addClassToHast(node, "foo");
                  // },
                  // },
                ],

                // defaultCompilerOptions: {
                //   allowSyntheticDefaultImports: true,
                //   esModuleInterop: true,
                //   target: "ESNext",
                //   module: "esnext",
                //   lib: ["lib.dom.d.ts", "lib.es2015.d.ts"],
                //   jsxImportSource: "solid-js",
                //   jsx: "preserve",
                //   types: ["solid-start/env"],
                //   paths: {
                //     "~/*": ["./src/*"],
                //   },
                // },
              },
            ],
          ],
          remarkPlugins: [remarkFrontmatter, remarkGfm],
        }),
        linariaVitePlugin({
          include: [/\/src\//],
          exclude: [/solid-refresh/, /\/@babel\/runtime\//, /\.import\./],
        }) as any,
      ],
    };
  },
});

// solid next:
// https://github.com/solidjs/solid-docs-next/blob/fc5ec0b803f0ae2a9deb55e1c6fb7c2c60b46c87/app.config.ts
