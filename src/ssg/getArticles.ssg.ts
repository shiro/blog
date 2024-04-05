import fs from "fs";
import matter from "gray-matter";
import path from "path";

const base = "./src/articles";
const files = fs.readdirSync(base);

export const getArticlesSSG = () => {
  return files
    .map((x) => {
      try {
        const raw = fs
          .readFileSync(path.join(base, x, "article.mdx"))
          .toString();
        const frontmatter = matter(raw).data;
        if (frontmatter.private) return;

        const title = frontmatter.title ?? raw.match(/# [^\n]*/)![0].slice(2);
        const description = raw.match(/# [^\n]+\n+([\s\S]+?)(?=\n\n)/)?.[1];

        const url = `/articles/${x.split(".")[0]}`;
        const date = x.split("-").slice(0, 3).reverse().join(".");
        return { title, url, description, date };
      } catch (err) {
        // console.error(err);
      }
    })
    .filter(Boolean)
    .reverse();
};
const watchFiles = files.map((x) => path.resolve(base, x, "article.mdx"));

export default async () => {
  return {
    data: getArticlesSSG(),
    watchFiles,
  };
};
