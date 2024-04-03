import { Navigate, RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";
import Article, { isValidArticle } from "~/Article";
import { config } from "~/config";

const BlogIndex = lazy(() => import("~/BlogIndex"));

export const routes: RouteDefinition[] = [
  { path: "/", component: () => <BlogIndex /> },
  { path: "/gallery", component: lazy(() => import("~/GallerySite")) },
  { path: "/about", component: lazy(() => import("~/about/AboutSite")) },
  {
    path: "/articles/:name",
    component: (p) => {
      // router bug: 'name' not in 'p', update when this is fixed
      const name = p.location.pathname.replace(`${config.base}/articles/`, "");
      return <Article name={name} />;
    },
    matchFilters: {
      name: (name: string) => isValidArticle(name),
    },
  },
  { path: "/*", component: () => <Navigate href={config.base} /> },
];
