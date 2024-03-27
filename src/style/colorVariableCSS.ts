import { normalizeColorName, themeColors } from "~/style/colorsTs";

export const colorVariablesCSS = (() => {
  let colorVariablesCSS = "";
  for (const [key, value] of Object.entries(themeColors)) {
    const theme = key;
    if (typeof value == "object") {
      colorVariablesCSS += `&.theme-${theme} {`;
      for (const [name, color] of Object.entries(themeColors[theme])) {
        colorVariablesCSS += `--color-${normalizeColorName(name)}: ${color};`;
      }
      colorVariablesCSS += "\n}";
    } else {
      // top level
      colorVariablesCSS += `--color-${normalizeColorName(key)}: ${value};`;
    }
  }
  return colorVariablesCSS;
})();

