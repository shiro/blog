import AboutSite from "~/about/AboutSite";
import App from "~/app";
import Article from "~/Article";
import BlogIndex from "~/BlogIndex";
import GallerySite from "~/GallerySite";

export const routeMap: Record<string, string | string[]> = {
  "/*": [App],
  "/": [BlogIndex],
  "/gallery": [GallerySite],
  "/about": [AboutSite],
  "/articles/*": [Article],
} as any;
