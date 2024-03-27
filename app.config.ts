import { defineConfig } from "@solidjs/start/config";
import { nodeTypes } from "@mdx-js/mdx";
import { linariaVitePlugin } from "./vite/linariaVitePlugin";
import remarkShikiTwoslash from "remark-shiki-twoslash";
import rehypeRaw from "rehype-raw";
import pkg from "@vinxi/plugin-mdx";

const { default: mdx } = pkg;

const babelPluginLabels = [
  "solid-labels/babel",
  { dev: process.env.NODE_ENV == "development" },
];

export default defineConfig({
  ssr: true,
  devOverlay: false,

  server: {
    baseURL: process.env.BASE_PATH,
    static: true,
    prerender: {
      routes: [
        "/",
        "/about",
        "/foo",
        "/page/1",
        "/page/2",
        //
        // "/articles/2024-03-25-first-article",
      ],
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
      plugins: [
        mdx.withImports({})({
          jsx: true,
          jsxImportSource: "solid-js",
          providerImportSource: "solid-mdx",
          rehypePlugins: [
            // rehypeSlug, rehypeCollectHeadings,
            [rehypeRaw, { passThrough: nodeTypes }],
          ],
          remarkPlugins: [
            // remarkFrontmatter,
            // remarkMdxFrontmatter,
            [
              remarkShikiTwoslash.default,
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
          include: [
            /\/src\//,
            // /\/core\//,
            // /\/packages\/server\/pdf\//,
          ],
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
