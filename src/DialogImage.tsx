import { Dialog } from "@kobalte/core";
import { css } from "@style-this/core";
import cn from "classnames";
import { Component, JSX } from "solid-js";
import { withStyle } from "~/style/commonStyle";

interface Props {
  children?: JSX.Element;
  style?: JSX.CSSProperties;
  class?: string;
  image: Component<any>;
  thumbnail: Component<any>;
  alt: string;
  allowUpscale?: boolean;
}

const DialogImage: Component<Props> = (props) => {
  const {
    children,
    class: $class,
    alt,
    thumbnail,
    image,
    allowUpscale,
    ...rest
  } = $destructure(props);

  return (
    <div class={cn($class, "relative w-full overflow-hidden")} {...rest}>
      <Dialog.Root>
        <Dialog.Trigger class="block w-full">
          <props.thumbnail
            class={cn(_Thumbnail, "max-w-[100vw]")}
            alt={alt}
            allowUpscale={allowUpscale}
          />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay
            class="fixed inset-0 z-50 cursor-pointer"
            style={{ background: "rgba(0, 0, 0, 0.5)" }}
          />
          <div class="fixed inset-0 z-50 flex w-full items-center justify-center">
            <Dialog.Content class="s:max-w-[90vw] flex max-h-[90vh] w-full items-center justify-center">
              <Dialog.CloseButton class="flex w-full justify-center">
                <props.image
                  class={cn(_FullscreenImage, "overflow-hidden object-contain")}
                  alt={alt}
                  maxHeight="80vh"
                />
              </Dialog.CloseButton>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

const _Thumbnail = css``;

const _FullscreenImage = css`
  --w_limit: 90vw !important;
  --h_limit: 90vh !important;

  /* don't upscale */
  max-width: calc(var(--width) * 1px);
  max-height: calc(var(--height) * 1px);
`;

export default withStyle(DialogImage, { Thumbnail: _Thumbnail });
