import { JSX, Component } from "solid-js";
import { css } from "@linaria/core";
import cn from "classnames";
import IconText from "~/components/IconText";

interface Props {
  children?: JSX.Element;
  style?: JSX.CSSProperties;
  class?: string;
}

const Footer: Component<Props> = (props) => {
  const { children, class: $class, ...rest } = $destructure(props);

  return (
    <div
      class={cn($class, "content-container mt-auto pb-4 pt-4 text-center")}
      {...rest}>
      Check the code on{" "}
      <a href="https://github.com/shiro/blog" target="_blank">
        <IconText icon="github" class="pl-1" /> Github
      </a>
    </div>
  );
};

export default Footer;
