// linaria strips istanbul symbols, causing tests to fail, should have been fixed in https://github.com/callstack/linaria/pull/324/files, but not really
/* istanbul ignore file */
import { _color } from "~/style/mixins/layoutTs";
import { css } from "@linaria/core";
import { _fluidFontSize as fluidFontSize, remBase } from "./fluidSizeTS";
import { style } from "./styleUtilTS";

const generalFontProperties = style`
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
`;

export const _primaryFont = style`
  font-family: 'Noto Sans JP Regular JP Only', 'Inter Regular', "Hiragino Kaku Gothic Pro", Osaka, "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
  ${generalFontProperties}
`;
export const _primaryFontItalic = style`
  font-family: 'Noto Sans JP Regular JP Only', 'Inter Regular Italic', 'Noto Sans Regular', "Hiragino Kaku Gothic Pro", Osaka, "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
  ${generalFontProperties}
`;
export const _primaryFontBold = style`
  font-family: 'Noto Sans JP Bold JP Only', 'Inter Bold', 'Noto Sans Bold', "Hiragino Kaku Gothic Pro", Osaka, "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
  ${generalFontProperties}
`;
export const _primaryFontBoldItalic = style`
  font-family: 'Noto Sans JP Bold JP Only', 'Inter Bold Italic', 'Noto Sans Bold', "Hiragino Kaku Gothic Pro", Osaka, "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
  ${generalFontProperties}
`;

const scaleFactor = 1.2;
// base
const bodyText = { size: 17, lineHeight: 28, fontAdjustment: 0 };
// small
const subText = {
    size: bodyText.size * (1 / scaleFactor),
    lineHeight: 22,
    fontAdjustment: 0,
};
const smallText = {
    size: subText.size * (1 / scaleFactor),
    lineHeight: 18,
    fontAdjustment: 0,
};
// big
const heading3Text = {
    size: bodyText.size * scaleFactor,
    lineHeight: 32,
    fontAdjustment: 0,
};
const heading2Text = {
    size: heading3Text.size * scaleFactor,
    lineHeight: 36,
    fontAdjustment: 0,
};
const heading1Text = {
    size: heading2Text.size * scaleFactor,
    lineHeight: 44,
    fontAdjustment: 0,
};
const bigText = {
    size: heading1Text.size * scaleFactor,
    lineHeight: 52,
    fontAdjustment: 0,
};
const largeText = {
    size: bigText.size * scaleFactor,
    lineHeight: 64,
    fontAdjustment: 0,
};
const jumboText = {
    size: largeText.size * scaleFactor,
    lineHeight: 76,
    fontAdjustment: 0,
};

export const subTextHeight = subText.lineHeight;
export const smallTextHeight = smallText.lineHeight;
export const bodyTextHeight = bodyText.lineHeight;
export const heading3TextHeight = heading3Text.lineHeight;
export const heading2TextHeight = heading2Text.lineHeight;
export const heading1TextHeight = heading1Text.lineHeight;
export const bigTextHeight = bigText.lineHeight;
export const largeTextHeight = largeText.lineHeight;
export const jumboTextHeight = jumboText.lineHeight;

const textFragment = (currentSize: {
    size: number;
    lineHeight: number;
    fontAdjustment: number;
}) =>
    `font-size: ${currentSize.size}px; line-height: ${currentSize.lineHeight}px; --line-height: ${currentSize.lineHeight}px; --font-adjustment: ${currentSize.fontAdjustment}px;`;

export const baseText = fluidFontSize(`${remBase}px`);
export const baseTextImportant = fluidFontSize(`${remBase}px`, true);

export const _jumboText = textFragment(jumboText);
export const _largeText = textFragment(largeText);
export const _bigText = textFragment(bigText);
export const _heading1Text = textFragment(heading1Text);
export const _heading2Text = textFragment(heading2Text);
export const _heading3Text = textFragment(heading3Text);
export const _bodyText = textFragment(bodyText);
export const _subText = textFragment(subText);
export const _smallText = textFragment(smallText);

export type _FontStyle = "primary" | "primaryItalic" | "primaryBold";
export type _FontSize =
    | "small"
    | "sub"
    | "body"
    | "heading1"
    | "heading2"
    | "heading3"
    | "big"
    | "large"
    | "jumbo";
export const _text = (
    font: _FontStyle,
    size: _FontSize,
    textColor?: string
) => {
    let resultStyle = "";

    switch (font) {
        case "primary":
            resultStyle += _primaryFont;
            break;
        case "primaryItalic":
            resultStyle += _primaryFontItalic;
            break;
        case "primaryBold":
            resultStyle += _primaryFontBold;
            break;
    }

    switch (size) {
        case "jumbo":
            resultStyle += _jumboText;
            break;
        case "large":
            resultStyle += _largeText;
            break;
        case "big":
            resultStyle += _bigText;
            break;
        case "heading1":
            resultStyle += _heading1Text;
            break;
        case "heading2":
            resultStyle += _heading2Text;
            break;
        case "heading3":
            resultStyle += _heading3Text;
            break;
        case "body":
            resultStyle += _bodyText;
            break;
        case "sub":
            resultStyle += _subText;
            break;
        case "small":
            resultStyle += _smallText;
            break;
        default:
            throw new Error(
                `text shorthand error: size '${size}' does not exist`
            );
    }

    if (textColor) {
        if (textColor == "inherit") {
            resultStyle += style`color: inherit;`;
        } else {
            resultStyle += style`color: ${_color(textColor)};`;
        }
    }

    return resultStyle;
};

export const _variableTextStyle = css`
    &.sub {
        ${_subText}
    }
    &.body {
        ${_bodyText}
    }
    &.heading1 {
        ${_heading1Text}
    }
    &.heading2 {
        ${_heading2Text}
    }
    &.heading3 {
        ${_heading3Text}
    }
`;
