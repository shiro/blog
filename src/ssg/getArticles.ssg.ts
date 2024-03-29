import fs from "fs";
import matter from "gray-matter";
import path from "path";

const base = "./src/articles";
const files = fs.readdirSync(base);

export const getArticlesSSG = () => {
  return files
    .map((x) => {
      try {
        const raw = fs.readFileSync(path.join(base, x)).toString();
        const frontmatter = matter(raw).data;

        const description = raw.split("\n\n")[1];

        const title = frontmatter.title ?? raw.split("\n")[0].slice(2);
        const url = `/articles/${x.split(".")[0]}`;
        const date = x.split("-").slice(0, 3).reverse().join(".");
        return { title, url, description, date };
      } catch (err) {
        console.error(err);
      }
    })
    .filter(Boolean)
    .reverse();
};
const watchFiles = files.map((x) => path.resolve(base, x));

export default async () => {
  return {
    data: getArticlesSSG(),
    watchFiles,
  };
};
