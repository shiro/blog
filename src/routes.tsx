import { RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";
import { config } from "~/config";

const BlogIndex = lazy(() => import("~/BlogIndex"));

const articlesImportMap = import.meta.glob("./articles/*.mdx");
const getArticleComponent = (name: string) =>
  articlesImportMap[`./articles/${name}.mdx`];

export const routes: RouteDefinition[] = [
  { path: "/", component: () => <BlogIndex /> },
  { path: "/gallery", component: lazy(() => import("~/GallerySite")) },
  { path: "/about", component: lazy(() => import("~/AboutSite")) },
  {
    path: "/articles/:name",
    component: (p) => {
      // router bug: 'name' not in 'p', update when this is fixed
      const name = p.location.pathname.replace(`${config.base}/articles/`, "");
      const Article = lazy(getArticleComponent(name) as any);
      return (
        <Article
          components={
            {
              // h1: () => {
              //   return <span>hi</span>;
              // },
            }
          }
          {...p}
        />
      );
    },
    matchFilters: {
      name: (name: string) => !!getArticleComponent(name),
    },
  },
];
