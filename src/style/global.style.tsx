import { colorVariablesCSS } from "~/style/colorVariableCSS";
import {
  color,
  heading1Text,
  primaryFontBold,
  primaryFontBoldItalic,
  primaryFontItalic,
  subText,
  text,
} from "~/style/commonStyle";
import "~/style/fontPreamble.style";
import "~/style/layerPreamble.style";
import "~/style/reset.scss";
import "~/style/tw.style";
// import "~/style/styleLoadOrder";
import { css } from "@linaria/core";
import {
  baseText,
  bodyTextHeight,
  smallTextHeight,
} from "~/style/textStylesTS";

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
      margin-top: 16px;
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
      margin-top: 4px;
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
    margin-top: 32px;
    margin-bottom: 32px;
    background-color: ${color("colors/primary-50")};
    padding: 8px;
    & > code {
      display: flex;
      flex-direction: column;
    }
    .line {
      ${subText};
      width: 100%;
      min-height: ${smallTextHeight}px;
      white-space: pre-wrap !important;
      &:last-child {
        display: none;
      }
    }
    .language-id {
      display: none;
    }
    .color-red {
      color: #f97583 !important;
    }
    .color-blue {
      color: rgb(158, 203, 255) !important;
    }
    .color-gray {
      color: ${color("colors/text-300a")} !important;
    }
    &.diff {
      .line {
        &::before {
          content: " ";
          padding: 0 8px;
          user-select: none;
        }
        &.add {
          background: rgba(53, 117, 42, 0.15);
          &::before {
            content: "+";
          }
        }
        &.remove {
          background: rgba(193, 34, 34, 0.15);
          &::before {
            content: "-";
          }
        }
      }
    }
  }
  .theme-light .shiki.github-dark {
    display: none;
  }
  .theme-dark .shiki.github-light {
    display: none;
  }
`;
