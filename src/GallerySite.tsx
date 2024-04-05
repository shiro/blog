import { Dialog } from "@kobalte/core";
import { css } from "@linaria/core";
import cn from "classnames";
import { JSX } from "solid-js";
import { breakpoint, breakpointUntil } from "~/style/commonStyle";

const images = Object.values(
  import.meta.glob("@assets/gallery/*.jpg", {
    query: "?lazy",
    import: "default",
    eager: true,
  })
);

const thumbnails = Object.values(
  import.meta.glob("@assets/gallery/*.jpg", {
    query: "?lazy&size=400x400",
    import: "default",
    eager: true,
  })
);

interface Props {
  children?: JSX.Element;
}

const GallerySite: Component<Props> = (props) => {
  return (
    <div class={cn(_GallerySite, "ultra-wide")}>
      <div class={Grid}>
        <For each={images}>
          {(Image, idx) => <Card Image={Image} Thumbnail={thumbnails[idx()]} />}
        </For>
      </div>
    </div>
  );
};

const Card: Component<any> = (props: any) => {
  // const { Image } = $destructure(props);
  return (
    <div class={cn(card, "relative h-0 w-full overflow-hidden pt-[100%]")}>
      <Dialog.Root>
        <Dialog.Trigger class="block">
          <props.Thumbnail
            class={cn("absolute left-0 top-0 h-full w-full object-cover")}
            alt="Gallery picture"
          />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay
            class="fixed inset-0 z-50 cursor-pointer"
            style={{ background: "rgba(0, 0, 0, 0.5)" }}
          />
          <div class="fixed inset-0 z-50 flex items-center justify-center">
            <Dialog.Content class="flex max-h-[90vh] max-w-[90vw] items-center justify-center">
              <Dialog.CloseButton>
                <props.Image
                  class={cn(
                    "max-h-[90vh]  max-w-[90vw] overflow-hidden object-contain"
                  )}
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

export default GallerySite;
