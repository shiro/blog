const isDevelopment = process.env.NODE_ENV !== "production";

interface Options {
    architecture: "client" | "server";
    linariaMode?: boolean;
}

export const makeBabelOptions = (options: Options) => ({
    presets: [
        options.linariaMode && [
            "solid",
            {
                // "generate": options.architecture == "server" ? "ssr" : "dom",
                // "hydratable": true,
            },
        ],
        options.linariaMode && "@babel/preset-typescript",
        options.linariaMode && "@linaria",
    ].filter(Boolean),
    plugins: [
        "@babel/proposal-object-rest-spread",
        "@babel/plugin-proposal-optional-chaining",
        "@babel/plugin-proposal-nullish-coalescing-operator",
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        "@babel/plugin-proposal-class-properties",
        ["@babel/plugin-transform-react-jsx", { runtime: "automatic" }],

        options.architecture === "client" &&
            isDevelopment &&
            !options.linariaMode &&
            "solid-refresh/babel",
        !options.linariaMode && [
            "babel-plugin-solid-labels",
            { dev: isDevelopment },
        ],

        // ...(options.plugins ? options.plugins : []),
    ].filter(Boolean),
    babelrc: false,
    configFile: false,
});
