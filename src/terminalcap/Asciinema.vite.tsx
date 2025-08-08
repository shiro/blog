import { Component, ComponentProps } from "solid-js";
import DialogAsciinema from "~/terminalcap/DialogAsciinema";
import { debugCompileAsciinema } from "~/terminalcap/debugAsciinema.compile";
import { TermcapHeader, Segment } from "~/terminalcap/asciinema.server";
import Asciinema from "~/terminalcap/Asciinema";

interface Meta {
  header: TermcapHeader;
  encodedFrames: ComponentProps<typeof Asciinema>["encodedFrames"];
}

const AsciinemaVite: (meta: Meta) => Component = (meta) => () => {
  meta = debugCompileAsciinema();

  return <DialogAsciinema {...meta} />;
};

export default AsciinemaVite;
