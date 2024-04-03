import { css } from "@linaria/core";
import cn from "classnames";
import { Component, JSX } from "solid-js";
import LabeledBox from "~/about/LabeledBox";
import IconText from "~/components/IconText";
import { breakpoint, breakpointUntil } from "~/style/commonStyle";

interface Props {
  style?: JSX.CSSProperties;
  class?: string;
}

const SkillsSection: Component<Props> = (props) => {
  const { class: $class, ...rest } = $destructure(props);

  return (
    <div class={cn(_SkillsSection, $class, "")} {...rest}>
      <LabeledBox label="skills">
        <div class={cn(SkillList, "flex flex-col flex-wrap gap-2")}>
          <Skill icon="bulb">Problem solving</Skill>
          <Skill icon="code">Software design</Skill>
          <Skill text="Ts">TypeScript / JavaScript</Skill>
          <Skill icon="react">React, React native</Skill>
          <Skill icon="redux">Redux, MobX, RxJS</Skill>
          <Skill icon="art">SASS, LESS, CSS in JS, TW</Skill>
          <Skill icon="nextjs">Next.js</Skill>
          <Skill icon="graphql">tRPC, GraphQL, REST</Skill>
          <Skill icon="solidjs">SolidJs</Skill>

          <Skill icon="nodejs">Node.js, Express</Skill>
          <Skill icon="git">Git / Version control</Skill>
          <Skill icon="webpack">Webpack, Vite, Grunt</Skill>
          <Skill icon="aws">AWS, Serverless</Skill>
          <Skill icon="database">Postgress, MySQL, Oracle DBMS</Skill>
          <Skill icon="jest">Jest, Cypress, Playwright</Skill>
          <Skill text="Ui">Figma, Photoshop, Illustrator</Skill>
          <Skill icon="agile">Project planning, scrum</Skill>
          <Skill icon="linux">Linux, open source</Skill>

          <Skill icon="python">Python</Skill>
          <Skill icon="server">Server management</Skill>
          <Skill icon="docker">Docker, Docker compose</Skill>
          <Skill icon="github-actions">CI/CD, Jenkins, GitHub actions</Skill>
          <Skill icon="rust">Rust, wgpu</Skill>
          <Skill icon="astro">Astro (static site generation)</Skill>
          <Skill text="C">C, C++, C#</Skill>
          <Skill icon="php">PHP, Laravel</Skill>
          <Skill icon="android">Java, Kotlin, Android</Skill>
        </div>
      </LabeledBox>
    </div>
  );
};

const Skill: Component<any> = (props: any) => {
  const { children, icon, text } = $destructure(props);
  return (
    <div class="flex gap-2">
      <div
        class={`box-content flex h-[28px] w-[28px] items-center justify-center rounded border-2 border-colors-text-600a`}>
        <Show when={icon} fallback={<span class="select-none">{text}</span>}>
          <IconText icon={icon} />
        </Show>
      </div>
      <span>{children}</span>
    </div>
  );
};

const _SkillsSection = css``;

const SkillList = css`
  height: 400px;
  ${breakpointUntil("m")} {
    height: 545px;
  }
  ${breakpoint("s")} {
    height: 554px;
  }
  ${breakpoint("xs")} {
    height: initial;
  }
`;

export default SkillsSection;
