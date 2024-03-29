import App from "~/app";
import BlogIndex from "~/BlogIndex";
import GallerySite from "~/GallerySite";

export const routeMap: Record<string, string | string[]> = {
  "/*": [App],
  "/": [BlogIndex],
  "/gallery": [GallerySite],
} as any;
