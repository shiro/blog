import { ComponentProps } from "solid-js";
import Asciinema, { useTerminalcapState } from "~/terminalcap/Asciinema";
import cn from "classnames";
import { Dialog } from "@kobalte/core";

interface Props
  extends Omit<
    ComponentProps<typeof Asciinema>,
    | "class"
    | "onClickOutside"
    | "fullscreenButtonComponent"
    | "fullscreenExitButtonComponent"
    | keyof ReturnType<typeof useTerminalcapState>
  > {
  class?: string;
  dialogMaxFontSize?: string;
}

const DialogAsciinema = (props: Props) => {
  const { class: $class, dialogMaxFontSize, ...rest } = $destructure(props);
  const state1 = useTerminalcapState();
  const state2 = useTerminalcapState();
  let fullscreen = $signal(false);

  const handleChange = (open: boolean) => {
    fullscreen = open;
    if (open) {
      state2.playing[1](state1.playing[0]());
      state1.playing[1](false);
      state2.currentTime[1](state1.currentTime[0]());
      return;
    }
    state1.playing[1](state2.playing[0]());
    state2.playing[1](false);
    state1.currentTime[1](state2.currentTime[0]());
  };

  return (
    <Dialog.Root open={fullscreen} onOpenChange={handleChange}>
      <Asciinema
        {...state1}
        {...rest}
        class={cn($class, "mt-16 mb-16")}
        fullscreenButtonComponent={Dialog.Trigger}
        onKeyDown={(ev) => {
          rest.onKeyDown?.(ev);
          if (ev.defaultPrevented) return;
          switch (ev.key) {
            case "f": {
              handleChange(true);
              break;
            }
          }
        }}
      />
      <Dialog.Portal>
        <Dialog.Overlay
          class="fixed inset-0 z-50 cursor-pointer"
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => handleChange(false)}
        />
        <div class="fixed inset-0 z-51 flex items-center justify-center">
          <Dialog.Content class="flex w-[100vw] items-center justify-stretch">
            <Asciinema
              {...state2}
              {...rest}
              maxFontSize={dialogMaxFontSize ?? rest.maxFontSize}
              fullscreenExitButtonComponent={Dialog.CloseButton}
              onClickOutside={() => handleChange(false)}
            />
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DialogAsciinema;
