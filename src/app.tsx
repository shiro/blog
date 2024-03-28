import { css } from "@linaria/core";
import { MetaProvider, Title } from "@solidjs/meta";
import { RouteDefinition, Router } from "@solidjs/router";
import { Suspense, lazy } from "solid-js";
import { config } from "~/config";
import "~/style/global.style";
import "./app.css";

const GallerySite = lazy(() => import("~/GallerySite"));
const Foo = lazy(() => import("~/routes/index"));

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
          <a href="/">Index</a>
          <a class={f} href="/about">
            About
          </a>
          <a href="/gallery">Gallery</a>
          <a href="/foo">Foo</a>
          <div class="content-container">
            <Suspense>{props.children}</Suspense>
          </div>
        </MetaProvider>
      )}
    >
      {
        [
          { path: "/", component: () => <Foo /> },
          { path: "/gallery", component: () => <GallerySite /> },
          {
            path: "/articles/:name",
            component: (p) => {
              // router bug: 'name' not in 'p', update when this is fixed
              const name = p.location.pathname.replace("/articles/", "");
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

const f = css`
  background: red;
`;
