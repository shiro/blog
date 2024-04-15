// src/ssg/getArticles.ssg.ts
import fs from "fs";
import matter from "gray-matter";
import path from "path";
var base = "./src/articles";
var files = fs.readdirSync(base);
var getArticlesSSG = () => {
  return files.map((slug) => {
    try {
      const raw = fs.readFileSync(path.join(base, slug, "article.mdx")).toString();
      const { data: frontmatter, content } = matter(raw);
      if (frontmatter.private)
        return;
      const title = frontmatter.title ?? "NO TITLE";
      const description = content.match(/\n\n([\s\S]+?)(?=\n\n)/)?.[1];
      const url = `/articles/${slug.split(".")[0]}`;
      const date = slug.split("-").slice(0, 3).reverse().join(".");
      return { slug, title, url, description, date };
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL3NzZy9nZXRBcnRpY2xlcy5zc2cudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL2hvbWUvc2hpcm8vcHJvamVjdC9wb3J0L3NyYy9zc2cvZ2V0QXJ0aWNsZXMuc3NnLnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIi9ob21lL3NoaXJvL3Byb2plY3QvcG9ydC9zcmMvc3NnXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9ob21lL3NoaXJvL3Byb2plY3QvcG9ydC9zcmMvc3NnL2dldEFydGljbGVzLnNzZy50c1wiO2ltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCBtYXR0ZXIgZnJvbSBcImdyYXktbWF0dGVyXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuXG5jb25zdCBiYXNlID0gXCIuL3NyYy9hcnRpY2xlc1wiO1xuY29uc3QgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyhiYXNlKTtcblxuZXhwb3J0IGNvbnN0IGdldEFydGljbGVzU1NHID0gKCkgPT4ge1xuICByZXR1cm4gZmlsZXNcbiAgICAubWFwKChzbHVnKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByYXcgPSBmc1xuICAgICAgICAgIC5yZWFkRmlsZVN5bmMocGF0aC5qb2luKGJhc2UsIHNsdWcsIFwiYXJ0aWNsZS5tZHhcIikpXG4gICAgICAgICAgLnRvU3RyaW5nKCk7XG4gICAgICAgIGNvbnN0IHsgZGF0YTogZnJvbnRtYXR0ZXIsIGNvbnRlbnQgfSA9IG1hdHRlcihyYXcpO1xuICAgICAgICBpZiAoZnJvbnRtYXR0ZXIucHJpdmF0ZSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHRpdGxlID0gZnJvbnRtYXR0ZXIudGl0bGUgPz8gXCJOTyBUSVRMRVwiO1xuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGNvbnRlbnQubWF0Y2goL1xcblxcbihbXFxzXFxTXSs/KSg/PVxcblxcbikvKT8uWzFdO1xuXG4gICAgICAgIGNvbnN0IHVybCA9IGAvYXJ0aWNsZXMvJHtzbHVnLnNwbGl0KFwiLlwiKVswXX1gO1xuICAgICAgICBjb25zdCBkYXRlID0gc2x1Zy5zcGxpdChcIi1cIikuc2xpY2UoMCwgMykucmV2ZXJzZSgpLmpvaW4oXCIuXCIpO1xuICAgICAgICByZXR1cm4geyBzbHVnLCB0aXRsZSwgdXJsLCBkZXNjcmlwdGlvbiwgZGF0ZSB9O1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAucmV2ZXJzZSgpO1xufTtcbmNvbnN0IHdhdGNoRmlsZXMgPSBmaWxlcy5tYXAoKHgpID0+IHBhdGgucmVzb2x2ZShiYXNlLCB4LCBcImFydGljbGUubWR4XCIpKTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIGRhdGE6IGdldEFydGljbGVzU1NHKCksXG4gICAgd2F0Y2hGaWxlcyxcbiAgfTtcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNQLE9BQU8sUUFBUTtBQUNyUSxPQUFPLFlBQVk7QUFDbkIsT0FBTyxVQUFVO0FBRWpCLElBQU0sT0FBTztBQUNiLElBQU0sUUFBUSxHQUFHLFlBQVksSUFBSTtBQUUxQixJQUFNLGlCQUFpQixNQUFNO0FBQ2xDLFNBQU8sTUFDSixJQUFJLENBQUMsU0FBUztBQUNiLFFBQUk7QUFDRixZQUFNLE1BQU0sR0FDVCxhQUFhLEtBQUssS0FBSyxNQUFNLE1BQU0sYUFBYSxDQUFDLEVBQ2pELFNBQVM7QUFDWixZQUFNLEVBQUUsTUFBTSxhQUFhLFFBQVEsSUFBSSxPQUFPLEdBQUc7QUFDakQsVUFBSSxZQUFZO0FBQVM7QUFFekIsWUFBTSxRQUFRLFlBQVksU0FBUztBQUNuQyxZQUFNLGNBQWMsUUFBUSxNQUFNLHdCQUF3QixJQUFJLENBQUM7QUFFL0QsWUFBTSxNQUFNLGFBQWEsS0FBSyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDM0MsWUFBTSxPQUFPLEtBQUssTUFBTSxHQUFHLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxHQUFHO0FBQzNELGFBQU8sRUFBRSxNQUFNLE9BQU8sS0FBSyxhQUFhLEtBQUs7QUFBQSxJQUMvQyxTQUFTLEtBQUs7QUFBQSxJQUVkO0FBQUEsRUFDRixDQUFDLEVBQ0EsT0FBTyxPQUFPLEVBQ2QsUUFBUTtBQUNiO0FBQ0EsSUFBTSxhQUFhLE1BQU0sSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRLE1BQU0sR0FBRyxhQUFhLENBQUM7QUFFeEUsSUFBTywwQkFBUSxZQUFZO0FBQ3pCLFNBQU87QUFBQSxJQUNMLE1BQU0sZUFBZTtBQUFBLElBQ3JCO0FBQUEsRUFDRjtBQUNGOyIsCiAgIm5hbWVzIjogW10KfQo=
