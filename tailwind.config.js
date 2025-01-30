import theme from "./src/style/theme";

const colors = theme.colors.light;

const mappedColors = {};
for (const key of Object.keys(colors)) {
  const mappedKey = key.replaceAll("/", "-");
  mappedColors[mappedKey] = `var(--color-${mappedKey})`;
}

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

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,md,mdx}"],
  mode: "jit",
  theme: {
    // extend: {},
    colors: {
      ...mappedColors,
      transparent: "transparent",
    },
    fontSize: {
      sub: [`${subText.size}px`, `${subText.lineHeight}px`],
      small: [`${smallText.size}px`, `${smallText.lineHeight}px`],
      body: [`${bodyText.size}px`, `${bodyText.lineHeight}px`],
      big: [`${bigText.size}px`, `${bigText.lineHeight}px`],
      h1: [`${heading1Text.size}px`, `${heading1Text.lineHeight}px`],
      h2: [`${heading2Text.size}px`, `${heading2Text.lineHeight}px`],
      h3: [`${heading3Text.size}px`, `${heading3Text.lineHeight}px`],
      large: [`${largeText.size}px`, `${largeText.lineHeight}px`],
    },
    screens: {
      xs: "0px",
      s: "600px",
      m: "960px",
      l: "1280px",
      xl: "1920px",
    },
  },
  plugins: [],
};
