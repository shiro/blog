import { Component, ComponentProps } from "solid-js";
import DialogAsciinema from "~/terminalcap/DialogAsciinema";
import type { TermcapHeader } from "~/terminalcap/asciinema.server";
import Asciinema from "~/terminalcap/Asciinema";
import { useContext } from "solid-js";
import { createContext } from "solid-js";

interface AsciinemaContextValue
  extends Omit<
    ComponentProps<typeof DialogAsciinema>,
    "header" | "encodedFrames"
  > {
  class?: string;
}

const AsciinemaContext = createContext<AsciinemaContextValue>(undefined);
const useAsciinemaContext = () => useContext(AsciinemaContext);
export const AsciinemaProvider = AsciinemaContext.Provider;

interface Meta {
  header: TermcapHeader;
  encodedFrames: ComponentProps<typeof Asciinema>["encodedFrames"];
}

const AsciinemaVite: (meta: Meta) => Component = (meta) => () => {
  const ctx = useAsciinemaContext();

  return <DialogAsciinema {...meta} {...ctx} />;
};

export default AsciinemaVite;
