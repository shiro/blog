import type * as BabelCoreNamespace from "@babel/core";
import { PluginObj } from "@babel/core";

type Babel = typeof BabelCoreNamespace;
type ExcludesFalse = <T>(x: T | false) => x is T;

interface Options {
    dev?: boolean;
    server?: boolean;
}

export const serverImportBabelPlugin = (
    babel: Babel,
    options: Options = {}
): PluginObj => {
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
                const hasServerDecorator = path.node.leadingComments?.some(
                    (comment) => comment.value.trim() == "@server"
                );
                if (!hasServerDecorator) return;

                if (options.dev) {
                    if (!imported) {
                        imported = true;
                        root.unshiftContainer(
                            "body",
                            t.importDeclaration(
                                [
                                    t.importSpecifier(
                                        t.identifier("_isServer"),
                                        t.identifier("isServer")
                                    ),
                                ],
                                t.stringLiteral("solid-js/web")
                            )
                        );
                    }

                    const source = path.node.source.value;

                    // import foo from "bar";
                    const namespaceIdent = path.node.specifiers.filter(
                        (v) => v.type == "ImportDefaultSpecifier"
                    )[0]?.local.name;

                    // import {foo} from "bar";
                    const idents = path.node.specifiers
                        .filter((v) => v.type == "ImportSpecifier")
                        .map((v) => v.local.name);

                    path.replaceWithMultiple([
                        // let foo1, foo2
                        babel.types.variableDeclaration(
                            "let",
                            [...idents, namespaceIdent]
                                .filter(Boolean as any as ExcludesFalse)
                                .map((ident) =>
                                    t.variableDeclarator(t.identifier(ident))
                                )
                        ),
                        // if (isServer) { const v = await import("bar"); foo1 = v.foo1; ... }
                        t.ifStatement(
                            t.identifier("_isServer"),
                            t.blockStatement(
                                [
                                    t.variableDeclaration("const", [
                                        t.variableDeclarator(
                                            t.identifier("__importValue"),
                                            t.awaitExpression(
                                                t.callExpression(t.import(), [
                                                    t.stringLiteral(source),
                                                ])
                                            )
                                        ),
                                    ]),
                                    !!namespaceIdent &&
                                        t.expressionStatement(
                                            t.assignmentExpression(
                                                "=",
                                                t.identifier(namespaceIdent),
                                                t.identifier("__importValue")
                                            )
                                        ),
                                    ...idents.map((ident) =>
                                        t.expressionStatement(
                                            t.assignmentExpression(
                                                "=",
                                                t.identifier(ident),
                                                t.memberExpression(
                                                    t.identifier(
                                                        "__importValue"
                                                    ),
                                                    t.identifier(ident)
                                                )
                                            )
                                        )
                                    ),
                                ].filter(Boolean as any as ExcludesFalse)
                            )
                        ),
                    ]);
                    return;
                }
                if (!options.server) {
                    path.remove();
                }
            },
        },
    };
};
