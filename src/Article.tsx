import { Tooltip } from "@kobalte/core";
import cn from "classnames";
import { Component, lazy } from "solid-js";
import Spoiler from "~/Spoiler";
import Icon from "~/components/Icon";
import IconText from "~/components/IconText";

const articlesImportMap = import.meta.glob("./articles/*/*.mdx");
const getArticleComponent = (name: string) =>
  articlesImportMap[`./articles/${name}/article.mdx`];

export const isValidArticle = (name: string) => !!getArticleComponent(name);

interface Props {
  name: string;
}

const Article: Component<Props> = (props) => {
  const { name } = $destructure(props);
  const RawArticle = lazy(getArticleComponent(name) as any);

  return (
    <RawArticle
      components={{
        ["data-lsp"]: (props: any) => {
          return (
            <Tooltip.Root>
              <Tooltip.Trigger class="tooltip__trigger">
                {props.children}
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content class="bg-colors-primary-100 p-2 shadow-lg">
                  <Tooltip.Arrow />
                  <p>{props.lsp}</p>
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          );
        },
        pre: (props: any) => <pre {...props} title={null} />,
        Img: (props: any) => {
          // return <img {...props} class="ml-auto mr-auto" />;
          return (
            <figure class="mb-2 mt-2 flex justify-center">
              <div>
                <img {...props} class="ml-auto mr-auto" />
                <Show when={props.caption}>
                  <figcaption class="mt-1">{props.caption}</figcaption>
                </Show>
              </div>
            </figure>
          );
        },

        ul: (props: any) => (
          <ul {...props} class={cn(props.className, "list-disc pl-8")} />
        ),
        li: (props: any) => <li {...props} />,
        Spoiler: (props: any) => <Spoiler>{props.children}</Spoiler>,
        Embed: (props: any) => {
          if (props.url?.includes("://github.com")) {
            const [s, username, projectName] = props.url.match(
              new RegExp("github.com/(.+)/(.*)")
            );
            return (
              <a
                class="mb-8 ml-auto mr-auto mt-8 flex h-40 w-[440px] rounded bg-colors-primary-300 text-colors-text-600a no-underline"
                target="_blank"
                href={props.url}>
                <Icon
                  icon="github"
                  class="ml-8 mr-8 h-full w-16 flex-shrink-0"
                />
                <div class="flex flex-1 flex-col gap-2 bg-colors-primary-200 pl-4 pr-4 shadow">
                  <span class="mt-6 text-h2">
                    <span class="text-colors-text-300a">{username}/</span>
                    <span class="text-colors-text-900a">{projectName}</span>
                  </span>
                  <span>{props.description}</span>
                </div>
              </a>
            );
          }
          return null;
        },
        div: (props: any) => {
          if (props.className?.includes("code-title")) {
            const { className, ...rest } = $destructure(props);
            return (
              <div class={cn(className, "flex gap-2")} {...rest}>
                <IconText icon="code" />
                {props.children}
              </div>
            );
          }
          return <div {...props} />;
        },
        ["data-err"]: (props: any) => {
          return null;
        },
      }}
    />
  );
};

export default Article;
