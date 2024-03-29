import { JSX, Component } from "solid-js";
import { css } from "@linaria/core";
import cn from "classnames";
import { Title } from "@solidjs/meta";
import { For, NoHydration } from "solid-js/web";
import Text from "~/atoms/Text.md";
import Counter from "~/components/Counter";
import { getArticles } from "~/ssg/getArticles";

const list = getArticles();

interface Props {
  children?: JSX.Element;
}

const BlogIndex: Component<Props> = (props) => {
  return (
    <main class={cn(_BlogIndex)}>
      <Title>Hello World</Title>
      <ul class="mb-8 text-colors-secondary-800">
        <For each={list}>
          {(item) => (
            <li>
              <a href={item.url}>{item.title}</a>
            </li>
          )}
        </For>
      </ul>
    </main>
  );
};

const _BlogIndex = css``;

export default BlogIndex;
