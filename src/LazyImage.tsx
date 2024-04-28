import { css } from "@linaria/core";
import cn from "classnames";
import { Component, ComponentProps, JSX } from "solid-js";
import { breakpoint, withStyle } from "~/style/commonStyle";

const isImageCached = (url: string) => {
  const img = new Image();
  img.src = url;
  return img.complete;
};

interface Props extends ComponentProps<"img"> {
  style?: JSX.CSSProperties;
  class?: string;
}

export interface LazyImageMeta {
  url: string;
  gradient: [from: string, to: string];
  width: number;
  height: number;
}

const LazyImage: (meta: LazyImageMeta) => Component<Props> =
  (meta) => (props) => {
    const { class: $class, style, ...rest } = $destructure(props);
    let hasJS = $signal(false);
    let loaded = $signal(false);

    $effect(() => {
      hasJS = true;
      loaded = isImageCached(meta.url);
    });

    return (
      <div
        class={cn(_LazyImage, $class)}
        style={{
          ...style,
          "--width": `${meta.width}`,
          "--height": `${meta.height}`,
          "--color1": meta.gradient[1],
          "--color2": meta.gradient[0],
        }}>
        <img
          class={cn({ hasJS, loaded })}
          src={meta.url}
          onload={() => {
            loaded = true;
          }}
          {...rest}
        />
      </div>
    );
  };

const _LazyImage = css`
  background: linear-gradient(45deg, var(--color1) 0%, var(--color2) 100%);
  object-fit: contain;

  --w_limit: 100%;
  --h_limit: 100vw;
  // we multiply by 100 to avoid CSS precision loss
  --x_sf_px: calc((1 / var(--width)) * var(--w_limit) * 100);
  --y_sf_px: calc((1 / var(--height)) * var(--h_limit) * 100);
  --sf_px: min(var(--x_sf_px), var(--y_sf_px));
  width: calc((var(--width) * var(--sf_px) / 100));
  height: calc((var(--height) * var(--sf_px) / 100));
  max-width: calc(var(--width) * 1px);
  max-height: calc(var(--height) * 1px);

  ${breakpoint("xs")} {
    object-fit: cover !important;
  }

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
      &.loaded {
        opacity: 1;
      }
      transition: opacity 200ms ease-in-out;
    }
  }
`;

export default withStyle(LazyImage, { container: _LazyImage });
