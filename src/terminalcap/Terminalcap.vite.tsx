import { Change } from "textdiff-create";
import { FrameHeader, TermcapHeader } from "~/test.compile";
import { Component } from "solid-js";
import DialogTerminalcap from "~/terminalcap/DialogTerminalcap";

interface Meta {
  header: TermcapHeader;
  encodedFrames: [[FrameHeader, string], ...[FrameHeader, Change[]][]];
}

const TerminalcapVite: (meta: Meta) => Component = (meta) => () => {
  return <DialogTerminalcap {...meta} />;
};

export default TerminalcapVite;
