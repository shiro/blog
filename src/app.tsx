import { MetaProvider, Title } from "@solidjs/meta";
import { RouteDefinition, Router } from "@solidjs/router";
import { Suspense, lazy } from "solid-js";
import { config } from "~/config";

import Header from "~/Header";
import "~/style/global.style";
import "./app.css";

const BlogIndex = lazy(() => import("~/BlogIndex"));
const GallerySite = lazy(() => import("~/GallerySite"));

const articlesImportMap = import.meta.glob("./articles/*.mdx");
const getArticleComponent = (name: string) =>
  articlesImportMap[`./articles/${name}.mdx`];

export default function App() {
  return (
    <Router
      base={config.base}
      root={(props) => (
        <MetaProvider>
          <Title>SolidStart - Basic</Title>
          <Header />
          <div class="content-container">
            <Suspense>{props.children}</Suspense>
          </div>
        </MetaProvider>
      )}
    >
      {
        [
          { path: "/", component: () => <BlogIndex /> },
          { path: "/gallery", component: () => <GallerySite /> },
          {
            path: "/articles/:name",
            component: (p) => {
              // router bug: 'name' not in 'p', update when this is fixed
              const name = p.location.pathname.replace(
                `${config.base}/articles/`,
                "",
              );
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
        ] as RouteDefinition[]
      }
    </Router>
  );
}
