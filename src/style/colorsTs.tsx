import theme from "./theme";

export const themeColors = theme.colors as any;

export const themeColorList = (() => {
    const list: string[] = [];

    for (const colorSet of [themeColors, themeColors.light, themeColors.dark]) {
        for (const [key, value] of Object.entries(colorSet)) {
            if (typeof value == "string") list.push(key);
        }
    }

    return list;
})();

export const normalizeColorName = (colorName: string) =>
    colorName.replace(/\//g, "-");
