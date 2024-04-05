import { Dialog } from "@kobalte/core";
import cn from "classnames";
import { Component, JSX } from "solid-js";

interface Props {
  children?: JSX.Element;
  style?: JSX.CSSProperties;
  class?: string;
  image: Component<any>;
  thumbnail: Component<any>;
  alt: string;
}

const DialogImage: Component<Props> = (props) => {
  const { children, class: $class, alt, ...rest } = $destructure(props);

  return (
    <div class={cn($class, "relative overflow-hidden")} {...rest}>
      <Dialog.Root>
        <Dialog.Trigger class="block">
          <props.thumbnail
            class={cn("absolute left-0 top-0 h-full w-full object-cover")}
            alt={alt}
          />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay
            class="fixed inset-0 z-50 cursor-pointer"
            style={{ background: "rgba(0, 0, 0, 0.5)" }}
          />
          <div class="fixed inset-0 z-50 flex items-center justify-center">
            <Dialog.Content class="flex max-h-[90vh] items-center justify-center s:max-w-[90vw]">
              <Dialog.CloseButton>
                <props.image
                  class={cn(
                    "max-h-[90vh] overflow-hidden object-contain s:max-w-[90vw]"
                  )}
                  alt={alt}
                />
              </Dialog.CloseButton>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default DialogImage;
