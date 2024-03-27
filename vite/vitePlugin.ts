import path, {dirname, join} from "path";
import {solidPlugin, Options as solidEsbuildOptions} from "esbuild-plugin-solid";
import {fileURLToPath, pathToFileURL} from "url";
import solid from "vite-plugin-solid";
import {Plugin, ResolvedConfig, UserConfig, ViteDevServer, PluginOption} from "vite";
// import vitePluginRequire from "vite-plugin-require";
import linariaPlugin from "./viteLinaria";


export type Options = Omit<solidEsbuildOptions, "ssr"> & {
    // adapter: string | Adapter;
    appRoot: string;
    routesDir: string;
    ssr: boolean | "async" | "sync" | "streaming";
    prerenderRoutes: any[];
    experimental: {
        islands?: boolean;
        islandsRouter?: boolean;
        websocket?: boolean;
    };
    inspect: boolean;
    rootEntry: string;
    serverEntry: string;
    clientEntry: string;
    // router: import("../fs-router/router").Router;
};

type ViteConfig = ResolvedConfig & {
    solidOptions: Options;
    // adapter: Adapter;
};

const isDevelopment = process.env.NODE_ENV !== "production";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = path.join(__dirname, "..");


const baseConfig = (options: any): Plugin => {
    return {
        name: "base-config" as const,
        enforce: "pre" as const,
        async config(conf, e) {
            const root = conf.root || process.cwd();
            options.root = root;

            // Load env file based on `mode` in the current working directory.
            // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.

            // Load env file based on `mode` in the current working directory.
            // credits to https://github.com/nuxt/nuxt.js/blob/dev/packages/config/src/load.js for the server env
            // const envConfig = {
            //   dotenv: [
            //     /** default file */ `.env`,
            //     /** local file */ `.env.local`,
            //     /** mode file */ `.env.${e.mode}`,
            //     /** mode local file */ `.env.${e.mode}.local`
            //   ],
            //   env: process.env,
            //   expand: true,
            //   ...(options?.envConfig ?? {})
            // };
            // const env = loadServerEnv(envConfig, options.envDir || process.cwd());
            // for (const key in env) {
            //   if (!key.startsWith("VITE_") && envConfig.env[key] === undefined) {
            //     envConfig.env[key] = env[key];
            //   }
            // }
            // options._env = env;
            // options._envConfig = envConfig;
            // options.env = await loadEnv(e.mode, options.envDir || process.cwd());

            // const routeExtensions = [
            //     "tsx",
            //     "jsx",
            //     "js",
            //     "ts",
            //     ...((options.extensions &&
            //             options.extensions
            //                 .map((/** @type {string | [string, any]} */ s) => (Array.isArray(s) ? s[0] : s))
            //                 .map((/** @type {string} */ s) => s.slice(1))) ||
            //         [])
            // ];

            // let include = new RegExp(`\\.(${routeExtensions.join("|")})$`);

            // options.router = new Router({
            //     baseDir: path.posix.join(options.appRoot, options.routesDir),
            //     include,
            //     // exclude: options.routesIgnore,
            //     cwd: root
            // });
            options.clientEntry = join(appRoot, "packages/client/clientEntrypoint.solid.tsx");

            // if (!options.clientEntry) {
            //     options.clientEntry = join(_dirname, "..", "virtual", "entry-client.tsx");
            // }
            options.serverEntry = join(appRoot, "packages/server/serverEntrypoint.tsx");
            // if (!options.serverEntry) {
            //     options.serverEntry = join(_dirname, "..", "virtual", "entry-server.tsx");
            // }

            // options.rootEntry = options.rootEntry ?? findAny(join(root, options.appRoot), "root");
            // if (!options.rootEntry) {
            //     options.rootEntry = join(_dirname, "..", "virtual", "root.tsx");
            // }
            // console.log("r", options.appRoot)

            // @ts-ignore
            return {
                root,
                clearScreen: false,
                resolve: {
                    // conditions: env["VITEST"] ? ["browser", "solid"] : ["solid"],
                    conditions: ["solid"],
                    alias: {
                        "@root": appRoot,
                        "@core": join(appRoot, "../core/src"),
                        "@server": join(appRoot, "packages/server"),
                        "@client": join(appRoot, "packages/client"),
                        "config": join(appRoot, "config"),
                        // "~start/root": options.rootEntry,
                        "@entry-client": options.clientEntry,
                        "@entry-server": options.serverEntry
                    }
                },

                ssr: {
                    noExternal: ["@solidjs/meta", "@solidjs/router"]
                },

                define: {
                    "IS_SERVER": JSON.stringify(true),
                    "IS_DEV": JSON.stringify(isDevelopment),
                    // "process.env.TEST_ENV": JSON.stringify(process.env.TEST_ENV),
                    // "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
                    // "import.meta.env.START_SSR": JSON.stringify(
                    //   options.ssr === true ? "async" : options.ssr ? options.ssr : false
                    // ),
                    // "import.meta.env.START_ISLANDS": JSON.stringify(
                    //   options.experimental.islands ? true : false
                    // ),
                    "START_ENTRY_CLIENT": JSON.stringify(options.clientEntry),
                    "START_ENTRY_SERVER": JSON.stringify(options.serverEntry),
                    // "import.meta.env.START_INDEX_HTML": JSON.stringify(
                    //   process.env.START_INDEX_HTML === "true" ? true : false
                    // ),
                    // "import.meta.env.START_ISLANDS_ROUTER": JSON.stringify(
                    //   options.experimental.islandsRouter ? true : false
                    // ),
                    // _$DEBUG: process.env.NODE_ENV === "production" ? "(() => {})" : "globalThis._$DEBUG",
                    // "import.meta.env.START_ADAPTER": JSON.stringify(
                    //   typeof options.adapter === "string"
                    //     ? options.adapter
                    //     : options.adapter && options.adapter.name
                    // )
                },
                optimizeDeps: {
                    exclude: ["solid-start", "@solidjs/router", "@solidjs/meta"],
                    extensions: ["jsx", "tsx"],
                    esbuildOptions: {
                        plugins: [
                            solidPlugin({
                                // @ts-ignore
                                hydratable: true,
                                generate: "dom",
                            }) as any,
                        ],
                    },
                },
                server: {
                    port: 3000,
                },
                // solidOptions: options,
            };
        }
    };
};

const solidTransformer = (options: Options) => {
    const babelOptions = (getBabelOptions: any) =>
        async (source: string, id: string, ssr: boolean) => {
            const userBabelOptions =
                typeof options.babel === "function"
                    ? await options.babel(source, id, ssr)
                    : options.babel ?? {plugins: []};
            const localBabelOptions = getBabelOptions(source, id, ssr);
            return {
                plugins: [...(userBabelOptions.plugins ?? []), ...localBabelOptions.plugins]
            };
        };

    return solid({
        ...(options ?? {}),
        // if we are building the SPA client for production, we set ssr to false
        ssr: process.env.START_SPA_CLIENT === "true" ? false : true,
        babel: babelOptions(
            (source: string, id: string, ssr: boolean) => ({
                presets: [
                    "@linaria",
                ],
                plugins: [
                    // [fileRoutesImport],
                    // [
                    //     routeResource,
                    //     {
                    //         ssr,
                    //         root: process.cwd(),
                    //         minify: process.env.NODE_ENV === "production"
                    //     }
                    // ],
                    // [
                    //     babelServerModule,
                    //     {
                    //         ssr,
                    //         root: process.cwd(),
                    //         minify: process.env.NODE_ENV === "production"
                    //     }
                    // ]
                ]
            })
        )
    });
};

const solidStartServer = (options: any): Plugin => {
    let config: ViteConfig;

    const env = {cssModules: {} as Record<string, any>};
    const module_style_pattern = /\.module\.(css|less|sass|scss|styl|stylus|pcss|postcss)$/;

    let stopPrevious: (() => Promise<void>) | undefined = undefined;

    let devServer: ViteDevServer;

    return {
        name: "solid-start-server" as const,
        config(c: any) {
            config = c;
            return {
                appType: "custom" as const,
            };
        },
        transform(code: string, id: string) {
            if (module_style_pattern.test(id)) {
                env.cssModules[id] = code;
            }
        },
        async configureServer(vite) {
            devServer = vite;
            const {createDevHandler} = await import("./viteDevServer");

            // const {createDevHandler, onStop} = await createViteServerHandler(vite, config, options);

            // if (stopPrevious) {
            //     await stopPrevious();
            // }

            console.log(1)

            // stopPrevious = onStop;

            // if (vite.httpServer) {
            //     vite.httpServer.once("listening", async () => {
            //         setTimeout(() => {
            //             // if (vite.resolvedUrls) {
            //             //     const url = vite.resolvedUrls.local[0];
            //             //     // eslint-disable-next-line no-console
            //             //     // printUrls(config.solidOptions.router, url.substring(0, url.length - 1));
            //             // }
            //             // handleViteUpdate(vite, config, options);
            //         }, 100);
            //     });
            // }

            return async () => {
                console.log(2)

                // const {onStop} = await vite.ssrLoadModule("@entry-server");
                // stopPrevious = onStop;

                // console.log("invoke server");
                //
                // if (vite.httpServer) {
                //     vite.httpServer.once("listening", async () => {
                //         setTimeout(() => {
                //             handleViteUpdate(vite, config, options);
                //         }, 100);
                //     });
                // }
                // const adapter = await resolveAdapter(config);
                // if (adapter && adapter.dev) {
                //   vite.middlewares.use(
                //     await adapter.dev(config, vite, createDevHandler(vite, config, options))
                //   );
                // } else {
                vite.middlewares.use(createDevHandler(vite, config, options, (stop) => {stopPrevious = stop}).handlerWithEnv(env));
                // vite.
                // }

                setTimeout(async () => {
                    const {onStart, onStop} = await vite.ssrLoadModule("@entry-server");
                    stopPrevious = onStop;
                    await onStart();
                }, 100);
            };
        },
        async handleHotUpdate({file}) {
            if (file.includes("/local/")) return [];
            console.log(`[HMR] ${file}e`);

            if (stopPrevious) await stopPrevious();

            const {onStart, onStop} = await devServer.ssrLoadModule("@entry-server");
            stopPrevious = onStop;
            await onStart();

            return [];
        },

    };
};

const solidStartRouteManifest = options => ({
    name: "solid-start-route-manifest",
    config() {
        return {
            build: {
                target: "esnext",
                manifest: true,
            }
        };
    }
});;

export default (options: any) => {
    options = Object.assign(
        {
            // adapter: process.env.START_ADAPTER ? process.env.START_ADAPTER : "solid-start-node",
            // appRoot: "src",
            // routesDir: "routes",
            ssr: true,
            // process.env.START_SSR === "false"
            //     ? false
            //     : process.env.START_SSR === "true"
            //         ? "async"
            //         : process.env.START_SSR?.length
            //             ? process.env.START_SSR
            //             : "async",
            lazy: true,
            prerenderRoutes: [],
            devServer: true,
            inspect: true,
            // experimental: {
            //     islands: process.env.START_ISLANDS === "true" ? true : false,
            //     islandsRouter: process.env.START_ISLANDS_ROUTER === "true" ? true : false
            // }
        },
        options ?? {}
    );

    return [
        baseConfig(options),
        // vitePluginRequire({}),
        // solidStartFileSystemRouter({ delay: 500 }),
        // !options.ssr && solidStartCsrDev(options),
        // options.inspect ? inspect({ outDir: join(".solid", "inspect") }) : undefined,
        // options.experimental.islands ? islands() : undefined,
        solidTransformer(options),
        linariaPlugin(),
        solidStartServer(options),
        solidStartRouteManifest(options)
    ].filter(Boolean);
};