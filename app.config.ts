import { defineConfig } from "@solidjs/start/config";
import { nodeTypes } from "@mdx-js/mdx";
import { linariaVitePlugin } from "./vite/linariaVitePlugin";
import remarkShikiTwoslash from "remark-shiki-twoslash";
import rehypeRaw from "rehype-raw";
import compileTime from "vite-plugin-compile-time"
// @ts-ignore
import _mdx from "@vinxi/plugin-mdx";

const { default: mdx } = _mdx;

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
        compileTime(),
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

// solid next:
// https://github.com/solidjs/solid-docs-next/blob/fc5ec0b803f0ae2a9deb55e1c6fb7c2c60b46c87/app.config.ts
