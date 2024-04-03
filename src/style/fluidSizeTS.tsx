import { getUnit, style } from "./styleUtilTS";

const cssUnitMult = (value: string, multiplier: number) =>
  `${parseFloat(value) * multiplier}${getUnit(value)}`;

const scalingMap = [
  [200, 0.3],
  [380, 0.65],
  [500, 0.8],
  [720, 0.9],
  [1280, 1],
  [1920, 1],
  [4020, 1.3],
];

export const _calculateFluidProperty = (
  minVW: string,
  maxVW: string,
  minFontSize: string,
  maxFonSize: string,
  usesVariables: boolean
) => {
  // only check if units are the same on static values, no way to do it on variables
  if (!usesVariables) {
    const units = [minVW, maxVW, minFontSize, maxFonSize].map(getUnit);
    const allEqual = units.every((u) => u == units[0]);
    if (!allEqual) {
      throw new Error(
        `_calculateFluidProperty: all 4 values need to have the same units, got ${units}`
      );
    }
  }

  // calculate values without unit
  const _minFontSize = usesVariables
    ? minFontSize.replace(/(px|rem)/g, "")
    : parseFloat(minFontSize);
  const _maxFontSize = usesVariables
    ? maxFonSize.replace(/(px|rem)/g, "")
    : parseFloat(maxFonSize);

  // the pxToRem plugin converts "0px" to "0", which breaks things
  if (minVW == "0px") minVW = "0rem";

  return `calc(${minFontSize} + (${_maxFontSize} - ${_minFontSize}) * ((100vw - ${minVW}) / ${
    parseFloat(maxVW) - parseFloat(minVW)
  }))`;
};

export const remBase = 16;
export const pxToEmDepr = (value: string | number) =>
  parseFloat(value.toString()) / remBase + "em";
export const pxToRemDepr = (value: string | number) =>
  parseFloat(value.toString()) / remBase + "rem";
const pxToRemRuntime = (value: string | number) => `(${value}/${remBase}*1rem)`;

export const pxToEm = pxToEmDepr;
export const pxToRem = pxToRemDepr;

export const fluidScope = (
  callback: (fluid: (value: string | string[]) => any, isFirst: boolean) => any,
  convertPxToRem = true
) => {
  let result = "";
  let prevScreenSize = scalingMap[0][0];
  let prevFontScale = scalingMap[0][1];

  const normalizeValues = (values: string | string[]) => {
    const usesVariables = values.includes("var(");
    let important = false;
    if (typeof values == "string") values = values.split(" ");

    for (let i = 0; i < values.length; ++i) {
      if (values[i] == "!important") {
        important = true;
        values.splice(i, 1);
        --i;
        continue;
      }

      if (values[i].startsWith("var(")) {
        if (convertPxToRem) values[i] = pxToRemRuntime(values[i]);
      } else {
        let unit = getUnit(values[i]);

        if (!unit) {
          unit = "px";
          values[i] += "px";
        }
        if (convertPxToRem && unit == "px") values[i] = pxToRem(values[i]);
      }
    }

    return { values, important, usesVariables };
  };

  const fluidBase = (_values: string | string[]) => {
    const { values, important, usesVariables } = normalizeValues(_values);
    let result = values
      .map((value) =>
        usesVariables
          ? ` calc( ${value} * ${prevFontScale} )`
          : ` ${cssUnitMult(value, prevFontScale)}`
      )
      .join(" ")
      .trim();

    if (important) result += " !important";
    return result;
  };

  // first iteration (0 to first step)
  result += callback(fluidBase, true);

  for (const [screenSize, fontScale] of scalingMap.slice(1)) {
    const minVWSize = convertPxToRem
      ? pxToRem(prevScreenSize)
      : prevScreenSize + "px";
    const maxVWSize = convertPxToRem ? pxToRem(screenSize) : screenSize + "px";

    const fluid = (_values: string | string[]) => {
      const { values, important, usesVariables } = normalizeValues(_values);

      let expandedValue = "";
      for (const value of values) {
        const minSize = usesVariables
          ? `( ${value} * ${prevFontScale} )`
          : cssUnitMult(value, prevFontScale);
        const maxSize = usesVariables
          ? `( ${value} * ${fontScale} )`
          : cssUnitMult(value, fontScale);

        expandedValue += _calculateFluidProperty(
          minVWSize,
          maxVWSize,
          minSize,
          maxSize,
          usesVariables
        );
      }
      expandedValue = expandedValue.trim();

      if (important) expandedValue += " !important";
      return expandedValue;
    };

    result += style`
          @media (min-width: ${prevScreenSize + "px"}) {
            ${callback(fluid, false)}
          }
        `;
    prevFontScale = fontScale;
    prevScreenSize = screenSize;
  }

  // last iteration (last step to infinity)
  result += style`
      @media (min-width: ${prevScreenSize + "px"}) {
        ${callback(fluidBase, false)}
      }
    `;

  return result;
};

export const fluidProperty = (
  property: string,
  values: string | string[],
  convertPxToRem = true,
  important?: boolean
) => {
  // if (process?.env.DISABLE_FLUID_SIZE) {
  //     if (Array.isArray(values)) values = values.join(" ");
  //     return style`${property}: ${values};`;
  // }

  return fluidScope(
    (fluid, isFirst) =>
      style`${property}: ${fluid(values)}${
        !isFirst && important ? " !important" : ""
      };`,
    convertPxToRem
  );
};

export const _fluidFontSize = (value: string, important?: boolean) =>
  fluidProperty("font-size", value, false, important);
export const _fluidLineHeight = (value: string, important?: boolean) =>
  fluidProperty("line-height", value, true, important);
