import { css } from "@linaria/core";
import cn from "classnames";
import { Component } from "solid-js";
import SVG from "~/components/SVG";

interface Props {
  className?: string;
  icon: string;
  description?: string;
  onClick?: (ev: any) => void;
}

const Icon: Component<Props> = (props) => {
  const { icon, description, className, ...rest } = $destructure(props);

  return (
    <SVG
      class={cn(_Icon, className)}
      src={`/icons/icon-${icon}.svg`}
      // alt={description}
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
