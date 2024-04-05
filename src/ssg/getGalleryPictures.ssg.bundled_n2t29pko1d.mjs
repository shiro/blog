// src/ssg/getGalleryPictures.ssg.ts
import fs from "fs";
import path from "path";
var base = "./public/generated/gallery";
var getGalleryPicturesSSG = () => {
  return Promise.all(
    fs.readdirSync(base).filter((x) => !x.includes(".thumbnail")).filter((x) => !x.includes(".meta")).map(async (x) => {
      const { name, ext } = path.parse(x);
      const prefix = "/generated/gallery";
      const meta = JSON.parse(
        (await fs.promises.readFile(path.join(base, `${name}.meta.json`))).toString()
      );
      return {
        url: `${prefix}/${x}`,
        thumbnailUrl: `${prefix}/${name}.thumbnail${ext}`,
        meta
      };
    }).filter(Boolean)
  );
};
var getGalleryPictures_ssg_default = async () => {
  return {
    data: await getGalleryPicturesSSG()
  };
};
export {
  getGalleryPictures_ssg_default as default,
  getGalleryPicturesSSG
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL3NzZy9nZXRHYWxsZXJ5UGljdHVyZXMuc3NnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX2luamVjdGVkX2ZpbGVuYW1lX18gPSBcIi9ob21lL3NoaXJvL3Byb2plY3QvcG9ydC9zcmMvc3NnL2dldEdhbGxlcnlQaWN0dXJlcy5zc2cudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiL2hvbWUvc2hpcm8vcHJvamVjdC9wb3J0L3NyYy9zc2dcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL2hvbWUvc2hpcm8vcHJvamVjdC9wb3J0L3NyYy9zc2cvZ2V0R2FsbGVyeVBpY3R1cmVzLnNzZy50c1wiO2ltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBleGVjIGFzIF9leGVjIH0gZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcblxuY29uc3QgYmFzZSA9IFwiLi9wdWJsaWMvZ2VuZXJhdGVkL2dhbGxlcnlcIjtcblxuZXhwb3J0IGNvbnN0IGdldEdhbGxlcnlQaWN0dXJlc1NTRyA9ICgpID0+IHtcbiAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgIGZzXG4gICAgICAucmVhZGRpclN5bmMoYmFzZSlcbiAgICAgIC5maWx0ZXIoKHgpID0+ICF4LmluY2x1ZGVzKFwiLnRodW1ibmFpbFwiKSlcbiAgICAgIC5maWx0ZXIoKHgpID0+ICF4LmluY2x1ZGVzKFwiLm1ldGFcIikpXG4gICAgICAubWFwKGFzeW5jICh4KSA9PiB7XG4gICAgICAgIGNvbnN0IHsgbmFtZSwgZXh0IH0gPSBwYXRoLnBhcnNlKHgpO1xuICAgICAgICBjb25zdCBwcmVmaXggPSBcIi9nZW5lcmF0ZWQvZ2FsbGVyeVwiO1xuXG4gICAgICAgIGNvbnN0IG1ldGEgPSBKU09OLnBhcnNlKFxuICAgICAgICAgIChcbiAgICAgICAgICAgIGF3YWl0IGZzLnByb21pc2VzLnJlYWRGaWxlKHBhdGguam9pbihiYXNlLCBgJHtuYW1lfS5tZXRhLmpzb25gKSlcbiAgICAgICAgICApLnRvU3RyaW5nKCksXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB1cmw6IGAke3ByZWZpeH0vJHt4fWAsXG4gICAgICAgICAgdGh1bWJuYWlsVXJsOiBgJHtwcmVmaXh9LyR7bmFtZX0udGh1bWJuYWlsJHtleHR9YCxcbiAgICAgICAgICBtZXRhLFxuICAgICAgICB9O1xuICAgICAgfSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbiksXG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgZGF0YTogYXdhaXQgZ2V0R2FsbGVyeVBpY3R1cmVzU1NHKCksXG4gIH07XG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvUSxPQUFPLFFBQVE7QUFDblIsT0FBTyxVQUFVO0FBR2pCLElBQU0sT0FBTztBQUVOLElBQU0sd0JBQXdCLE1BQU07QUFDekMsU0FBTyxRQUFRO0FBQUEsSUFDYixHQUNHLFlBQVksSUFBSSxFQUNoQixPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsU0FBUyxZQUFZLENBQUMsRUFDdkMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFNBQVMsT0FBTyxDQUFDLEVBQ2xDLElBQUksT0FBTyxNQUFNO0FBQ2hCLFlBQU0sRUFBRSxNQUFNLElBQUksSUFBSSxLQUFLLE1BQU0sQ0FBQztBQUNsQyxZQUFNLFNBQVM7QUFFZixZQUFNLE9BQU8sS0FBSztBQUFBLFNBRWQsTUFBTSxHQUFHLFNBQVMsU0FBUyxLQUFLLEtBQUssTUFBTSxHQUFHLElBQUksWUFBWSxDQUFDLEdBQy9ELFNBQVM7QUFBQSxNQUNiO0FBRUEsYUFBTztBQUFBLFFBQ0wsS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDO0FBQUEsUUFDbkIsY0FBYyxHQUFHLE1BQU0sSUFBSSxJQUFJLGFBQWEsR0FBRztBQUFBLFFBQy9DO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQyxFQUNBLE9BQU8sT0FBTztBQUFBLEVBQ25CO0FBQ0Y7QUFFQSxJQUFPLGlDQUFRLFlBQVk7QUFDekIsU0FBTztBQUFBLElBQ0wsTUFBTSxNQUFNLHNCQUFzQjtBQUFBLEVBQ3BDO0FBQ0Y7IiwKICAibmFtZXMiOiBbXQp9Cg==