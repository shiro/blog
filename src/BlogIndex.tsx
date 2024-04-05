import { Separator } from "@kobalte/core";
import { css } from "@linaria/core";
import cn from "classnames";
import { Component, JSX } from "solid-js";
import { For } from "solid-js/web";
import { config } from "~/config";
import { getArticles } from "~/ssg/getArticles";

const list = getArticles();

interface Props {
  children?: JSX.Element;
}

const BlogIndex: Component<Props> = (props) => {
  return (
    <main class={cn(_BlogIndex)}>
      <ul class="flex flex-col gap-4">
        <For each={list}>
          {(item, idx) => (
            <>
              <li class="flex flex-col p-4 hover:bg-colors-primary-100">
                <a
                  href={`${config.base}${item.url}`}
                  class="flex flex-col no-underline">
                  <span class="text-h2 text-colors-primary-800">
                    {item.title}
                  </span>
                  <span class="textbody mb-4 mt-1 text-colors-text-300a !no-underline">
                    {item.date} by Matic Utsumi Gačar
                  </span>
                  <span
                    class="text-colors-text-600a"
                    innerHTML={item.description.replaceAll("\n", "<br/>")}
                  />
                </a>
              </li>
              <Show when={idx() != list.length - 1}>
                <Separator.Root class="border-colors-text-300a" />
              </Show>
            </>
          )}
        </For>
      </ul>
    </main>
  );
};

const _BlogIndex = css``;

export default BlogIndex;
