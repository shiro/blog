export function _withStyle<C, S extends Record<any, any>>(
    component: C,
    styles: S
): C & { styles: S } {
    // add a dot before classnames
    for (const key of Object.keys(styles)) {
        if (typeof styles[key] == "string")
            (styles as Record<string, string>)[key] = "." + styles[key];
    }

    (component as any).styles = styles;
    return component as any;
}
