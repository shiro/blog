import { CSSProperties } from "@linaria/core";

export const getUnit = (value: string) => value.replaceAll(/[\d.,]/g, "");

export const style = (
    s: TemplateStringsArray,
    ...expr: Array<string | number | CSSProperties>
): string => {
    let res = "";
    for (let i = 0; i < Math.max(s.length, expr.length); ++i) {
        res += s[i] ?? "";
        res += expr[i] ?? "";
    }

    return res;
};
