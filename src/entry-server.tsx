// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import { config } from "~/config";
import { preloadSSR } from "../vite/SSR/SSRPreload";
import { preloadSSRDev } from "../vite/SSR/SSRPreloadDev";

const _warn = console.warn;
console.warn = function (message?: any, ...optionalParams: any[]) {
  if (message == "No route matched for preloading js assets") return;
  _warn(message, ...optionalParams);
};

export default createHandler(() => {
  return (
    <StartServer
      document={({ assets, children, scripts }) => (
        <html lang="en" class="theme-dark">
          <head>
            <meta charset="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href={`${config.base}/favicon.ico`} />
            {assets}
            {import.meta.env.DEV ? preloadSSRDev() : preloadSSR()}
          </head>
          <body>
            <div id="app" class="flex min-h-[100vh] flex-col">
              {children}
            </div>
            {scripts}
          </body>
        </html>
      )}
    />
  );
});
