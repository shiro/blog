import { defineConfig } from "@solidjs/start/config";
import fs from "node:fs";
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

const isUseServerFile = (id: string) => {
  try {
    const src = fs.readFileSync(id.split("?")[0], "utf8").trimStart();
    return src.startsWith('"use server"') || src.startsWith("'use server'");
  } catch {
    return false;
  }
};

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
      build: {
        sourcemap: true,
        rollupOptions: {
          onwarn(warning, warn) {
            // solid-start already compiles "use server" files, rollup just sees the leftover directive
            if (
              warning.code == "MODULE_LEVEL_DIRECTIVE" &&
              warning.message.includes('"use server"')
            )
              return;
            // locating the directive warning above fails on the sourcemap, which warns again
            if (
              warning.code == "SOURCEMAP_ERROR" &&
              warning.pos == 0 &&
              warning.id &&
              isUseServerFile(warning.id)
            )
              return;
            warn(warning);
          },
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
