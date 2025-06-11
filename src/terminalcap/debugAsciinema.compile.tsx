import { compileAsciinema } from "~/terminalcap/asciinema.server";

export const debugCompileAsciinema = () =>
  compileAsciinema(
    "./src/articles/9999-01-01-test/demo.cast"
  ) as any as Awaited<ReturnType<typeof compileAsciinema>>;
