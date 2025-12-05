import { exec as _exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";
import { type ResolvedConfig } from "vite";
import imageMagick, * as ImageMagick from "imagemagick";
import { LazyImageMeta } from "~/LazyImage";
import { parseDelimitedString } from "../src/util/parseDelimitedString";

const exec = util.promisify(_exec);
const resize = util.promisify(imageMagick.resize);
const identify = util.promisify<string, ImageMagick.Features>(
  imageMagick.identify
);

const acceptRE = new RegExp(".+\\.(jpg|jpeg|png|gif)\\?(lazy|size=)");

const getImageSize = async (filepath: string) => {
  const { width, height } = await identify(filepath);
  if (width == undefined || height == undefined)
    throw new Error(`failed to retrieve image dimensions for '${filepath}'`);
  return { width, height };
};

const getImageGradient = async (
  inputPath: string,
  [width, height]: [number, number]
) => {
  const h = Math.floor(height / 2);
  return Promise.all(
    [0, 1].map(async (factor) => {
      const command = [
        "convert",
        inputPath,
        "-extent",
        `${width}x${h}+0+${h * factor}`,
        "-resize",
        "1x1",
        "txt:-",
      ].join(" ");
      const out = await exec(command);
      return out.stdout.match(/#[A-Z0-9]{6}/)![0];
    })
  ) as Promise<[string, string]>;
};

export const viteImagePlugin = () => {
  const outputDir = path.resolve(process.cwd(), "generated/image-loader");
  let config: ResolvedConfig;

  return {
    name: "viteImagePlugin",
    enforce: "pre",
    configResolved: (resolvedConfig: any) => {
      config = resolvedConfig;
    },

    async load(id: string, ...args: any[]) {
      if (acceptRE.test(id)) {
        const plugin: any = config.plugins.find((x) => x.name == "vite:asset");

        const [filepath, queryRaw] = id.split("?");
        const query = parseDelimitedString(queryRaw, "&");

        const { name, ext } = path.parse(filepath);
        let finalImageFilepath = filepath;

        if (query["size"]) {
          const [width, height] = query["size"].split("x").map((x) => {
            const parsed = parseInt(x);
            if (isNaN(parsed)) return undefined;
            return parsed;
          });

          const resizedFilepath = path.join(
            outputDir,
            path.relative(process.cwd(), path.dirname(filepath)),
            `${name}.${query["size"]}${ext}`
          );

          if (!fs.existsSync(resizedFilepath)) {
            fs.mkdirSync(path.dirname(resizedFilepath), { recursive: true });

            const sizeOptions = {} as any;
            if (width) sizeOptions.width = width;
            if (height) sizeOptions.height = height;

            await resize({
              srcPath: filepath,
              dstPath: resizedFilepath,
              ...sizeOptions,
            });
          }

          finalImageFilepath = resizedFilepath;
        }

        const res = await plugin.load.handler.call(
          this,
          finalImageFilepath,
          ...args
        );
        if (!query["lazy"]) return res;
        const url = res.code.split(`"`)[1];
        if (!url) return;

        const metaFilepath = path.join(
          outputDir,
          path.relative(process.cwd(), path.dirname(filepath)),
          `${name}${ext}${query["size"] ? `.${query["size"]}` : ""}.meta.json`
        );

        let meta: LazyImageMeta;
        if (fs.existsSync(metaFilepath)) {
          meta = JSON.parse(
            (await fs.promises.readFile(metaFilepath)).toString()
          );
          // the url can change between dev/prod builds
          meta.url = url;
        } else {
          const { width: inputWidth, height: inputHeight } =
            await getImageSize(filepath);

          const { width, height } = await getImageSize(finalImageFilepath);

          const gradient = await getImageGradient(filepath, [
            inputWidth,
            inputHeight,
          ]);
          meta = { url, width, height, gradient };
          fs.mkdirSync(path.dirname(metaFilepath), { recursive: true });

          const { url: _, ...serializableMeta } = meta;
          fs.writeFileSync(metaFilepath, JSON.stringify(serializableMeta));
        }

        return {
          code: `
import LazyImage from "~/LazyImage";
export default LazyImage(${JSON.stringify(meta)});
          `,
          moduleSideEffects: false,
        };
      }
    },
  };
};
