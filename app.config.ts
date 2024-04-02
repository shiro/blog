import { defineConfig } from "@solidjs/start/config";
import { PluginOption } from "vite";
import { nodeTypes } from "@mdx-js/mdx";
import path, { join } from "node:path";
import { linariaVitePlugin } from "./vite/linariaVitePlugin";
import remarkShikiTwoslash from "remark-shiki-twoslash";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import compileTime from "vite-plugin-compile-time";
import solidSvg from "vite-plugin-solid-svg";
// import devtools from "solid-devtools/vite";
// @ts-ignore
import _mdx from "@vinxi/plugin-mdx";

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
      css: { postcss: "./postcss.config.js" },
      server: {
        port: 3000,
        warmup: {
          clientFiles: ["./src/app.tsx"],
        },
      },
      plugins: [
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
          ],
          remarkPlugins: [
            remarkFrontmatter,
            remarkGfm,
            [
              (remarkShikiTwoslash as any).default,
              {
                disableImplicitReactImport: true,
                includeJSDocInHover: true,
                // theme: "css-variables",
                themes: ["github-dark", "github-light"],
                defaultCompilerOptions: {
                  allowSyntheticDefaultImports: true,
                  esModuleInterop: true,
                  target: "ESNext",
                  module: "esnext",
                  lib: ["lib.dom.d.ts", "lib.es2015.d.ts"],
                  jsxImportSource: "solid-js",
                  jsx: "preserve",
                  types: ["solid-start/env"],
                  paths: {
                    "~/*": ["./src/*"],
                  },
                },
              },
            ],
          ],
        }),
        linariaVitePlugin({
          include: [/\/src\//],
          exclude: [
            /solid-refresh/,
            /\/@babel\/runtime\//,
            /\.import\./,
            // /vinxi/,
            // /@solidjs\/start\/server/,
            // /node_modues/,
            // /trpcClientUtil\.ts$/
            // /@server/,
            // /\/packages\/server(?!\/pdf)/,
          ],
        }) as any,
      ],
    };
  },
});

// solid next:
// https://github.com/solidjs/solid-docs-next/blob/fc5ec0b803f0ae2a9deb55e1c6fb7c2c60b46c87/app.config.ts
