import { normalizeColorName, themeColors } from "~/style/colorsTs";

export const colorVariablesCSS = (() => {
    let colorVariablesCSS = "";
    for (const [theme, value] of Object.entries(themeColors)) {
        if (typeof value == "object") {
            colorVariablesCSS += `&.theme-${theme} {`;
            for (const [name, color] of Object.entries(themeColors[theme])) {
                colorVariablesCSS += `--color-${normalizeColorName(name)}: ${color};`;
            }
            colorVariablesCSS += "\n}";
        } else {
            // top level
            colorVariablesCSS += `--color-${normalizeColorName(theme)}: ${value};`;
        }
    }
    return colorVariablesCSS;
})();


// export const tailwindColorVariables = (() => {
//     const [_, theme] = Object.entries(themeColors)[0]
//     let output = "";
//
//
//
//
//     return output;
// });
