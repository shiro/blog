import linaria from '@linaria/vite';
import {makeBabelOptions} from "./viteBabel";


export default () => {
    return linaria({
        sourceMap: false,
        displayName: true,
        preprocessor: (selector, cssText) => selector.startsWith(".globals_") ? cssText : `${selector} { ${cssText} }`,
        babelOptions: makeBabelOptions({
            architecture: "server",
            linariaMode: true,
        }) as any,
    });
};