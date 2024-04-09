import ProfilePicture from "@assets/about/profile-picture.jpg?lazy";
import { css } from "@linaria/core";
import cn from "classnames";
import { Component, JSX } from "solid-js";
import LabeledBox from "~/about/LabeledBox";
import ProjectsSection from "~/about/ProjectsSection";
import SkillsSection from "~/about/SkillsSection";
import SnakeGame from "~/about/SnakeGame";
import StatsBar from "~/about/StatsBar";
import StatusButton from "~/about/StatusButton";
import IconText from "~/components/IconText";
import { breakpointUntil } from "~/style/commonStyle";

interface Props {
  children?: JSX.Element;
}

const AboutSite: Component<Props> = (props) => {
  return (
    <div class={cn(_AboutSite, "mb-8 grid gap-4")}>
      <div class="flex flex-col gap-2 " style={{ "grid-area": "picture" }}>
        <div class="flex h-[192px] w-[192px] items-center justify-center rounded border-4 border-colors-primary-500">
          <ProfilePicture
            alt="Profile picture showing an manga-style face with glasses"
            class="h-full w-full"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2 " style={{ "grid-area": "stats" }}>
        <StatsBar icon="heart" progress={28} type="secondary" label="HP">
          12/85
        </StatsBar>
        <StatsBar class="" icon="star" progress={55} label="EXP">
          58/70
        </StatsBar>
        <StatusButton icon="email">Send message</StatusButton>
      </div>
      <div
        class="flex flex-col gap-2 text-center"
        style={{ "grid-area": "name" }}>
        <div class="bg-colors-primary-500 pl-8 pr-8 text-h1 text-colors-text-900a">
          Matic Utsumi Gačar
        </div>
      </div>

      <div
        class="flex flex-col gap-2 s:flex-row"
        style={{ "grid-area": "title" }}>
        <div class="text-nowrap text-h3">Level 21</div>
        <div class="text-nowrap text-h3 xs:text-h3">
          Enthusiastic Software Engineer
        </div>
      </div>
      <LabeledBox label="general" style={{ "grid-area": "general" }}>
        <ul class="flex min-h-full flex-col gap-1">
          <li class="flex gap-2 text-nowrap xs:text-h3 s:text-body">
            <IconText icon="github" />
            <a href="https://github.com/shiro">github.com/shiro</a>
          </li>
          <li class="flex gap-2 text-nowrap xs:text-h3 s:text-body">
            <IconText icon="email" />
            <a href="https://github.com/shiro">matic@uagi.io</a>
          </li>
          <li class="flex gap-2 text-nowrap xs:text-h3 s:text-body">
            <IconText icon="globe" />
            <a href="https://github.com/shiro">usagi.io</a>
          </li>
          <li class="flex gap-2 text-nowrap xs:text-h3 s:text-body">
            <IconText icon="house" />
            <span>Tokyo</span>
          </li>
        </ul>
      </LabeledBox>
      <LabeledBox label="about me" style={{ "grid-area": "about" }}>
        <p>I solve engineering problems to improve lives.</p>
        <p>
          My passion is building full-stack applications that have a lasting
          impact on the world and{" "}
          <span class="rounded bg-colors-primary-400 pl-2 pr-2">
            gaining experience
          </span>{" "}
          along the way.
        </p>
      </LabeledBox>
      <SnakeGame
        style={{ "grid-area": "snake" }}
        class="justify-self-stretch"
      />
      <div
        class="flex w-full flex-col items-stretch gap-4"
        style={{ "grid-area": "rest" }}>
        <ProjectsSection />
        <SkillsSection />
      </div>
    </div>
  );
};

const _AboutSite = css`
  justify-items: start;
  grid-template:
    "picture name     name  emtpy" auto
    "picture title   title emtpy " auto
    "picture general about about " auto
    "stats   general about about " auto
    "rest    rest    rest  rest  " auto
    "snake   snake   snake snake " auto
    / auto auto auto auto;
  ${breakpointUntil("m")} {
    grid-template:
      "picture name    name " auto
      "picture title   title" auto
      "picture general snake" auto
      "stats   general snake" auto
      "about   about   about" auto
      "rest    rest    rest " auto
      / auto auto 1fr;
  }
  ${breakpointUntil("s")} {
    justify-items: stretch;
    column-gap: 32px !important;
    grid-template:
      "name name" auto
      "picture title" auto
      "picture general" auto
      "stats   general" auto
      "about   about  " auto
      "rest    rest   " auto
      "snake   snake  " auto
      / auto 1fr;
  }
`;

export default AboutSite;
