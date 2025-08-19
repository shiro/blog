import { PluginOption } from "vite";
import { compileAsciinema } from "../src/terminalcap/asciinema.server";

export const viteAsciinemaPlugin = (): PluginOption => {
  return {
    name: "viteAsciinemaPlugin",
    enforce: "pre",
    async load(id: string) {
      const [filepath] = id.split("?");
      if (!filepath.endsWith(".cast")) return undefined;

      const meta = await compileAsciinema(filepath);
      // const meta = {};

      return {
        code: `
import Asciinema from "~/terminalcap/Asciinema.vite";
export default Asciinema(${JSON.stringify(meta)});
          `,
        moduleSideEffects: true,
      };
    },
  };
};
