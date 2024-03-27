import { style } from "~/style/styleUtilTS";

export const sizeSWidth = 600;
export const sizeMWidth = 960;
export const sizeLWidth = 1280;
export const sizeXLWidth = 1920;

const between = (min?: number, max?: number) => {
    let result = "";

    if (min != null) result += `(min-width: ${min}px)`;

    if (min != null && max != null) result += " and ";

    if (max != null) result += `(max-width: ${max - 1}px)`;

    return result;
};

export type ISize = "xs" | "s" | "m" | "l" | "xl";
const breakpointList: ISize[] = ["xs", "s", "m", "l", "xl"];

export const _breakpoint = (...sizes: ISize[]) => {
    if (!sizes.length)
        throw new Error(
            "at least one size needs to be specified in breakpoints"
        );

    const sizeQueries: string[] = [];

    for (const size of sizes) {
        switch (size) {
            case "xl":
                sizeQueries.push(`${between(sizeXLWidth, undefined)}`);
                break;
            case "l":
                sizeQueries.push(`${between(sizeLWidth, sizeXLWidth)}`);
                break;
            case "m":
                sizeQueries.push(`${between(sizeMWidth, sizeLWidth)}`);
                break;
            case "s":
                sizeQueries.push(`${between(sizeSWidth, sizeMWidth)}`);
                break;
            case "xs":
                sizeQueries.push(`${between(undefined, sizeSWidth)}`);
                break;
            default:
                throw new Error(`unknown breakpoint size '${size}'`);
        }
    }

    return style`@media ${sizeQueries.join(", ").trim()}`;
};

// valid from size..[infinity] (including size)
export const _breakpointFrom = (size: ISize) => {
    const index = breakpointList.findIndex((b) => b == size);
    return _breakpoint(...breakpointList.slice(index));
};

// valid from 0..size (including size)
export const _breakpointUntil = (size: ISize) => {
    const index = breakpointList.findIndex((b) => b == size);
    return _breakpoint(...breakpointList.slice(0, index));
};

export const _sizeXS = _breakpoint("xs");
export const _sizeS = _breakpoint("s");
export const _sizeM = _breakpoint("m");
export const _sizeL = _breakpoint("l");
export const _sizeXL = _breakpoint("xl");
