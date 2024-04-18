import { isServer } from "solid-js/web";

interface Options {
  path: string | string[];
}

export const SSRManifest: Record<string, string[]> = {};

export const registerRoute = (options: Options) => {
  if (!isServer) return;
  if (!Array.isArray(options.path)) options.path = [options.path];

  const src: string = (options as any)["__INTERNAL_SSR_SRC__"];

  for (const p of options.path) {
    if (!SSRManifest[p]) SSRManifest[p] = [];
    if (SSRManifest[p].includes(src)) continue;
    SSRManifest[p].push(src);
  }
};
