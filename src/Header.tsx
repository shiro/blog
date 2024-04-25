import { css } from "@linaria/core";
import { useLocation } from "@solidjs/router";
import cn from "classnames";
import { Component, JSX, createMemo } from "solid-js";
import { config } from "~/config";
import { color } from "~/style/commonStyle";
import { heading1TextHeight } from "~/style/textStylesTS";
import LogoSVG from "../assets/logo.svg?component-solid";

interface Props {
  children?: JSX.Element;
}

const Header: Component<Props> = (props) => {
  const location = useLocation();

  const activeSection = $derefMemo(
    createMemo(() => {
      if (location.pathname.startsWith(`${config.base}/gallery`))
        return "gallery";
      if (location.pathname.startsWith(`${config.base}/about`)) return "about";
      return "blog";
    })
  );

  return (
    <nav
      class={cn(
        _Header,
        "content-container mb-4 mt-4 flex items-center gap-8"
      )}>
      <a href={`${config.base}/`}>
        <LogoSVG class={cn(Logo, "w-12")} viewBox="0 0 60 94.564" />
      </a>
      <NavLink href={`${config.base}/`} active={activeSection == "blog"}>
        Blog
      </NavLink>
      <NavLink
        href={`${config.base}/gallery`}
        active={activeSection == "gallery"}>
        Gallery
      </NavLink>
      <NavLink href={`${config.base}/about`} active={activeSection == "about"}>
        About
      </NavLink>
    </nav>
  );
};

const NavLink: Component<any> = (props: any) => {
  const { children, href, active } = $destructure(props);
  return (
    <a
      class={cn("text-h1", { "text-colors-text-900a underline": active })}
      href={href}>
      {children}
    </a>
  );
};

const _Header = css``;
const Logo = css`
  height: ${heading1TextHeight}px;
  & path {
    fill: ${color("colors/text-300a")} !important;
  }
`;

export default Header;
