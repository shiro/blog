import { Title } from "@solidjs/meta";
import { For, NoHydration } from "solid-js/web";
import Text from "~/atoms/Text.md";
import Counter from "~/components/Counter";
import { getArticles } from "~/ssg/getArticles";

const list = getArticles();

const List = () => {
  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello world!</h1>
      <Text />
      <NoHydration>
        <ul class="mb-8 text-colors-secondary-800">
          <For each={list}>
            {(item) => (
              <li>
                <a href={item.url}>{item.title}</a>
              </li>
            )}
          </For>
        </ul>
      </NoHydration>
      <Counter />
      <p>
        Visit{" "}
        <a href="https://start.solidjs.com" target="_blank">
          start.solidjs.com
        </a>{" "}
        to learn how to build SolidStart apps.
      </p>
    </main>
  );
};

export default List;
