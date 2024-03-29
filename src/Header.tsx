import { JSX, Component } from "solid-js";
import { css } from "@linaria/core";
import cn from "classnames";
import LogoSVG from "../assets/logo.svg?component-solid";
import { color, heading1Text } from "~/style/commonStyle";
import { heading1TextHeight } from "~/style/textStylesTS";

interface Props {
  children?: JSX.Element;
}

const Header: Component<Props> = (props) => {
  return (
    <nav
      class={cn(_Header, "flex gap-8 pb-4 pt-4 items-center content-container")}
    >
      <LogoSVG class={cn(Logo, "w-12")} viewBox="0 0 60 94.564" />

      <a class="text-h1 text-colors-text-900a underline" href="/">
        Blog
      </a>
      <a class={foo} href="/gallery">
        Gallery
      </a>
      <a class="text-h1 text-colors-text-300a" href="/about">
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
