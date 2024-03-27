import { For } from "solid-js/web";
import { Title } from "@solidjs/meta";
import Counter from "~/components/Counter";
import Text from "~/atoms/Text.md";
import fs from "fs";
import path from "path";
import { NoHydration } from "solid-js/web";
import { config } from "~/config";

const base = "./src/routes/articles";
const list = () => {
  "use server";
  return fs.readdirSync(base).map((x) => {
    const raw = fs.readFileSync(path.join(base, x)).toString();
    const title = raw.split("\n")[0].slice(2);
    const url = `${config.base}/articles/${x.split(".")[0]}`;
    return { title, url };
  });
};

export default function Home() {
  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello world!</h1>
      <Text />
      <NoHydration>
        <ul class="mb-8 text-colors-secondary-800">
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
