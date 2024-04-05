import { Separator } from "@kobalte/core";
import { css } from "@linaria/core";
import cn from "classnames";
import { Component, JSX } from "solid-js";
import LabeledBox from "~/about/LabeledBox";
import IconText from "~/components/IconText";
import { breakpoint } from "~/style/commonStyle";
import ProjectImageBlog1 from "@assets/about/project-blog-1.jpg?lazy";
import ProjectThumbnailBlog1 from "@assets/about/project-blog-1.jpg?lazy&size=300x";
import ProjectImageMap21 from "@assets/about/project-map2-1.jpg?lazy";
import ProjectThumbnailMap21 from "@assets/about/project-map2-1.jpg?lazy&size=300x";
import ProjectImageMap22 from "@assets/about/project-map2-2.jpg?lazy";
import ProjectThumbnailMap22 from "@assets/about/project-map2-2.jpg?lazy&size=300x";
import ProjectImageFujipodWeb1 from "@assets/about/project-fujipod-web-1.jpg?lazy";
import ProjectThumbnailFujipodWeb1 from "@assets/about/project-fujipod-web-1.jpg?lazy&size=300x";
import ProjectImageFujipodWeb2 from "@assets/about/project-fujipod-web-2.jpg?lazy";
import ProjectThumbnailFujipodWeb2 from "@assets/about/project-fujipod-web-2.jpg?lazy&size=300x";
import ProjectImageFujipodWeb3 from "@assets/about/project-fujipod-web-3.jpg?lazy";
import ProjectThumbnailFujipodWeb3 from "@assets/about/project-fujipod-web-3.jpg?lazy&size=300x";
import DialogImage from "~/DialogImage";

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
            A free Japanese language study platform and dictionary with an
            active, growing community of over 100 users.
          </Project>

          <Separator.Root class="border-t-2 border-colors-primary-200" />

          <Project
            name="map2"
            descripton="Linux key remapping tool"
            website="https://github.com/shiro/map2"
            images={[ProjectImageMap21, ProjectImageMap22]}
            thumbnails={[ProjectThumbnailMap21, ProjectThumbnailMap22]}>
            A tool for remapping inputs from keyboards, mice, joysticks,
            steering wheels and much more, increasing productivity, reducing
            wrist injuries and much more.
          </Project>

          <Separator.Root class="border-t-2 border-colors-primary-200" />

          <Project
            name="Blog of a programming rabbit"
            descripton="Blog and portfolio website"
            website="https://usagi.io"
            images={[ProjectImageBlog1]}
            thumbnails={[ProjectThumbnailBlog1]}>
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
  const { children, name, descripton, website, images, thumbnails } =
    $destructure(props);
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
        <For each={images}>
          {(image, idx) => (
            <DialogImage
              class={cn(
                ImageStyle,
                "h-32 w-[30%] max-w-60 rounded border-2 border-colors-primary-800 object-cover xs:w-[50%]"
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

const PreviewImage: Component<any> = (props: any) => {
  return (
    <props.Thumbnail
      class={cn(
        ImageStyle,
        "h-32 w-[30%] max-w-60 rounded border-2 border-colors-primary-800 object-cover xs:w-[50%]"
      )}
    />
  );
};

const _ProjectsSection = css``;

const ImageStyle = css`
  ${breakpoint("xs")} {
    &:not(:nth-child(-n + 2)) {
      display: none;
    }
  }
`;

export default ProjectsSection;
