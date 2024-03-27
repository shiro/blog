import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { css } from "@linaria/core";
import "~/style/global.style";
import "./app.css";

const base = (import.meta.env.BASE_URL ?? "").replace("/_build", "");

export default function App() {
  return (
    <Router
      base={base}
      root={(props) => (
        <MetaProvider>
          <Title>SolidStart - Basic</Title>
          <a href="/">Index ({base})</a>
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
      <FileRoutes />
    </Router>
  );
}

const f = css`
  background: red;
`;
