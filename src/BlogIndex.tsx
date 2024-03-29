import { Separator } from "@kobalte/core";
import { css } from "@linaria/core";
import { Title } from "@solidjs/meta";
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
      <Title>Blog of a programming rabbit</Title>
      <ul class="mb-8 mt-8 flex flex-col gap-4">
        <For each={list}>
          {(item) => (
            <>
              <li class="flex flex-col hover:bg-colors-primary-100 p-4">
                <a
                  href={`${config.base}${item.url}`}
                  class="flex flex-col no-underline"
                >
                  <span class="text-h2 text-colors-primary-800">
                    {item.title}
                  </span>
                  <span class="textbody text-colors-text-300a !no-underline">
                    {item.date} by shiro
                  </span>
                  <span>{item.description}</span>
                </a>
              </li>
              <Separator.Root class="border-colors-text-300a" />
            </>
          )}
        </For>
      </ul>
    </main>
  );
};

const _BlogIndex = css``;

export default BlogIndex;
