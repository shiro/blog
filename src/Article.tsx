import { Separator, Tooltip } from "@kobalte/core";
import { css } from "@linaria/core";
import { Meta } from "@solidjs/meta";
import cn from "classnames";
import { Component, children, lazy } from "solid-js";
import DialogImage from "~/DialogImage";
import LazyImage from "~/LazyImage";
import Spoiler from "~/Spoiler";
import Icon from "~/components/Icon";
import IconText from "~/components/IconText";
import { getArticles } from "~/ssg/getArticles";
import { remBase } from "~/style/fluidSizeTS";

const articlesImportMap = import.meta.glob("./articles/*/*.mdx");
const articles = getArticles();

const getArticleComponent = (name: string) =>
  articlesImportMap[`./articles/${name}/article.mdx`];
export const isValidArticle = (name: string) => !!getArticleComponent(name);

interface Props {
  name: string;
}

const Article: Component<Props> = (props) => {
  const { name } = $destructure(props);
  const RawArticle = lazy(getArticleComponent(name) as any);
  const meta = articles.find((x: any) => x.slug == name)!;

  return (
    <div class={_Article}>
      <Meta name="description" content={meta.description} />
      <span class="mb-2">
        <a href="/">Articles</a>{" "}
        <span class="text-colors-textb;e-300a">{">"}</span> {meta.title}
      </span>
      <h1 class="text-colors-text-900a">{meta.title}</h1>
      <div class="mb-4 mt-1 text-colors-text-300a">
        {meta.date} by <a href="/about">Matic Utsumi Gačar</a>
      </div>
      <Separator.Root class="mb-4 mt-4 border-colors-text-100a" />
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
            return (
              <figure class="mb-8 mt-8 flex justify-center">
                <div>
                  {/* <img {...props} class="ml-auto mr-auto" /> */}
                  <DialogImage
                    thumbnail={props.src}
                    image={props.src}
                    alt="image"
                  />
                  <Show when={props.caption}>
                    <figcaption class="mt-1 text-colors-text-300a">
                      {props.caption}
                    </figcaption>
                  </Show>
                </div>
              </figure>
            );
          },
          code: (props: any) => {
            const { children: _c, title, ...rest } = $destructure(props);
            const c = children(() => _c);
            return (
              <>
                <Show when={title}>
                  <div class="relative left-[-8px] top-[-8px] flex w-[calc(100%+16px)] gap-2 bg-colors-primary-200 pb-1 pl-4 pr-4 pt-1">
                    <IconText icon="code" />
                    {title}
                  </div>
                </Show>
                <code
                  {...rest}
                  class={
                    typeof c() == "string"
                      ? "rounded bg-colors-primary-300 pl-2 pr-2"
                      : ""
                  }>
                  {c()}
                </code>
              </>
            );
          },
          h1: (props: any) => (
            <h2 {...props} class="text-h2 text-colors-text-900a" />
          ),
          h2: (props: any) => (
            <h3 {...props} class="text-h3 text-colors-text-900a" />
          ),
          h3: (props: any) => (
            <h4 {...props} class="text-h4 text-colors-text-900a" />
          ),

          ul: (props: any) => (
            <ul {...props} class={cn(props.className, "list-disc pl-8")} />
          ),
          li: (props: any) => <li {...props} />,
          em: (props: any) => <em {...props} class="pr-1" />,
          figure: (props: any) => {
            const { children, ...rest } = $destructure(props);
            //   const c = children(() => _c);
            //
            //   const isTable =
            //     (c() as any[])?.find((x: any) => typeof x != "string")?.tagName ==
            //     "TABLE";
            //
            //   console.log("fig", isTable, c());
            //   if (isTable) {
            //     return <figure {...rest}>{c()}</figure>;
            //   }
            return (
              <figure {...rest} class="flex justify-center">
                <div class="">{children}</div>
              </figure>
            );
          },
          table: (props: any) => (
            <table
              {...props}
              class="mb-8 ml-auto mr-auto mt-8 border-2 border-colors-text-300a"
            />
          ),
          th: (props: any) => {
            return (
              <th
                {...props}
                style={{ ...props.style, "text-align": props.style.textAlign }}
                class="pb-1 pl-2 pr-2 pt-1 text-colors-text-900a"
              />
            );
          },
          figcaption: (props: any) => (
            <figcaption
              {...props}
              class="relative top-[-24px] text-colors-text-300a"
            />
          ),
          td: (props: any) => <td {...props} class="pb-1 pl-2 pr-2 pt-1" />,
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
          ["data-err"]: (props: any) => {
            return null;
          },
        }}
      />
    </div>
  );
};

const _Article = css`
  ${LazyImage.styles.container} {
    // width: calc((var(--width) / 16) * ${remBase}rem);
    // height: calc((var(--height) / 16) * ${remBase}rem);
  }
  // figure {
  //   display: flex;
  //   justify-content: center;
  // }
`;

export default Article;
