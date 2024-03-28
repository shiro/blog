import fs from "fs";
import path from "path";

const base = "./public/generated/gallery";
export const getGalleryPicturesSSG = () => {
  return fs
    .readdirSync(base)
    .filter((x) => !x.includes(".thumbnail"))
    .map((x) => {
      // const raw = fs.readFileSync(path.join(base, x)).toString();
      // const title = raw.split("\n")[0].slice(2);
      // const url = `/articles/${x.split(".")[0]}`;
      const { name, ext } = path.parse(x);
      const prefix = "/generated/gallery";

      return {
        picture: `${prefix}/${x}`,
        thumbnail: `${prefix}/${name}.thumbnail${ext}`,
      };
    });
};

export default async () => {
  return {
    data: getGalleryPicturesSSG(),
  };
};
