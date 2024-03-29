import App from "~/app";
import GallerySite from "~/GallerySite";

export const routeMap: Record<string, string | string[]> = {
  "/*": [App],
  "/gallery": [GallerySite],
} as any;
