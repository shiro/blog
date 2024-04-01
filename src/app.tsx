import "~/style/global.style";

import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { Suspense } from "solid-js";
import { config } from "~/config";
import Header from "~/Header";
import { routes } from "~/routes";

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
      )}>
      {routes}
    </Router>
  );
}
