import fs from "fs";
import matter from "gray-matter";
import path from "path";

const base = "./src/articles";
const files = fs.readdirSync(base);

export const getArticlesSSG = () => {
  return files
    .map((slug) => {
      try {
        const raw = fs
          .readFileSync(path.join(base, slug, "article.mdx"))
          .toString();
        const { data: frontmatter, content } = matter(raw);
        if (frontmatter.private) return;

        const title = frontmatter.title ?? "NO TITLE";
        const description = content.match(/\n\n([\s\S]+?)(?=\n\n)/)?.[1];

        const url = `/articles/${slug.split(".")[0]}`;
        const date = slug.split("-").slice(0, 3).reverse().join(".");
        return { slug, title, url, description, date };
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
