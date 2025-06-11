import { PluginOption } from "vite";

export const terminalcapVitePlugin = (): PluginOption => {
  return {
    name: "viteTermcapPlugin",
    enforce: "pre",
    async load(id: string) {
      const [filepath] = id.split("?");
      if (!filepath.endsWith(".cast")) return undefined;

      // const meta = await compileTermcap(filepath);
      const meta = {};

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
