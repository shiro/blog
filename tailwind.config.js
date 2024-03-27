const theme = require("./src/style/theme");
const colors = theme.colors.light;


const mappedColors = {};
for(const key of Object.keys(colors)){
    const mappedKey = key.replaceAll("/", "-");
    mappedColors[mappedKey] = `var(--color-${mappedKey})`;
}

/** @type {import("tailwindcss").Config} */
module.exports = {
    content: ["./src/**/*.{ts,tsx,md,mdx}"],
    mode: "jit",
    theme: {
        // extend: {},
        colors: {
            ...mappedColors,
            transparent: "transparent",
        },
        screens: {
            s: "600px",
            m: "960px",
            l: "1280px",
            xl: "1920px",
        },
    },
    plugins: [],
};
