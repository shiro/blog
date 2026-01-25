import theme from "./theme";

export const themeColors = theme.colors;

export const themeColorNameList = (() => {
  const set = new Set<string>();

  for (const colorSet of [themeColors, themeColors.light, themeColors.dark]) {
    for (const [key, value] of Object.entries(colorSet)) {
      if (typeof value == "string") set.add(key);
    }
  }

  return set;
})();

export const themeColorList = (() => {
  const list: string[] = [];

  for (const colorSet of [themeColors, themeColors.light, themeColors.dark]) {
    for (const value of Object.values(colorSet)) {
      if (typeof value == "string") list.push(value);
    }
  }

  return list;
})();

export const normalizeColorName = (colorName: string) =>
  colorName.replace(/\//g, "-");
