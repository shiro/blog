import * as layoutMixins from "~/style/mixins/layoutTs";
import { _boxShadowMixin, _dropShadowMixin } from "~/style/mixins/shadowMixins";
import * as sizes from "~/style/sizesTS";
import * as reactStyleUtil from "~/style/styleUtil";
import * as styleUtils from "~/style/styleUtilTS";
import * as textStyles from "~/style/textStylesTS";

export const textDefinitions = textStyles._textDefinitions;
export const jumboText = textStyles._jumboText;
export const largeText = textStyles._largeText;
export const bigText = textStyles._bigText;
export const heading1Text = textStyles._heading1Text;
export const heading2Text = textStyles._heading2Text;
export const heading3Text = textStyles._heading3Text;
export const bodyText = textStyles._bodyText;
export const subText = textStyles._subText;
export const smallText = textStyles._smallText;

export type FontSize = textStyles._FontSize;
export type FontStyle = textStyles._FontStyle;
export const primaryFont = textStyles._primaryFont;
export const primaryFontItalic = textStyles._primaryFontItalic;
export const primaryFontBold = textStyles._primaryFontBold;
export const primaryFontBoldItalic = textStyles._primaryFontBoldItalic;

export const text = textStyles._text;
export const variableTextStyle = textStyles._variableTextStyle;

export const sizeXS = sizes._sizeXS;
export const sizeS = sizes._sizeS;
export const sizeM = sizes._sizeM;
export const sizeL = sizes._sizeL;
export const sizeXL = sizes._sizeXL;
export const breakpoint = sizes._breakpoint;
export const breakpointFrom = sizes._breakpointFrom;
export const breakpointUntil = sizes._breakpointUntil;

export const style = styleUtils.style;

export const edgeChildrenNoMargin = layoutMixins._edgeChildrenNoMargin;
export const edgeChildrenNoPadding = layoutMixins._edgeChildrenNoPadding;
export const contentContainer = layoutMixins._contentContainer;

export const color = layoutMixins._color;
export const staticColor = layoutMixins._staticColor;

export const withStyle = reactStyleUtil._withStyle;

export const dropShadow = _dropShadowMixin;
export const boxShadow = _boxShadowMixin;
