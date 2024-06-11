import { Navigate, RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-lazy-plus";
import Article, { isValidArticle } from "~/Article";
import { config } from "~/config";

export const routes: RouteDefinition[] = [
  { path: "/", component: lazy(() => import("./BlogIndex")) },
  { path: "/gallery", component: lazy(() => import("./GallerySite")) },
  { path: "/about", component: lazy(() => import("./about/AboutSite")) },
  {
    path: "/articles/:name",
    component: (p) => {
      // router bug: 'name' not in 'p', update when this is fixed
      let name = p.location.pathname.replace(`${config.base}/articles/`, "");
      if (name.endsWith("/")) name = name.slice(0, -1);
      return (
        <div class="mb-16">
          <Article name={name} />
        </div>
      );
    },
    matchFilters: {
      name: (name: string) => isValidArticle(name),
    },
  },
  { path: "/*", component: () => <Navigate href={config.base} /> },
];
