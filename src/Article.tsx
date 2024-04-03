import { Tooltip } from "@kobalte/core";
import cn from "classnames";
import { Component, lazy } from "solid-js";
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
