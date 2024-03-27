import {
    normalizeColorName,
    themeColorList,
    themeColors,
} from "~/style/colorsTs";
import { _breakpoint, _breakpointUntil } from "~/style/sizesTS";
import { style } from "~/style/styleUtilTS";

export const _edgeChildrenNoMargin = style`
  &:first-child { margin-left: 0; }
  &:last-child { margin-right: 0; }
`;

export const _edgeChildrenNoPadding = style`
  &:first-child { padding-left: 0; }
  &:last-child { padding-right: 0; }
`;

export const _contentContainer = style`
  width: calc(600px + 30vw);
  margin-left: auto;
  margin-right: auto;

  ${_breakpointUntil("m")} {
    width: calc(100vw - 32px);
    margin-left: auto;
    margin-right: auto;
  }
  ${_breakpoint("m")} {
    width: calc(100vw - 64px);
    margin-left: auto;
    margin-right: auto;
  }
`;

export const _color = (value: string) => {
    let rest;
    [value, ...rest] = value.split(" ");

    const important = rest.some((v) => v == "!important");

    if (!themeColorList.includes(value)) {
        console.warn(
            `color '${value}' was not found in the current color palette`
        );
        console.trace();
    }

    value = normalizeColorName(value);
    return `var(--color-${value})${important ? " !important" : ""}`;
};

type ColorTheme = "light" | "dark";

export const _staticColor = (value: string, theme: ColorTheme) => {
    if (!themeColorList.includes(value)) {
        console.warn(
            `color '${value}' was not found in the current color palette`
        );
        console.trace();
        return;
    }

    return themeColors[theme][value];
};
