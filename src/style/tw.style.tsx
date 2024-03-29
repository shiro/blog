import { colorVariablesCSS } from "~/style/colorVariableCSS";
import {
  bigText,
  bodyText,
  breakpoint,
  breakpointFrom,
  breakpointUntil,
  color,
  contentContainer,
  heading1Text,
  heading2Text,
  heading3Text,
  jumboText,
  largeText,
  primaryFontBold,
  primaryFontBoldItalic,
  primaryFontItalic,
  subText,
  text,
} from "~/style/commonStyle";
import { css } from "@linaria/core";

export const globals = css`
  @layer tw-base {
    @tailwind base;
  }
  //
  @layer tw-utilities {
    @tailwind components;
    @tailwind utilities;
    @tailwind variants;
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
