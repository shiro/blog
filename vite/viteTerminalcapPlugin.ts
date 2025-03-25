import { type ResolvedConfig } from "vite";
import { compileTermcap } from "../src/test.compile";
import { PluginOption } from "vite";

export const terminalcapVitePlugin = (): PluginOption => {
  return {
    name: "viteTermcapPlugin",
    enforce: "pre",
    async load(id: string) {
      if (!id.endsWith(".termcap")) return undefined;

      const meta = await compileTermcap(id);

      return {
        code: `
import Terminalcap from "~/terminalcap/Terminalcap.vite";
export default Terminalcap(${JSON.stringify(meta)});
          `,
        moduleSideEffects: false,
      };
    },
  };
};
