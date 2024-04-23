import { css } from "@linaria/core";
import cn from "classnames";
import { Component, JSX } from "solid-js";
import DialogImage from "~/DialogImage";
import { registerRoute } from "solid-start-preload";
import { breakpoint, breakpointUntil } from "~/style/commonStyle";

const images: Component[] = Object.values(
  import.meta.glob("@assets/gallery/*.jpg", {
    query: "?lazy",
    import: "default",
    eager: true,
  })
);

const thumbnails: Component[] = Object.values(
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
          {(image, idx) => (
            <DialogImage
              class={cn(card, "h-0 w-full pt-[100%]")}
              alt="gallery picture"
              image={image}
              thumbnail={thumbnails[idx()]}
            />
          )}
        </For>
      </div>
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

  ${DialogImage.styles.Thumbnail} {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

registerRoute({ path: "/gallery" });

export default GallerySite;
