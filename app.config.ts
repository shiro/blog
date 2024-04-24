import { nodeTypes } from "@mdx-js/mdx";
import { defineConfig } from "@solidjs/start/config";
import path from "node:path";
import rehypeRaw from "rehype-raw";
import remarkFrontmatter from "remark-frontmatter";
import compileTime from "vite-plugin-compile-time";
import solidSvg from "vite-plugin-solid-svg";
import { linariaVitePlugin } from "./vite/linariaVitePlugin";
// @ts-ignore
import rehypeShiki from "@shikijs/rehype";
import { transformerNotationDiff } from "@shikijs/transformers";
// @ts-ignore
import _mdx from "@vinxi/plugin-mdx";
// @ts-ignore
import remarkCaptions from "remark-captions";
import remarkGfm from "remark-gfm";
import { parseDelimitedString } from "./src/util/parseDelimitedString";
import tsconfig from "./tsconfig.json";
// import { ssrBabelPlugin } from "./vite/ssrBabelPlugin";
import SSPreloadBabel from "solid-start-preload/babel";
import { viteImagePlugin } from "./vite/viteImagePlugin";
import { viteMDPlugin } from "./vite/viteMDPlugin";

// import devtools from "solid-devtools/vite";

const root = process.cwd();

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
      failOnError: true,
      routes: ["/"],
      crawlLinks: true,
    },
  },
  // experimental: {islands: true},

  solid: {
    babel: {
      plugins: [babelPluginLabels, SSPreloadBabel],
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
        viteMDPlugin(),
        // devtools({
        //   autoname: true,
        //   locator: {
        //     key: "Shift",
        //     componentLocation: true,
        //     jsxLocation: true,
        //   } as any,
        // }),
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
