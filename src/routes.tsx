import { MetaContext } from "@solidjs/meta";
import { Navigate, RouteDefinition } from "@solidjs/router";
import { useContext } from "solid-js";
// import { lazy } from "solid-js";
import { lazy } from "solid-lazy-plus";
import Article, { isValidArticle } from "~/Article";
import { config } from "~/config";

const BlogIndex = lazy(() => import("./BlogIndex"));
//
// const foo = () => {
//   return () => {
//     const c = useContext(MetaContext);
//     console.log("ctx", c);
//     return "hi";
//   };
// };
// export const Mlazy = (fn: any) => foo();
//
// const BlogIndex = lazy({ MetaContext });

const F = () => {
  const c = useContext(MetaContext);
  // console.log("my ctx", c);
  return (
    <div>
      <BlogIndex />
    </div>
  );
};

export const routes: RouteDefinition[] = [
  { path: "/", component: () => <F /> },
  { path: "/gallery", component: lazy(() => import("./GallerySite")) },
  { path: "/about", component: lazy(() => import("./about/AboutSite")) },
  {
    path: "/articles/:name",
    component: (p) => {
      // router bug: 'name' not in 'p', update when this is fixed
      const name = p.location.pathname.replace(`${config.base}/articles/`, "");
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
