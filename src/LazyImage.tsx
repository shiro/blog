import { css } from "@linaria/core";
import cn from "classnames";
import { Component, ComponentProps, JSX } from "solid-js";
import { breakpoint, withStyle } from "~/style/commonStyle";

const isImageCached = (url: string, onLoad?: () => void) => {
  const img = new Image();
  img.src = url;
  img.decode().then(onLoad);
  return img.complete;
};

interface Props extends ComponentProps<"img"> {
  style?: JSX.CSSProperties;
  class?: string;
  maxHeight?: string;
  allowUpscale?: boolean;
}

export interface LazyImageMeta {
  url: string;
  gradient: [from: string, to: string];
  width: number;
  height: number;
}

export type LazyImageComponent = Component<Props>;

const LazyImage: (meta: LazyImageMeta) => Component<Props> =
  (meta) => (props) => {
    const {
      class: $class,
      style,
      maxHeight = "100vw",
      allowUpscale,
      ...rest
    } = $destructure(props);
    let hasJS = $signal(false);
    let loaded = $signal(false);

    $effect(() => {
      hasJS = true;
      loaded ||= isImageCached(meta.url, () => {
        loaded = true;
      });
    });

    return (
      <div
        class={cn(outer, $class)}
        style={{
          ...style,
          "--width": `${meta.width}`,
          "--w_limit": allowUpscale
            ? `100cqw`
            : `min(100cqw, calc(var(--width) * 1px))`,
          "--h_limit": allowUpscale
            ? `var(--max-height)`
            : `min(var(--max-height), calc(var(--height) * 1Px))`,
          "--height": `${meta.height}`,
          "--max-height": `${maxHeight}`,
          "--color1": meta.gradient[1],
          "--color2": meta.gradient[0],
        }}>
        <div class={cn(_LazyImage)}>
          <img class={cn({ hasJS, loaded })} src={meta.url} {...rest} />
        </div>
      </div>
    );
  };

const outer = css`
  width: 100%;
  container-type: inline-size;
  overflow: hidden;
  object-fit: contain;
  ${breakpoint("xs")} {
    object-fit: cover !important;
  }
`;

const _LazyImage = css`
  background: linear-gradient(45deg, var(--color1) 0%, var(--color2) 100%);
  margin: 0 auto;

  // we multiply by 100 to avoid CSS precision loss
  --x_sf_px: calc((1 / var(--width)) * var(--w_limit) * 100);
  --y_sf_px: calc((1 / var(--height)) * var(--h_limit) * 100);
  --sf_px: min(var(--x_sf_px), var(--y_sf_px));
  width: calc((var(--width) * var(--sf_px) / 100));
  // width: 80vw;
  height: calc((var(--height) * var(--sf_px) / 100));
  // height: calc(var(--x_sf_px));
  // height: 100cqw;
  // background: red;

  // container-type: inline-size;

  img {
    width: 100%;
    height: 100%;
    object-fit: inherit;
    // hide text when loading image
    text-indent: 100%;

    @supports (animation-name: fadeIn) {
      opacity: 0;
      animation: fadeIn 200ms 4s forwards;
    }
    @keyframes fadeIn {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    &.hasJS {
      animation: none;
      transition: opacity 200ms ease-in-out;
      &.loaded {
        opacity: 1;
      }
    }
  }
`;

export default withStyle(LazyImage, { container: _LazyImage });
