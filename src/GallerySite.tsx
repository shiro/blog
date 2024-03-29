import { Dialog } from "@kobalte/core";
import { css } from "@linaria/core";
import cn from "classnames";
import { JSX } from "solid-js";
import { config } from "~/config";
import { getGalleryPictures } from "~/ssg/getGalleryPictures";
import { breakpoint, breakpointUntil } from "~/style/commonStyle";

interface Props {
  children?: JSX.Element;
}

const GallerySite: Component<Props> = (props) => {
  return (
    <div class={cn(_GallerySite, "ultra-wide")}>
      <div class={Grid}>
        <For each={getGalleryPictures()}>
          {(picture) => <Card picture={picture} />}
        </For>
      </div>
    </div>
  );
};

const Card: Component<any> = (props: any) => {
  const { picture } = $destructure(props);
  return (
    <div class={cn(card, "overflow-hidden relative w-full h-0 pt-[100%]")}>
      <Dialog.Root>
        <Dialog.Trigger>
          <img
            class={cn(
              Image,
              "absolute top-0 left-0 h-full w-full object-cover overflow-hidden",
            )}
            style={{
              "--color1": picture.meta.mainColors[0],
              "--color2": picture.meta.mainColors[1],
            }}
            src={`${config.base}${picture.thumbnail}`}
            alt="Gallery picture"
          />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay
            class="fixed inset-0 z-50 cursor-pointer"
            style={{ background: "rgba(0, 0, 0, 0.5)" }}
          />
          <div class="fixed inset-0 z-50 flex items-center justify-center">
            <Dialog.Content class="max-w-[90vw] max-h-[90vh] overflow-hidden flex items-center justify-center">
              <Dialog.CloseButton>
                <img
                  class={cn(
                    "overflow-hidden max-w-[90vw] max-h-[90vh] object-contain",
                  )}
                  src={`${config.base}${picture.picture}`}
                  alt="Gallery picture"
                />
              </Dialog.CloseButton>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

const _GallerySite = css``;

const Grid = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  ${breakpointUntil("m")} {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
  grid-gap: 0;
`;

const card = css`
  ${breakpoint("s")} {
    &:nth-child(1n + 18) + div {
      display: none;
    }
  }
  ${breakpoint("m")} {
    &:nth-child(1n + 18) + div {
      display: none;
    }
  }
`;

const Image = css`
  background: linear-gradient(45deg, var(--color1) 0%, var(--color2) 100%);
`;

export default GallerySite;