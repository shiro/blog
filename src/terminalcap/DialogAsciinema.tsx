import { ComponentProps } from "solid-js";
import Asciinema, { useTerminalcapState } from "~/terminalcap/Asciinema";
import { Dialog } from "@kobalte/core";
import { css } from "@linaria/core";
import { textDefinitions } from "~/style/commonStyle";

interface Props extends ComponentProps<typeof Asciinema> {}

const DialogAsciinema = (props: Props) => {
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
        {...props}
        class="mt-16 mb-16"
        fullscreenButtonComponent={Dialog.Trigger}
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
              {...props}
              fullscreenExitButtonComponent={Dialog.CloseButton}
              class={css`
                --max-font-size: ${textDefinitions.body.size}px !important;
              `}
              onClickOutside={() => handleChange(false)}
            />
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DialogAsciinema;
