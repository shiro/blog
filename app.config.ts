import { defineConfig } from "@solidjs/start/config";
import { linariaVitePlugin } from "./vite/linariaVitePlugin";
import pkg from "@vinxi/plugin-mdx";

const { default: mdx } = pkg;

export default defineConfig({
  ssr: true,
  devOverlay: false,

  server: {
    prerender: {
      routes: [
        "/",
        "/about",
        "/foo",
        //
        // "/articles/2024-03-25-first-article",
      ],
      crawlLinks: true,
    },
  },
  // experimental: {islands: true},

  extensions: ["mdx", "md"],

  vite(options) {
    return {
      plugins: [
        mdx.withImports({})({
          jsx: true,
          jsxImportSource: "solid-js",
          providerImportSource: "solid-mdx",
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
