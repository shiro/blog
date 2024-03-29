import fs from "fs";
import path from "path";
import { exec as _exec } from "child_process";

const base = "./public/generated/gallery";

export const getGalleryPicturesSSG = () => {
  return Promise.all(
    fs
      .readdirSync(base)
      .filter((x) => !x.includes(".thumbnail"))
      .filter((x) => !x.includes(".meta"))
      .map(async (x) => {
        const { name, ext } = path.parse(x);
        const prefix = "/generated/gallery";

        const meta = JSON.parse(
          (
            await fs.promises.readFile(path.join(base, `${name}.meta.json`))
          ).toString(),
        );

        return {
          picture: `${prefix}/${x}`,
          thumbnail: `${prefix}/${name}.thumbnail${ext}`,
          meta,
        };
      })
      .filter(Boolean),
  );
};

export default async () => {
  return {
    data: await getGalleryPicturesSSG(),
  };
};
