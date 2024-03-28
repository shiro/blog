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

(await fs.promises.readdir(srcRoot)).map(async (filename) => {
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
  await resize({
    srcPath: inputPath,
    dstPath: thumbnailOutputPath,
    [width > height ? "width" : "height"]: 500,
  });
  console.log(`processed '${outputPath}`);
});

// const fs = fsSync.promises;
//
// const pictureCache = {
//     pictureFileNames: [] as string[],
// }
//
// export const returnPictures = (baseUrl?: string) => {
//     return pictureCache.pictureFileNames.map(file => {
//         return {
//             source: `${baseUrl}/gallery/${file}`,
//             thumb: `${baseUrl}/gallery/thumb/${file}`,
//         };
//     });
// }
//
// export const indexImagePass = async (baseUrl?: string) => {
//     const sourcePath = serverConfig.path.gallery;
//
//     // TODO move
//     if (!fsSync.existsSync(serverConfig.path.gallery)) {
//         await fs.mkdir(serverConfig.path.gallery, {recursive: true});
//         console.warn(`warn: gallery folder did not exist: ${serverConfig.path.gallery}, but was created now`);
//     }
//
//     if (!fsSync.existsSync(serverConfig.path.thumbnailCache))
//         await fs.mkdir(serverConfig.path.thumbnailCache, {recursive: true});
//
//     if (!fsSync.existsSync(serverConfig.path.pictureCache))
//         await fs.mkdir(serverConfig.path.pictureCache, {recursive: true});
//
//     const sourceImageFiles = await fs.readdir(sourcePath);
//
//     for (const file of sourceImageFiles) {
//         const pictureDestinationFile = path.join(serverConfig.path.pictureCache, file);
//         const thumbnailDestinationFIle = path.join(serverConfig.path.thumbnailCache, file);
//
//         // don't regenerate files if they exist already
//         if (fsSync.existsSync(pictureDestinationFile) &&
//             fsSync.existsSync(thumbnailDestinationFIle)) {
//             // if not in cache yet add it
//             if (!pictureCache.pictureFileNames.includes(file))
//                 pictureCache.pictureFileNames.push(file);
//
//             continue
//         }
//
//         const identify = util.promisify<string, ImageMagick.Features>(imageMagick.identify);
//
//         const {width, height} = await identify(path.join(serverConfig.path.gallery, file));
//
//         if (width == undefined || height == undefined)
//             throw new Error("failed to retrieve image dimensions");
//
//         {
//             const watermarkFile = serverConfig.files.watermark;
//             const sourceFile = path.join(serverConfig.path.gallery, file);
//             const command = [
//                 'composite',
//                 '-watermark', '70%',
//                 '-background', 'none',
//                 '\\(',
//                 watermarkFile,
//                 '-geometry', '+50+50',
//                 '-gravity', 'center',
//                 '\\)',
//                 sourceFile,
//                 pictureDestinationFile,
//             ];
//
//             await util.promisify(exec)(command.join(' '));
//         }
//
//         {
//             const resize = util.promisify(imageMagick.resize);
//             await resize({
//                 srcPath: pictureDestinationFile,
//                 dstPath: thumbnailDestinationFIle,
//                 [width > height ? "width" : "height"]: 500,
//             });
//         }
//
//         // add to cache and finish pass
//         pictureCache.pictureFileNames.push(file);
//         console.log(`added image '${file}' to image cache`);
//         return file;
//     }
// }
