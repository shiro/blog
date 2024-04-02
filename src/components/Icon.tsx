import { css } from "@linaria/core";
import cn from "classnames";
import { Component } from "solid-js";
import SVG from "~/components/SVG";
import { config } from "~/config";

interface Props {
  class?: string;
  icon: string;
  description?: string;
  onClick?: (ev: any) => void;
}

const Icon: Component<Props> = (props) => {
  const { icon, description, class: $class, ...rest } = $destructure(props);

  return (
    <SVG
      src={`${config.base}/icons/icon-${icon}.svg`}
      // alt={description}
      class={cn(_Icon, $class)}
      {...(rest as any)}
    />
  );
};

const _Icon = css`
  fill: currentColor;
  &.clickable {
    cursor: pointer;
  }

  path {
    fill: currentColor;
  }
`;

export default Icon;
