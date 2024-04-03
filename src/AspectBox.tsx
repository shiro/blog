import { JSX, Component } from "solid-js";
import { css } from "@linaria/core";
import cn from "classnames";

interface Props {
  children?: JSX.Element;
  style?: JSX.CSSProperties;
  class?: string;
}

const AspectBox: Component<Props> = (props) => {
  const { children, class: $class, ...rest } = $destructure(props);

  return (
    <div class={cn(_AspectBox, $class, "relative h-0 pt-[100%]")} {...rest}>
      <div class="absolute left-0 top-0 h-full w-full">{children}</div>
    </div>
  );
};

const _AspectBox = css``;

export default AspectBox;
