import { css } from "@linaria/core";
import cn from "classnames";
import { Component, JSX } from "solid-js";
import StatsBar from "~/about/StatsBar";
import StatusButton from "~/about/StatusButton";
import Icon from "~/components/Icon";
import IconText from "~/components/IconText";
import { breakpointUntil } from "~/style/commonStyle";

interface Props {
  children?: JSX.Element;
}

const AboutSite: Component<Props> = (props) => {
  return (
    <div class={cn(_AboutSite, "grid gap-4")}>
      <div class="flex flex-col gap-2 " style={{ "grid-area": "picture" }}>
        <div class="flex h-[192px] w-[192px] items-center justify-center rounded border-4 border-link-primary-900">
          <Icon icon="github" class="h-[88px] w-[139px]" />
        </div>
      </div>

      <div class="flex flex-col gap-2 " style={{ "grid-area": "stats" }}>
        <StatsBar
          class="mt-1"
          icon="heart"
          progress={28}
          type="secondary"
          label="HP">
          12/85
        </StatsBar>
        <StatsBar class="" icon="star" progress={55} label="EXP">
          58/70
        </StatsBar>
        <StatusButton icon="email">Send message</StatusButton>
      </div>
      <div class="flex flex-col gap-2" style={{ "grid-area": "name" }}>
        <div class="bg-colors-primary-500 pl-8 pr-8 text-h1 text-colors-text-900a">
          Matic Utsumi Gačar
        </div>
      </div>

      <div
        class="flex flex-col gap-2 s:flex-row"
        style={{ "grid-area": "title" }}>
        <div class="text-nowrap text-h3">Level 21</div>
        <div class="xs:text-h3 text-nowrap text-h3">
          Legendary Software Engineer
        </div>
      </div>
      <LabeledBox
        label="general"
        class="flex flex-col justify-stretch"
        style={{ "grid-area": "general" }}>
        <ul class="flex flex-col gap-1">
          <li class="flex gap-2">
            <IconText icon="github" />
            <a href="https://github.com/shiro">github.com/shiro</a>
          </li>
          <li class="flex gap-2">
            <IconText icon="email" />
            <a href="https://github.com/shiro">matic@uagi.io</a>
          </li>
          <li class="flex gap-2">
            <IconText icon="globe" />
            <a href="https://github.com/shiro">usagi.io</a>
          </li>
          <li class="flex gap-2">
            <IconText icon="house" />
            <span>Tokyo</span>
          </li>
        </ul>
      </LabeledBox>
      <LabeledBox
        label="about me"
        // class="flex flex-col justify-stretch"
        style={{ "grid-area": "about" }}>
        <p>I solve engineering problems to improve lives.</p>
        <p>
          My passion is building full-stack applications that have a lasting
          impact on the world and{" "}
          <span class="rounded bg-colors-primary-400 pl-2 pr-2">
            leveling up
          </span>{" "}
          along the way.
        </p>
      </LabeledBox>
    </div>
  );
};

const LabeledBox: Component<any> = (props: any) => {
  const { style, children, label } = $destructure(props);
  return (
    <div class="relative mt-[14px]" style={style}>
      <span class="absolute left-2 top-[-14px] bg-colors-special-bg pl-2 pr-2 text-colors-text-300a">
        {label}
      </span>
      <div class="min-h-full rounded-md border-2 border-colors-text-100a p-8">
        {children}
      </div>
    </div>
  );
};

const _AboutSite = css`
  justify-items: start;
  grid-template:
    "picture name     name  emtpy" auto
    "picture title    title emtpy" auto
    "picture general  about about" auto
    "stats   general  about about" auto
    / auto auto auto auto;
  ${breakpointUntil("m")} {
    grid-template:
      "picture name    " auto
      "picture title   " auto
      "picture general " auto
      "stats   general " auto
      "about   about   " auto
      / auto 1fr auto auto;
  }
  ${breakpointUntil("s")} {
    grid-template:
      "name name" auto
      "picture title" auto
      "picture general" auto
      "stats   general" auto
      "about   about  " auto
      / auto 1fr auto auto;
  }
`;

export default AboutSite;
