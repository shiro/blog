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
        let { data: frontmatter, content } = matter(raw);
        if (frontmatter.private) return;

        const title = frontmatter.title;
        if (!title) return;

        // trim import statements and empty lines
        content = (() => {
          const c = content.split("\n");
          while (c.length && (!c[0] || c[0].startsWith("import "))) {
            c.splice(0, 1);
          }
          return c.join("\n");
        })();

        const description = content.match(/([\s\S]+?)(?=\n\n)/)?.[1];

        const url = `/articles/${slug.split(".")[0]}`;
        const date = slug.split("-").slice(0, 3).reverse().join(".");
        return { slug, title, url, description, date };
      } catch (err) {
        // console.error(err);
      }
    })
    .filter((v) => !!v)
    .reverse();
};
const watchFiles = files.map((x) => path.resolve(base, x, "article.mdx"));

export default async () => {
  return {
    data: getArticlesSSG(),
    watchFiles,
  };
};
