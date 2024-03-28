import fs from "fs";
import path from "path";

const base = "./src/articles";
export const getArticlesSSG = () => {
  return fs.readdirSync(base).map((x) => {
    const raw = fs.readFileSync(path.join(base, x)).toString();
    const title = raw.split("\n")[0].slice(2);
    const url = `/articles/${x.split(".")[0]}`;
    return { title, url };
  });
};

export default async () => {
  return {
    data: getArticlesSSG(),
  }
}
