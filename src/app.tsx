import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, lazy } from "solid-js";
import { css } from "@linaria/core";
import "~/style/global.style";
import "./app.css";
import { config } from "~/config";

const Foo = lazy(() => import("~/routes/index"));
const Article2 = lazy(
  () =>
    import("~/routes/articles/2024-03-25-starting-a-blog.mdx"),
);
const Article = lazy(
  () =>
    import("~/routes/articles/2024-03-30-maping-chord-key-combos-on-linux.mdx"),
);

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
          <a href="/foo">Foo</a>
          <div class="content-container">
            <Suspense>{props.children}</Suspense>
          </div>
        </MetaProvider>
      )}
    >
      {[
        { path: "/", component: () => <Foo /> },
        {
          path: "/articles/:name",
          component: (p) => {
            return (
              <Article2
                components={{
                  h1: () => {
                    return <span>hi</span>;
                  },
                }}
                {...p} />
            );
          },
        },
        {
          path: "/articles/2024-03-30-maping-chord-key-combos-on-linux",
          component: () => (
            <Article
              components={{
                h1: () => {
                  return <span>hi</span>;
                },
              }}
            />
          ),
        },
      ]}
      {/* <FileRoutes /> */}
    </Router>
  );
}

const f = css`
  background: red;
`;
