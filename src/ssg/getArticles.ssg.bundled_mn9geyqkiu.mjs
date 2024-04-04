// src/ssg/getArticles.ssg.ts
import fs from "fs";
import matter from "gray-matter";
import path from "path";
var base = "./src/articles";
var files = fs.readdirSync(base);
var getArticlesSSG = () => {
  return files.map((x) => {
    try {
      const raw = fs.readFileSync(path.join(base, x, "article.mdx")).toString();
      const frontmatter = matter(raw).data;
      const title = frontmatter.title ?? raw.match(/# [^\n]*/)[0].slice(2);
      const description = raw.match(/# [^\n]+\n+([\s\S]+?)(?=\n\n)/)?.[1];
      const url = `/articles/${x.split(".")[0]}`;
      const date = x.split("-").slice(0, 3).reverse().join(".");
      return { title, url, description, date };
    } catch (err) {
    }
  }).filter(Boolean).reverse();
};
var watchFiles = files.map((x) => path.resolve(base, x, "article.mdx"));
var getArticles_ssg_default = async () => {
  return {
    data: getArticlesSSG(),
    watchFiles
  };
};
export {
  getArticles_ssg_default as default,
  getArticlesSSG
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL3NzZy9nZXRBcnRpY2xlcy5zc2cudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL2hvbWUvc2hpcm8vcHJvamVjdC9wb3J0L3NyYy9zc2cvZ2V0QXJ0aWNsZXMuc3NnLnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIi9ob21lL3NoaXJvL3Byb2plY3QvcG9ydC9zcmMvc3NnXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9ob21lL3NoaXJvL3Byb2plY3QvcG9ydC9zcmMvc3NnL2dldEFydGljbGVzLnNzZy50c1wiO2ltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCBtYXR0ZXIgZnJvbSBcImdyYXktbWF0dGVyXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuXG5jb25zdCBiYXNlID0gXCIuL3NyYy9hcnRpY2xlc1wiO1xuY29uc3QgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyhiYXNlKTtcblxuZXhwb3J0IGNvbnN0IGdldEFydGljbGVzU1NHID0gKCkgPT4ge1xuICByZXR1cm4gZmlsZXNcbiAgICAubWFwKCh4KSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByYXcgPSBmc1xuICAgICAgICAgIC5yZWFkRmlsZVN5bmMocGF0aC5qb2luKGJhc2UsIHgsIFwiYXJ0aWNsZS5tZHhcIikpXG4gICAgICAgICAgLnRvU3RyaW5nKCk7XG4gICAgICAgIGNvbnN0IGZyb250bWF0dGVyID0gbWF0dGVyKHJhdykuZGF0YTtcblxuICAgICAgICBjb25zdCB0aXRsZSA9IGZyb250bWF0dGVyLnRpdGxlID8/IHJhdy5tYXRjaCgvIyBbXlxcbl0qLykhWzBdLnNsaWNlKDIpO1xuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHJhdy5tYXRjaCgvIyBbXlxcbl0rXFxuKyhbXFxzXFxTXSs/KSg/PVxcblxcbikvKT8uWzFdO1xuXG4gICAgICAgIGNvbnN0IHVybCA9IGAvYXJ0aWNsZXMvJHt4LnNwbGl0KFwiLlwiKVswXX1gO1xuICAgICAgICBjb25zdCBkYXRlID0geC5zcGxpdChcIi1cIikuc2xpY2UoMCwgMykucmV2ZXJzZSgpLmpvaW4oXCIuXCIpO1xuICAgICAgICByZXR1cm4geyB0aXRsZSwgdXJsLCBkZXNjcmlwdGlvbiwgZGF0ZSB9O1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAucmV2ZXJzZSgpO1xufTtcbmNvbnN0IHdhdGNoRmlsZXMgPSBmaWxlcy5tYXAoKHgpID0+IHBhdGgucmVzb2x2ZShiYXNlLCB4LCBcImFydGljbGUubWR4XCIpKTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIGRhdGE6IGdldEFydGljbGVzU1NHKCksXG4gICAgd2F0Y2hGaWxlcyxcbiAgfTtcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNQLE9BQU8sUUFBUTtBQUNyUSxPQUFPLFlBQVk7QUFDbkIsT0FBTyxVQUFVO0FBRWpCLElBQU0sT0FBTztBQUNiLElBQU0sUUFBUSxHQUFHLFlBQVksSUFBSTtBQUUxQixJQUFNLGlCQUFpQixNQUFNO0FBQ2xDLFNBQU8sTUFDSixJQUFJLENBQUMsTUFBTTtBQUNWLFFBQUk7QUFDRixZQUFNLE1BQU0sR0FDVCxhQUFhLEtBQUssS0FBSyxNQUFNLEdBQUcsYUFBYSxDQUFDLEVBQzlDLFNBQVM7QUFDWixZQUFNLGNBQWMsT0FBTyxHQUFHLEVBQUU7QUFFaEMsWUFBTSxRQUFRLFlBQVksU0FBUyxJQUFJLE1BQU0sVUFBVSxFQUFHLENBQUMsRUFBRSxNQUFNLENBQUM7QUFDcEUsWUFBTSxjQUFjLElBQUksTUFBTSwrQkFBK0IsSUFBSSxDQUFDO0FBRWxFLFlBQU0sTUFBTSxhQUFhLEVBQUUsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3hDLFlBQU0sT0FBTyxFQUFFLE1BQU0sR0FBRyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssR0FBRztBQUN4RCxhQUFPLEVBQUUsT0FBTyxLQUFLLGFBQWEsS0FBSztBQUFBLElBQ3pDLFNBQVMsS0FBSztBQUFBLElBRWQ7QUFBQSxFQUNGLENBQUMsRUFDQSxPQUFPLE9BQU8sRUFDZCxRQUFRO0FBQ2I7QUFDQSxJQUFNLGFBQWEsTUFBTSxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsTUFBTSxHQUFHLGFBQWEsQ0FBQztBQUV4RSxJQUFPLDBCQUFRLFlBQVk7QUFDekIsU0FBTztBQUFBLElBQ0wsTUFBTSxlQUFlO0FBQUEsSUFDckI7QUFBQSxFQUNGO0FBQ0Y7IiwKICAibmFtZXMiOiBbXQp9Cg==
