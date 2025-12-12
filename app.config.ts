import { defineConfig } from "@solidjs/start/config";
import path from "node:path";
import compileTime from "vite-plugin-compile-time";
import solidSvg from "vite-plugin-solid-svg";
import tsconfig from "./tsconfig.json";
import { viteAsciinemaPlugin } from "./vite/viteAsciinemaPlugin";
import { viteMarkdownPlugin } from "./vite/markdown/viteMarkdownPlugin";
import { viteImagePlugin } from "./vite/viteImagePlugin";
// @ts-ignore
import tailwindcss from "@tailwindcss/vite";
// @ts-ignore
import babelPluginLazyPlus from "solid-lazy-plus/babel";
import styleThis from "@style-this/vite";

const babelPluginLabels = [
  "solid-labels/babel",
  { dev: process.env.NODE_ENV == "development" },
];

export default defineConfig({
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

  solid: {
    babel: {
      plugins: [babelPluginLabels, babelPluginLazyPlus],
    },
  },

  extensions: ["mdx", "md"],

  vite(options) {
    return {
      css: { transformer: "lightningcss" },
      server: {
        port: 3000,
        // warmup: { clientFiles: ["./src/app.tsx"] },
      },
      build: { sourcemap: true },
      resolve: {
        alias: Object.fromEntries(
          Object.entries(tsconfig.compilerOptions.paths).map(([key, value]) => [
            key.replace(/\/\*$/, ""),
            path.join(process.cwd(), value[0].replace(/\/\*$/, "")),
          ])
        ),
      },
      plugins: [
        {
          name: "warmup",
          enforce: "post",
          configureServer: (server) => {
            if (server.config.router.name != "client") return;
            const { port, host, https } = server.config.server;
            const protocol = https ? "https" : "http";
            const hostname = host || "localhost";
            const url = `${protocol}://${hostname}:${port}`;

            (async () => {
              for (let i = 0; i < 10; i++) {
                try {
                  return await fetch(url);
                } catch (err) {
                  await new Promise((resolve) => setTimeout(resolve, 500));
                }
              }
            })();
          },
        },
        viteImagePlugin(),
        viteAsciinemaPlugin(),
        compileTime(),
        solidSvg(),
        viteMarkdownPlugin(),
        styleThis({ ignoredImports: { "@kobalte/core": true } }),
        tailwindcss(),
      ],
    };
  },
});
