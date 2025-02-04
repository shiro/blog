import "~/style/global.style";
// the vite graph is generated before the babel plugin adds the imports, so we add it here
import "~/LazyImage";

import { Meta, MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { Suspense } from "solid-js";
import BackgroundImage from "~/BackgroundImage";
import Footer from "~/Footer";
import Header from "~/Header";
import { config } from "~/config";
import { routes } from "~/routes";
import { lazy } from "solid-lazy-plus";

const Preload = lazy(() => import("./preload"));

export default function App() {
  return (
    <MetaProvider>
      <Router
        base={config.base}
        root={(props) => {
          return (
            <>
              <Title>Blog of a programming rabbit</Title>
              <Meta
                name="description"
                content="Matic Utsumi Gačar's blog and portfolio website discussing code, art and life."
              />
              <Header />
              <BackgroundImage />
              <div class="content-container">
                <Suspense>
                  <Preload />
                  {props.children}
                </Suspense>
              </div>
              <Footer />
            </>
          );
        }}>
        {routes}
      </Router>
    </MetaProvider>
  );
}
