import { colorVariablesCSS } from "~/style/colorVariableCSS";
import {
  color,
  heading1Text,
  primaryFontBold,
  primaryFontBoldItalic,
  primaryFontItalic,
  text,
} from "~/style/commonStyle";
import "~/style/fontPreamble.style";
import "~/style/layerPreamble.style";
import "~/style/reset.scss";
import "~/style/tw.style";
// import "~/style/styleLoadOrder";
import { css } from "@linaria/core";
import { baseText, bodyTextHeight } from "~/style/textStylesTS";

export const globals = css`
  @layer tw-base {
    html {
      ${baseText}
      ${colorVariablesCSS}
    }

    a,
    span {
      display: inline-block;
    }

    a,
    a:visited,
    a:hover,
    a:active {
      color: ${color("colors/primary-800")};
    }

    a:hover {
      text-decoration: underline;
    }

    button {
      font-size: inherit;
    }

    * {
      box-sizing: border-box;
    }
    /* #root * { */
    /*     position: relative; */
    /* } */

    body {
      min-height: 100vh;
      background: ${color("colors/special-bg")};
      overflow-x: hidden;

      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;

      ${text("primary", "body", "colors/text-600a")}
    }

    em {
      ${primaryFontItalic}
      strong {
        ${primaryFontBoldItalic}
      }
    }

    strong {
      color: ${color("colors/text-900a")};
      ${primaryFontBold}
    }

    #root {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    h1 {
      ${heading1Text};
    }

    p + p {
      margin-top: 4px;
    }
    p + h1 {
      margin-top: 36px;
    }
    p + h2 {
      margin-top: 16px;
    }
    p + h3 {
      margin-top: 16px;
    }
    p + h4 {
      margin-top: 16px;
    }
    p + h5 {
      margin-top: 16px;
    }

    h1 + p,
    h1 + ul,
    h1 + ol {
      margin-top: 16px;
    }
    h2 + p,
    h2 + ul,
    h2 + ol {
      margin-top: 16px;
    }
    h3 + p,
    h3 + ul,
    h3 + ol {
      margin-top: 8px;
    }
    h4 + p,
    h4 + ul,
    h4 + ol {
      margin-top: 8px;
    }
    h5 + p,
    h5 + ul,
    h5 + ol {
      margin-top: 8px;
    }

    p + ul,
    p + ol {
      margin-top: 16px;
    }
    ul + p,
    ol + p {
      margin-top: 16px;
    }
    ul + h1,
    ol + h1 {
      margin-top: 16px;
    }
    ul + h2,
    ol + h2 {
      margin-top: 16px;
    }
    ul + h3,
    ol + h3 {
      margin-top: 16px;
    }
    ul + h4,
    ol + h4 {
      margin-top: 16px;
    }
    ul + h5,
    ol + h5 {
      margin-top: 16px;
    }

    html {
      // firefox-only for now (https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-color)
      scrollbar-color: ${color("colors/primary-700")}
        ${color("colors/special-bg")};
      overflow-y: overlay;
    }

    /* hide arrows on number inputs */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type="number"] {
      -moz-appearance: textfield;
    }

    ::-webkit-scrollbar {
      width: 12px;
    }
    ::-webkit-scrollbar-track {
      border-radius: 4px;
      background: none;
    }
    ::-webkit-scrollbar-thumb {
      width: 4px;
      background: ${color("colors/primary-700")};
      border-left: solid transparent;
      border-left-width: 8px;
      background-clip: padding-box;
      transition: all 0.5s ease-in-out;
      &:hover {
        width: 12px;
        border-left-width: 0;
      }
    }
  }

  pre.shiki {
    margin-top: 16px;
    margin-bottom: 16px;
    background-color: ${color("colors/primary-50")};
    padding: 8px;
    .code-title {
      position: relative;
      top: -8px;
      left: -8px;
      padding: 4px 16px;
      width: calc(100% + 16px);
      background-color: ${color("colors/primary-200")};
    }
    .code-container .line {
      min-height: ${bodyTextHeight}px;
      white-space: pre-wrap !important;
    }
    .language-id {
      display: none;
    }
  }
  .theme-light .shiki.github-dark {
    display: none;
  }
  .theme-dark .shiki.github-light {
    display: none;
  }
`;
