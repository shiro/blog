import { css } from "@linaria/core";
import cn from "classnames";
import { Component, JSX } from "solid-js";
import DialogImage from "~/DialogImage";
import { breakpoint } from "~/style/commonStyle";

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
              class={cn(Card, "h-0 w-full pt-[100%]")}
              alt="gallery picture"
              image={image}
              thumbnail={thumbnails[idx()]}
              allowUpscale
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
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0;
  ${breakpoint("xs")} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${breakpoint("l")} {
    grid-template-columns: repeat(4, 1fr);
  }
  ${breakpoint("xl")} {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const Card = css`
  ${breakpoint("s", "m")} {
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

    div,
    img {
      object-fit: cover;
      height: 100%;
    }
  }
`;

export default GallerySite;
