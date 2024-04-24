import "~/style/global.style";

import { Meta, MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { Suspense } from "solid-js";
import { config } from "~/config";
import Header from "~/Header";
import { routes } from "~/routes";
import BackgroundImage from "~/BackgroundImage";
import Footer from "~/Footer";
import { registerRoute } from "solid-start-preload";

export default function App() {
  return (
    <MetaProvider>
      <Router
        base={config.base}
        root={(props) => (
          <>
            <Title>Blog of a programming rabbit</Title>
            <Meta
              name="description"
              content="Matic Utsumi Gačar's blog and portfolio website discussing code, art and life."
            />
            <Header />
            <BackgroundImage />
            <div class="content-container">
              <Suspense>{props.children}</Suspense>
            </div>
            <Footer />
          </>
        )}>
        {routes}
      </Router>
    </MetaProvider>
  );
}

registerRoute({ path: "/*" });
