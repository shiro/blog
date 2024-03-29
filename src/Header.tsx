import { css } from "@linaria/core";
import cn from "classnames";
import { Component, JSX } from "solid-js";
import { config } from "~/config";
import { color, heading1Text } from "~/style/commonStyle";
import { heading1TextHeight } from "~/style/textStylesTS";
import LogoSVG from "../assets/logo.svg?component-solid";

interface Props {
  children?: JSX.Element;
}

const Header: Component<Props> = (props) => {
  return (
    <nav
      class={cn(_Header, "flex gap-8 mb-4 mt-4 items-center content-container")}
    >
      <a href={`${config.base}/`}>
        <LogoSVG class={cn(Logo, "w-12")} viewBox="0 0 60 94.564" />
      </a>
      <a
        class="text-h1 text-colors-text-900a underline"
        href={`${config.base}/`}
      >
        Blog
      </a>
      <a class={foo} href={`${config.base}/gallery`}>
        Gallery
      </a>
      <a class="text-h1 text-colors-text-300a" href={`${config.base}/about`}>
        About
      </a>
    </nav>
  );
};

const _Header = css``;
const Logo = css`
  height: ${heading1TextHeight}px;
  & path {
    fill: ${color("colors/text-300a")} !important;
  }
`;
const foo = css`
  ${heading1Text};
`;

export default Header;
