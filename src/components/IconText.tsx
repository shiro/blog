import { css } from "@style-this/core";
import cn from "classnames";
import { Component, ComponentProps, JSX } from "solid-js";
import Icon from "~/components/Icon";

interface Props extends ComponentProps<"span"> {
  // TODO add all sizes
  size?: "small" | "sub" | "body" | "heading1" | "heading2" | "heading3";
  class?: string;
  icon?: string;
  description?: string;
  children?: JSX.Element;
  onclick?: () => void;
}

const IconText: Component<Props> = (props) => {
  const {
    class: $class,
    children,
    icon,
    description,
    ...rest
  } = $destructure(props);

  return (
    <span class={cn(_IconText, $class)} {...rest}>
      {icon ? <Icon icon={icon} description={description} /> : children}
    </span>
  );
};

const iconRatio = 0.63;
const marginTopRatio = 0.2;
const marginBottomRatio = 1 - iconRatio - marginTopRatio;

const _IconText = css`
  display: inline-flex;
  justify-content: center;
  margin: calc(${marginTopRatio} * var(--line-height)) 0
    calc(${marginBottomRatio} * var(--line-height));
  vertical-align: top;
  overflow: hidden;
  text-overflow: ellipsis;
  & > * {
    width: calc(${iconRatio} * var(--line-height));
    height: calc(${iconRatio} * var(--line-height));
  }
`;

export default IconText;
