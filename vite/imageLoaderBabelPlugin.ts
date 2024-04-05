import type * as BabelCoreNamespace from "@babel/core";
import { PluginObj } from "@babel/core";
import path from "path";
import fs from "fs";
import util from "util";

type Babel = typeof BabelCoreNamespace;

interface Options {
  routesFile: string;
}

const outputDir = path.resolve(process.cwd(), "generated/image-loader");

export const imageLoaderBabelPlugin = (
  babel: Babel,
  options: Options
): PluginObj => {
  const t = babel.types;

  let exclude = false;
  let filename!: string;

  return {
    visitor: {
      Program(p, state) {
        const f = state.file.opts.filename!;

        exclude = !f?.endsWith(".tsx");
        exclude = !f?.endsWith("BlogIndex.tsx");
        filename = path.relative(process.cwd(), f);
      },
      ImportDeclaration(
        p: babel.NodePath<babel.types.ImportDeclaration>,
        state
      ) {
        if (exclude) return;

        for (const comment of p.node.leadingComments ?? []) {
          if (!comment.value.includes("size=")) {
            continue;
          }
          const sizeRaw = comment.value.split("size=")[1];
          const importSrc = p.node.source.value;

          const [width, height] = sizeRaw.split("x").map((x) => {
            const parsed = parseInt(x);
            if (isNaN(parsed)) return undefined;
            return parsed;
          });

          const srcAssetPath = path.join(path.dirname(filename), importSrc);

          const { name, ext } = path.parse(srcAssetPath);

          const dstAssetPath = path.join(
            outputDir,
            path.dirname(srcAssetPath),
            `${name}-${sizeRaw}${ext}`
          );
          const newImportSrc = path.relative(
            path.dirname(filename),
            dstAssetPath
          );

          p.node.source.value = newImportSrc;

          if (fs.existsSync(dstAssetPath)) return;

          // run in bg
          (async () => {
            const imageMagick = await import("imagemagick");
            const resize = util.promisify(imageMagick.resize);

            fs.mkdirSync(path.dirname(dstAssetPath), { recursive: true });

            const sizeOptions = {} as any;
            if (width) sizeOptions.width = width;
            if (height) sizeOptions.height = height;

            await resize({
              srcPath: srcAssetPath,
              dstPath: dstAssetPath,
              ...sizeOptions,
            });
          })();
        }
      },
    },
  };
};
