export const debugCompileAsciinema: any = async () => {
  const { compileAsciinema } = await import("~/terminalcap/asciinema.server");
  return compileAsciinema(
    "./src/articles/9999-01-01-test/demo.cast"
  ) as any as Awaited<ReturnType<typeof compileAsciinema>>;
};
