import { Component } from "solid-js";
import DialogAsciinema from "~/terminalcap/DialogAsciinema";
import { debugCompileAsciinema } from "~/terminalcap/debugAsciinema.compile";
import { TermcapHeader, Segment } from "~/terminalcap/asciinema.server";

interface Meta {
  header: TermcapHeader;
  encodedFrames: [time: number, lnr: number, segments: Segment[]][][];
}

const AsciinemaVite: (meta: Meta) => Component = (meta) => () => {
  meta = debugCompileAsciinema();

  return <DialogAsciinema {...meta} />;
};

export default AsciinemaVite;
