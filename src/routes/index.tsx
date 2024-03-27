import { For } from "solid-js/web";
import { Title } from "@solidjs/meta";
import Counter from "~/components/Counter";
import Text from "~/atoms/Text.md";
import fs from "fs";
import path from "path";
import { NoHydration } from "solid-js/web";

const base = "./src/routes/articles";
const list = () => {
  "use server";
  return fs.readdirSync(base).map((x) => {
    const raw = fs.readFileSync(path.join(base, x)).toString();
    const title = raw.split("\n")[0].slice(2);
    const url = `/articles/${x.split(".")[0]}`;
    return { title, url };
  });
};
// .map((x) => x.toString())
// .map((x) => [x.split("\n")[0].slice(2), `/articles/${x}`]);

export default function Home() {
  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello world!</h1>
      <Text />
      <NoHydration>
        <ul>
          <For each={list()}>
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
}
