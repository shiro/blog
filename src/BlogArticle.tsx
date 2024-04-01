import { JSX, Component } from "solid-js";
import { css } from "@linaria/core";
import cn from "classnames";

interface Props {
  children?: JSX.Element;
}

const BlogArticle: Component<Props> = (props) => {
  const { children } = $destructure(props);

  return <div class={cn(_BlogArticle)}>{children}</div>;
};

const _BlogArticle = css``;

export default BlogArticle;
