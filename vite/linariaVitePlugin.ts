import { shaker } from "@wyw-in-js/transform";
import wyw from "@wyw-in-js/vite";
import fs from "fs";
import * as sass from "sass";
import { PluginOption } from "vite";

interface Options {
  include?: RegExp[];
  exclude?: RegExp[];
}

export const linariaVitePlugin = (options: Options = {}): PluginOption => {
  return wyw({
    babelOptions: {
      configFile: false,
      presets: ["@babel/preset-typescript", "solid"],
      plugins: [
        [
          "babel-plugin-transform-remove-imports",
          {
            test: options.exclude,
          },
        ],
        "@babel/plugin-transform-export-namespace-from",
        [
          "transform-define",
          {
            "process.env.BASE_URL": process.env.BASE_PATH,
            // "import.meta.env.BASE_URL": process.env.BASE_PATH,
          },
        ],
      ],
    },
    rules: [
      {
        action: (babelOptions, ast, code, config, babel) => {
          // console.log("linaria", babelOptions.filename);
          const t = babel.types;
          const lines = ast.program.body;
          for (let idx = 0; idx < lines.length; ++idx) {
            const line = lines[idx];

            // solid
            if (
              line.type == "ExpressionStatement" &&
              line.expression.type == "CallExpression" &&
              line.expression.callee.type == "Identifier" &&
              line.expression.callee.name == "_$delegateEvents"
            ) {
              lines.splice(idx, 1);
              --idx;
              continue;
            }

            // solid-refresh
            if (
              line.type == "VariableDeclaration" &&
              line.declarations.length == 1 &&
              line.declarations[0].init?.type == "CallExpression" &&
              line.declarations[0].init.callee.type == "Identifier" &&
              (line.declarations[0].init.callee.name == "_$$component" ||
                line.declarations[0].init.callee.name == "_$$registry")
            ) {
              // lines.splice(idx, 1);
              // --idx;
              const id = line.declarations[0].id;
              line.declarations[0] = t.variableDeclarator(
                id,
                t.objectExpression([])
              );
              // line.declarations[0].init = t.numericLiteral(0);
              continue;
            }
          }
          return shaker(babelOptions, ast, code, config, babel);
        },
      },
    ],
    displayName: true,
    configFile: false,
    preprocessor: (selector, cssText) =>
      sass.compileString(
        selector.startsWith(".globals_")
          ? cssText
          : `${selector} { ${cssText} }`
      ).css,
    ...options,
  });
};

const linariaBugErrorRE = new RegExp(
  "ENOENT: no such file or directory, open '.*/port/node_modules/\\.vinxi/.*/deps/"
);
const _error = console.error;
let timeout: NodeJS.Timeout;
console.error = function (message?: any, ...optionalParams: any[]) {
  if (!linariaBugErrorRE.test(message)) {
    console.log("other");
    return _error(message, ...optionalParams);
  }
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    const time = new Date();
    fs.utimesSync("./app.config.ts", time, time);
    console.log(
      "restarting dev server due to linaria vite issue (https://github.com/vitejs/vite/issues/14493)"
    );
  }, 2000);
};
