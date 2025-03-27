import { ComponentProps } from "solid-js";
import Terminalcap from "~/terminalcap/Terminalcap";
import { Dialog } from "@kobalte/core";
import { css } from "@linaria/core";
import { textDefinitions } from "~/style/commonStyle";

interface Props extends ComponentProps<typeof Terminalcap> {}

const DialogTerminalcap = (props: Props) => {
  // const f = <Terminalcap {...props} />;

  return (
    <Dialog.Root>
      <Terminalcap {...props} />
      <Dialog.Trigger class="block">Expand</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          class="fixed inset-0 z-50 cursor-pointer"
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
        />
        <div class="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content class="flex h-[100vh] w-[100vw] items-center justify-stretch">
            <Terminalcap
              {...props}
              class={css`
                --max-font-size: ${textDefinitions.body.size}px !important;
              `}
            />
            <Dialog.CloseButton class="flex justify-center">
              {/* <props.image */}
              {/* class={cn(_FullscreenImage, "overflow-hidden object-contain")} */}
              {/* alt={alt} */}
              {/* /> */}
            </Dialog.CloseButton>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
  return <Terminalcap {...props} />;
};

export default DialogTerminalcap;
