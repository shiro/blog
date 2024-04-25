import { defineConfig } from "@solidjs/start/config";
import path from "node:path";
import compileTime from "vite-plugin-compile-time";
import solidSvg from "vite-plugin-solid-svg";
import tsconfig from "./tsconfig.json";
import { linariaVitePlugin } from "./vite/linariaVitePlugin";
import { viteMarkdownPlugin } from "./vite/markdown/viteMarkdownPlugin";
import { viteImagePlugin } from "./vite/viteImagePlugin";
// @ts-ignore
import babelPluginLazyPlus from "solid-lazy-plus/babel";

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
      plugins: [babelPluginLabels, babelPluginLazyPlus],
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
        warmup: { clientFiles: ["./src/app.tsx"] },
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
        viteMarkdownPlugin(),
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
