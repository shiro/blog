type FontLoader = (font: string, format: string) => string;

const japaneseCodeRange = (show: boolean) =>
  show ? `unicode-range: U+3000-30FF , U+FF00-FFEF , U+4E00-9FAF ;` : "";
const nameSuffix = (isFull: boolean) => (isFull ? "" : " JP Only");

const interPath = `/fonts/inter-3.19-roman/Inter`;

// language=SCSS
const notoFragments = (isFull: boolean, fontLoader?: FontLoader) => `
  /* noto-sans-jp-regular - japanese */
  @font-face {
    ${japaneseCodeRange(!isFull)}
    font-family: 'Noto Sans JP Regular${nameSuffix(isFull)}';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('${interPath}/noto-sans-jp-v40-japanese-regular.eot'); /* IE9 Compat Modes */
    src: local('Noto Sans Japanese Regular'),
    local('NotoSansJapanese-Regular'),
    url('${interPath}/noto-sans-jp-v40-japanese-regular.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
    url('${interPath}/noto-sans-jp-v40-japanese-regular.woff2') format('woff2'), /* Super Modern Browsers */
    url('${interPath}/noto-sans-jp-v40-japanese-regular.woff') format('woff'), /* Modern Browsers */
    url('${interPath}/noto-sans-jp-v40-japanese-regular.svg#NotoSansJP') format('svg'); /* Legacy iOS */
    ${
      fontLoader != null
        ? `src: ${fontLoader(
            `${interPath}/noto-sans-jp-v40-japanese-regular.woff2`,
            "woff2"
          )};`
        : ``
    }
  }

  /* noto-sans-jp-700 - japanese */
  @font-face {
    ${japaneseCodeRange(!isFull)}
    font-family: 'Noto Sans JP Bold${nameSuffix(isFull)}';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: url('${interPath}/noto-sans-jp-v40-japanese-700.eot'); /* IE9 Compat Modes */
    src: local('Noto Sans Japanese Medium'),
    local('NotoSansJapanese-Medium'),
    url('${interPath}/noto-sans-jp-v40-japanese-700.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
    url('${interPath}/noto-sans-jp-v40-japanese-700.woff2') format('woff2'), /* Super Modern Browsers */
    url('${interPath}/noto-sans-jp-v40-japanese-700.woff') format('woff'), /* Modern Browsers */
    url('${interPath}/noto-sans-jp-v40-japanese-700.svg#NotoSansJP') format('svg'); /* Legacy iOS */
    ${
      fontLoader != null
        ? `src: ${fontLoader(
            `${interPath}/noto-sans-jp-v40-japanese-700.woff2`,
            "woff2"
          )};`
        : ``
    }
  }
`;

// language=SCSS
export const fontFaceFragmentNativeInter = `
  ${notoFragments(true)}
  ${notoFragments(false)}
`;

// language=SCSS
export const fontFaceFragment = (fontLoader?: FontLoader) => `
  ${notoFragments(true, fontLoader)}
  ${notoFragments(false, fontLoader)}

  /* inter-regular - latin */
  @font-face {
    font-family: 'Inter Regular';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local(''),
    url('${interPath}-Regular-Roman.woff2') format('woff2'), /* Super Modern Browsers */
    url('${interPath}-Regular-Roman.woff') format('woff'), /* Modern Browsers */
    ${
      fontLoader != null
        ? `src: ${fontLoader(`${interPath}-Regular-Roman.woff2`, "woff2")};`
        : ``
    }
  }

  @font-face {
    font-family: 'Inter Regular Italic';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local(''),
    url('${interPath}-Italic-Roman.woff2') format('woff2'), /* Super Modern Browsers */
    url('${interPath}-Italic-Roman.woff') format('woff'), /* Modern Browsers */
    ${
      fontLoader != null
        ? `src: ${fontLoader(`${interPath}-Italic-Roman.woff2`, "woff2")};`
        : ``
    }
  }

  /* inter-600 - latin */
  @font-face {
    font-family: 'Inter Bold';
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: local('Inter SemiBold'),
    url('${interPath}-SemiBold-Roman.woff2') format('woff2'), /* Super Modern Browsers */
    url('${interPath}-SemiBold-Roman.woff') format('woff'), /* Modern Browsers */
    ${
      fontLoader != null
        ? `src: ${fontLoader(`${interPath}-SemiBold-Roman.woff2`, "woff2")};`
        : ``
    }
  }

  @font-face {
    font-family: 'Inter Bold Italic';
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: local('Inter SemiBold'),
    url('${interPath}-SemiBoldItalic-Roman.woff2') format('woff2'), /* Super Modern Browsers */
    url('${interPath}-SemiBoldItalic-Roman.woff') format('woff'), /* Modern Browsers */
    ${
      fontLoader != null
        ? `src: ${fontLoader(
            `${interPath}-SemiBoldItalic-Roman.woff2`,
            "woff2"
          )};`
        : ``
    }
  }
`;
