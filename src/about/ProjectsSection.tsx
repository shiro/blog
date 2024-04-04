import { Separator } from "@kobalte/core";
import { css } from "@linaria/core";
import cn from "classnames";
import { Component, JSX } from "solid-js";
import LabeledBox from "~/about/LabeledBox";
import IconText from "~/components/IconText";
import { config } from "~/config";
import { breakpoint } from "~/style/commonStyle";

interface Props {
  style?: JSX.CSSProperties;
  class?: string;
}

const ProjectsSection: Component<Props> = (props) => {
  const { class: $class, ...rest } = $destructure(props);

  return (
    <div class={cn(_ProjectsSection)} {...rest}>
      <LabeledBox label="recent projects">
        <div class="flex flex-col gap-8">
          <Project
            name="fujiPod web"
            descripton="Japanese dictionary and study platform"
            website="https://fujipod.com"
            images={[1, 2, 3].map((x) => `/preview-fujipod-web-${x}.jpg`)}>
            A free Japanese language study platform and dictionary with an
            active, growing community of over 100 users.
          </Project>

          <Separator.Root class="border-t-2 border-colors-primary-200" />

          <Project
            name="map2"
            descripton="Linux key remapping tool"
            website="https://github.com/shiro/map2"
            images={["/", "", ""]}>
            A tool for remapping inputs from keyboards, mice, joysticks,
            steering wheels and much more, increasing productivity, reducing
            wrist injuries and much more.
          </Project>

          <Separator.Root class="border-t-2 border-colors-primary-200" />

          <Project
            name="Blog of a programming rabbit"
            descripton="Blog and portfolio website"
            website="https://usagi.io"
            images={["/preview-blog-1.jpg"]}>
            My personal blog and portfolio website on which I discuss new
            technologies, libraries and awesome hacks that make the world go
            round.
          </Project>
        </div>
      </LabeledBox>
    </div>
  );
};

const Project: Component<any> = (props: any) => {
  const { children, name, descripton, website, images } = $destructure(props);
  const websiteName = $memo(website.split("://")[1]);
  return (
    <div>
      <div class="mb-8 flex xs:flex-col xs:gap-1 s:flex-row s:gap-4">
        <span class="text-nowrap text-h3 text-colors-text-900a">{name}</span>
        <span class="text-nowrap text-h3 text-colors-text-300a">
          {descripton}
        </span>
      </div>
      <div class="flex gap-4">
        <For each={images}>{(url) => <PreviewImage url={url} />}</For>
      </div>
      <div class="mt-4 flex gap-2">
        <IconText icon="globe" />{" "}
        <a target="_blank" href={website}>
          {websiteName}
        </a>
      </div>
      <div class="mt-2">{children}</div>
    </div>
  );
};

const PreviewImage: Component<any> = (props: any) => {
  return (
    <img
      src={`${config.base}/preview${props.url}`}
      class={cn(
        Image,
        "h-32 w-[30%] max-w-60 rounded border-2 border-colors-primary-800 object-cover xs:w-[50%]"
      )}
    />
  );
};

const _ProjectsSection = css``;

const Image = css`
  ${breakpoint("xs")} {
    &:not(:nth-child(-n + 2)) {
      display: none;
    }
  }
`;

export default ProjectsSection;
