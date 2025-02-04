import { Separator } from "@kobalte/core";
import { Component } from "solid-js";
import { For } from "solid-js/web";
import { config } from "~/config";
import { getArticles } from "~/ssg/getArticles";

const articles = getArticles();

const BlogIndex: Component = () => {
  return (
    <main>
      <h1 class="mb-4 bg-colors-primary-500 pl-8 pr-8 text-center text-big text-colors-text-900a">
        Blog of a programming rabbit
      </h1>
      <ul class="flex flex-col gap-4">
        <For each={articles}>
          {(item, idx) => (
            <>
              <li class="flex flex-col hover:bg-colors-primary-100">
                <a
                  href={`${config.base}${item.url}`}
                  class="flex flex-col p-4 no-underline">
                  <span class="text-heading2 text-colors-primary-800">
                    {item.title}
                  </span>
                  <span class="textbody mb-4 mt-1 text-colors-text-300a !no-underline">
                    {item.date} by Matic Utsumi Gačar
                  </span>
                  <span
                    class="text-colors-text-600a"
                    innerHTML={item.description?.replaceAll("\n\n", "<br/>")}
                  />
                </a>
              </li>
              <Show when={idx() != articles.length - 1}>
                <Separator.Root class="border-colors-text-100a" />
              </Show>
            </>
          )}
        </For>
      </ul>
    </main>
  );
};

export default BlogIndex;
