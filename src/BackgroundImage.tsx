import { css } from "@linaria/core";
import cn from "classnames";
import { Component, JSX } from "solid-js";
import SVG from "~/components/SVG";
import { color } from "~/style/commonStyle";

interface Props {
  children?: JSX.Element;
  style?: JSX.CSSProperties;
  class?: string;
}

const BackgroundImage: Component<Props> = (props) => {
  const { children, class: $class, ...rest } = $destructure(props);

  return (
    <div
      class={cn(
        _BackgroundImage,
        $class,
        "content-container relative xs:hidden l:block"
      )}
      {...rest}>
      <SVG class="fixed ml-[-380px]" src="/sakura.svg" />
    </div>
  );
};

const _BackgroundImage = css`
  * {
    fill: ${color("colors/primary-500")} !important;
  }
`;

export default BackgroundImage;
