import { defineConfig } from "@solidjs/start/config";
import { linariaVitePlugin } from "./vite/linariaVitePlugin";

export default defineConfig({
  ssr: true,
  devOverlay: false,

  server: {
    prerender: {
      routes: ["/", "/about"],
    },
  },

  vite(options) {
        console.log(options);
    return {
      plugins: [
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
