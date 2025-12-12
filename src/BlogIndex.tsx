import { Separator } from "@kobalte/core";
import { Component } from "solid-js";
import { For } from "solid-js/web";
import { config } from "~/config";
import { getArticles } from "~/ssg/getArticles";
// import DefaultBanner from "~/articles/9999-01-01-test/banner.jpg?lazy";
// import { LazyImageComponent } from "~/LazyImage";

// const banners = Object.fromEntries(
//   Object.entries(
//     import.meta.glob("~/articles/*/banner.*", {
//       query: "?lazy",
//       import: "default",
//       eager: true,
//     })
//   ).map(([k, v]) => [
//     k.substring("/src/articles/".length, k.lastIndexOf("/")),
//     v,
//   ])
// );

const articles = getArticles();

const BlogIndex: Component = () => {
  return (
    <main>
      <h1 class="bg-colors-primary-500 text-big text-colors-text-900a mb-4 pr-8 pl-8 text-center">
        Blog of a programming rabbit
      </h1>
      <ul class="flex flex-col gap-4">
        <For each={articles}>
          {(item, idx) => {
            // const Banner = (banners[item.slug] ??
            // DefaultBanner) as LazyImageComponent;
            return (
              <>
                <li class="hover:bg-colors-primary-100 flex flex-col">
                  <a
                    href={`${config.base}${item.url}`}
                    class="@container flex flex-col p-4 no-underline">
                    <span class="text-heading2 text-colors-primary-800">
                      {item.title}
                    </span>
                    <span class="textbody text-colors-text-300a mt-1 !no-underline">
                      {item.date} by Matic Utsumi Gačar
                    </span>
                    {/* <Banner class="mt-4 mb-4 h-60 object-cover!" /> */}
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
            );
          }}
        </For>
      </ul>
    </main>
  );
};

export default BlogIndex;
