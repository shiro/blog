import { Change } from "textdiff-create";
import { FrameHeader, TermcapHeader } from "~/test.compile";
import Terminalcap from "~/terminalcap/Terminalcap";
import { Component } from "solid-js";

interface Meta {
  header: TermcapHeader;
  encodedFrames: [[FrameHeader, string], ...[FrameHeader, Change[]][]];
}

const TerminalcapVite: (meta: Meta) => Component = (meta) => () => {
  return <Terminalcap {...meta} />;
};

export default TerminalcapVite;
