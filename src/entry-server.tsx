// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import { config } from "~/config";

export default createHandler(() => {
    return (
        <StartServer
            document={({ assets, children, scripts }) => (
                <html lang="en" class="theme-dark">
                    <head>
                        <meta charset="utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <link rel="icon" href={`${config.base}/favicon.ico`} />
                        {assets}
                    </head>
                    <body>
                        <div id="app">{children}</div>
                        {scripts}
                    </body>
                </html>
            )} />
    );
});
