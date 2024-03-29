import fs from "fs";
import path from "path";
import { exec as _exec } from "child_process";
import imageMagick, * as ImageMagick from "imagemagick";
import { fileURLToPath } from "url";
import util from "util";

const exec = util.promisify(_exec);
const identify = util.promisify<string, ImageMagick.Features>(
  imageMagick.identify,
);
const resize = util.promisify(imageMagick.resize);

const root = path.resolve(fileURLToPath(path.dirname(import.meta.url)), "..");

const srcRoot = path.join(root, "input/gallery");
const dstRoot = path.join(root, "public/generated/gallery");
const watermarkFilePath = path.join(root, "assets/watermark.svg");

if (!fs.existsSync(watermarkFilePath))
  throw new Error(`watermark file '${watermarkFilePath}' not found`);

const { height: watermarkHeight } = await identify(watermarkFilePath);
if (!watermarkHeight) throw new Error("failed to get watermark image height");

fs.mkdirSync(srcRoot, { recursive: true });
fs.mkdirSync(dstRoot, { recursive: true });

await Promise.all(
  fs.readdirSync(srcRoot).map(async (filename) => {
    const inputPath = path.join(srcRoot, filename);
    const outputPath = path.join(dstRoot, filename);

    const thumbnailFilename = (() => {
      const { name, ext } = path.parse(filename);
      return `${name}.thumbnail${ext}`;
    })();
    const thumbnailOutputPath = path.join(dstRoot, thumbnailFilename);

    const { width, height } = await identify(inputPath);

    if (width == undefined || height == undefined)
      throw new Error(`failed to retrieve image dimensions for '${inputPath}'`);

    const minSize = width < height ? width : height;
    const watermarkTargetHeight = (minSize / 100) * 50;

    const command = [
      "convert",
      "-background",
      "none",
      "\\(",
      inputPath,
      "\\)",
      "\\(",
      watermarkFilePath,
      "-resize",
      `x${watermarkTargetHeight}`,
      "-gravity",
      "center",
      "\\)",
      "-compose",
      "dissolve",
      "-define",
      "compose:args=20,80",
      "-composite",
      outputPath,
    ].join(" ");
    await exec(command);
    console.log(`generated '${outputPath}`);
    await resize({
      srcPath: inputPath,
      dstPath: thumbnailOutputPath,
      [width > height ? "width" : "height"]: 500,
    });
    console.log(`generated '${thumbnailOutputPath}`);
  }),
);

const getAverageColor = async (inputPath: string, extent: string) => {
  const command = [
    "convert",
    inputPath,
    "-extent",
    extent,
    "-resize",
    "1x1",
    "txt:-",
  ].join(" ");
  const out = await exec(command);
  return out.stdout.match(/#[A-Z0-9]{6}/)![0];
};

await Promise.all(
  fs.readdirSync(dstRoot).map(async (filename) => {
    if (!filename.endsWith(".jpg") || filename.includes(".thumbnail")) return;

    const metaFilename = (() => {
      const { name } = path.parse(filename);
      return `${name}.meta.json`;
    })();

    const inputPath = path.join(dstRoot, filename);
    const outputPath = path.join(dstRoot, metaFilename);

    const { width, height } = await identify(inputPath);
    if (!width || !height) return;

    const mainColors = await Promise.all(
      [0, 1].map(async (ySector) => {
        return await getAverageColor(
          inputPath,
          `${width}x${Math.trunc(height / 2)}+0+${Math.trunc((height / 2) * ySector)}`,
        );
      }),
    );

    const meta = { mainColors };
    await fs.promises.writeFile(outputPath, JSON.stringify(meta, null, 4));
    console.log(`generated '${outputPath}`);
  }),
);
