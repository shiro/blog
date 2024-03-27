import type * as BabelCoreNamespace from "@babel/core";
import { transformFileSync, PluginObj } from "@babel/core";

type Babel = typeof BabelCoreNamespace;

interface Options {
    routesFile: string;
}

const ssrBabelPlugin = (babel: Babel, options: Options): PluginObj => {
    const t = babel.types;

    let imported = false;
    let root: babel.NodePath<babel.types.Program>;

    return {
        visitor: {
            Program(path) {
                root = path;
                imported = false;
            },
            ImportDeclaration(
                path: babel.NodePath<babel.types.ImportDeclaration>,
                state
            ) {
                // const hasServerDecorator = path.node.leadingComments?.some(
                //     (comment) => comment.value.trim() == "@server"
                // );
                // if (!hasServerDecorator) return;
            },
        },
    };
};

export const customBabelStuff = (routesFile: string) => {
    //
    const t = transformFileSync(routesFile, {
        presets: ["@babel/preset-typescript", "babel-preset-solid"],
        ast: true,
    });
    console.log("<<<<<< AST", t?.ast);
};
