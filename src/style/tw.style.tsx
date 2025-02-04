import { css } from "@linaria/core";
import { normalizeColorName, themeColorList } from "~/style/colorsTs";
import {
  bigText,
  bodyText,
  breakpoint,
  breakpointFrom,
  breakpointUntil,
  contentContainer,
  heading1Text,
  heading2Text,
  heading3Text,
  jumboText,
  largeText,
  primaryFontBold,
  smallText,
  style,
  subText,
  textDefinitions,
} from "~/style/commonStyle";
import { pxToRem } from "~/style/fluidSizeTS";

const twColors = themeColorList
  .map(normalizeColorName)
  .map((color) => `--color-${color}: var(--color-${color});`)
  .join("\n");

const twTextStyles = Object.entries(textDefinitions)
  .map(
    ([name, text]) => style`
--text-${name}: ${text.size}px; 
--text-${name}--line-height: ${text.lineHeight}px;
`
  )
  .join("\n");

export const globals = css`
  @_import "tailwindcss";

  @theme {
    ${twColors}
    ${twTextStyles}
    --breakpoint-xs: 0px;
    --breakpoint-s: ${pxToRem("600px")};
    --breakpoint-m: ${pxToRem("960px")};
    --breakpoint-l: ${pxToRem("1280px")};
    --breakpoint-xl: ${pxToRem("1920px")};
  }

  @layer tw-base {
    @layer base {
      .text-sub {
        ${subText};
      }
      .text-body {
        ${bodyText};
      }
      .text-heading1 {
        ${heading1Text};
      }
      .text-heading2 {
        ${heading2Text};
      }
      .text-heading3 {
        ${heading3Text};
      }
      .text-big {
        ${bigText};
      }
      .text-large {
        ${largeText};
      }
      .text-jumbo {
        ${jumboText};
      }
      .text-bold {
        ${primaryFontBold};
      }
      .content-container {
        ${contentContainer};
      }
      .wide {
        ${breakpoint("m")} {
          margin-left: -32px;
          width: calc(100% + 64px);
        }
        ${breakpointUntil("m")} {
          margin-left: -16px;
          width: calc(100% + 32px);
        }
      }
      .ultra-wide {
        @extend .wide;
        ${breakpointFrom("l")} {
          margin-left: calc(-1 * (100vw - (600px + 30vw)) / 2);
          width: 100vw;
        }
      }
    }
  }
`;
