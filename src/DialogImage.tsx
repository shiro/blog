import { Dialog } from "@kobalte/core";
import { css } from "@linaria/core";
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
}

const DialogImage: Component<Props> = (props) => {
  const {
    children,
    class: $class,
    alt,
    thumbnail,
    image,
    ...rest
  } = $destructure(props);

  return (
    <div class={cn($class, "relative overflow-hidden")} {...rest}>
      <Dialog.Root>
        <Dialog.Trigger class="block">
          <props.thumbnail class={cn(_Thumbnail, "max-w-[100vw]")} alt={alt} />
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
                  class={cn(_FullscreenImage, "overflow-hidden object-contain")}
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

const _Thumbnail = css``;

const _FullscreenImage = css`
  --h_limit: 90vh;
`;

export default withStyle(DialogImage, { Thumbnail: _Thumbnail });
