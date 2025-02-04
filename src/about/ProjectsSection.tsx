import { Separator } from "@kobalte/core";
import { css } from "@linaria/core";
import cn from "classnames";
import { Component, JSX } from "solid-js";
import LabeledBox from "~/about/LabeledBox";
import IconText from "~/components/IconText";
import { breakpoint } from "~/style/commonStyle";
import ProjectImageBlog1 from "@assets/about/project-blog-1.jpg?lazy";
import ProjectImageMap21 from "@assets/about/project-map2-1.jpg?lazy";
import ProjectImageMap22 from "@assets/about/project-map2-2.jpg?lazy";
import ProjectImageFujipodWeb1 from "@assets/about/project-fujipod-web-1.jpg?lazy";
import ProjectImageFujipodWeb2 from "@assets/about/project-fujipod-web-2.jpg?lazy";
import ProjectImageFujipodWeb3 from "@assets/about/project-fujipod-web-3.jpg?lazy";
// @ts-ignore
import ProjectThumbnailBlog1 from "@assets/about/project-blog-1.jpg?lazy&size=300x";
// @ts-ignore
import ProjectThumbnailMap21 from "@assets/about/project-map2-1.jpg?lazy&size=300x";
// @ts-ignore
import ProjectThumbnailMap22 from "@assets/about/project-map2-2.jpg?lazy&size=300x";
// @ts-ignore
import ProjectThumbnailFujipodWeb1 from "@assets/about/project-fujipod-web-1.jpg?lazy&size=300x";
// @ts-ignore
import ProjectThumbnailFujipodWeb2 from "@assets/about/project-fujipod-web-2.jpg?lazy&size=300x";
// @ts-ignore
import ProjectThumbnailFujipodWeb3 from "@assets/about/project-fujipod-web-3.jpg?lazy&size=300x";
import DialogImage from "~/DialogImage";

interface Props {
  style?: JSX.CSSProperties;
  class?: string;
}

const ProjectsSection: Component<Props> = (props) => {
  const { class: $class, ...rest } = $destructure(props);

  return (
    <div {...rest}>
      <LabeledBox label="recent projects">
        <div class="flex flex-col gap-8">
          <Project
            name="fujiPod web"
            descripton="Japanese dictionary and study platform"
            website="https://fujipod.com"
            images={[
              ProjectImageFujipodWeb1,
              ProjectImageFujipodWeb2,
              ProjectImageFujipodWeb3,
            ]}
            thumbnails={[
              ProjectThumbnailFujipodWeb1,
              ProjectThumbnailFujipodWeb2,
              ProjectThumbnailFujipodWeb3,
            ]}>
            <p>
              A free Japanese language study platform and dictionary with an
              active and growing community.
            </p>
            <ul class="list-disc pl-8">
              <li>
                curated word/kanji dictionary with English and Japanese search
                functionality
              </li>
              <li>user progress tracking</li>
              <li>
                novel podcast system that tailors content to the user's current
                vocabulary and skill level in real time
              </li>
              <li>kanji writing practice</li>
              <li>
                memorization and spaced repetition quizzes (based on the
                forgetting curve)
              </li>
              <li>example sentences with self-recorded audio</li>
              <li>user created study lists</li>
              <li>social features (friend requests, activity history, etc.)</li>
              <li>interactive grammar lessons</li>
            </ul>
          </Project>

          <Separator.Root class="border-t-2 border-colors-primary-200" />

          <Project
            name="map2"
            descripton="Linux key remapping tool"
            website="https://github.com/shiro/map2"
            images={[ProjectImageMap21, ProjectImageMap22]}
            thumbnails={[ProjectThumbnailMap21, ProjectThumbnailMap22]}>
            <p>
              A tool for remapping inputs from keyboards, mice, joysticks,
              steering wheels and much more, increasing productivity, reducing
              wrist injuries and much more.
            </p>
            <ul class="list-disc pl-8">
              <li>Remap keys, mouse events, controllers, pedals, and more!</li>
              <li> Highly configurable, using Python</li>
              <li>Blazingly fast, written in Rust</li>
              <li>Tiny install size (around 5Mb), almost no dependencies</li>
            </ul>
          </Project>

          <Separator.Root class="border-t-2 border-colors-primary-200" />

          <Project
            name="Blog of a programming rabbit"
            descripton="Blog and portfolio website"
            website="https://usagi.io"
            images={[ProjectImageBlog1]}
            thumbnails={[ProjectThumbnailBlog1]}>
            <p>
              My personal blog and portfolio website on which I discuss new
              technologies, libraries and awesome hacks that make the world go
              round.
            </p>

            <ul class="list-disc pl-8">
              <li>
                Full stack, built with{" "}
                <a href="https://start.solidjs.com" rel="nofollow">
                  Solid Start
                </a>{" "}
                + custom plugins/components
              </li>
              <li>
                Small bundle size using the{" "}
                <a href="https://www.solidjs.com" rel="nofollow">
                  Solid.js
                </a>{" "}
                framework
              </li>
              <li>
                CSS in JS with no runtime JS code, using{" "}
                <a href="https://linaria.dev" rel="nofollow">
                  Linaria
                </a>
              </li>
              <li>
                Statically built, deployed on{" "}
                <a href="https://pages.github.com">Github pages</a>
              </li>
            </ul>
          </Project>
        </div>
      </LabeledBox>
    </div>
  );
};

const Project: Component<any> = (props: any) => {
  const { children, name, descripton, website, images, thumbnails } =
    $destructure(props);
  const websiteName = $memo(website.split("://")[1]);
  return (
    <div>
      <div class="mb-8 flex xs:flex-col xs:gap-1 s:flex-row s:gap-4">
        <span class="text-nowrap text-heading3 text-colors-text-900a">{name}</span>
        <span class="text-nowrap text-heading3 text-colors-text-300a">
          {descripton}
        </span>
      </div>
      <div class="flex gap-4">
        <For each={images}>
          {(image, idx) => (
            <DialogImage
              alt={`Project screenshot of project "${name}"`}
              class={cn(
                ImageStyle,
                "h-32 w-[30%] max-w-60 rounded border-2 border-colors-primary-800 xs:w-[50%]"
              )}
              image={image}
              thumbnail={thumbnails[idx()]}
            />
          )}
        </For>
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

const ImageStyle = css`
  ${breakpoint("xs")} {
    &:not(:nth-child(-n + 2)) {
      display: none;
    }
  }
`;

export default ProjectsSection;
