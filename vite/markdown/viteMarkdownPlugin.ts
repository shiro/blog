import { nodeTypes } from "@mdx-js/mdx";
import fs from "fs";
import rehypeRaw from "rehype-raw";
import remarkFrontmatter from "remark-frontmatter";
// @ts-ignore
import rehypeShiki from "@shikijs/rehype";
// @ts-ignore
import _mdx from "@vinxi/plugin-mdx";
// @ts-ignore
import remarkCaptions from "remark-captions";
import remarkGfm from "remark-gfm";
import { bundledLanguages } from "shiki";
import { parseDelimitedString } from "../../src/util/parseDelimitedString";
import { shikiColorNotation } from "./shikiColorNotation/shikiColorNotation";
import { shikiDiffNotation } from "./shikiDiffNotation/shikiDiffNotation";

const { default: mdx } = _mdx;

export const viteMarkdownPlugin = () =>
  mdx.withImports({})({
    jsx: true,
    jsxImportSource: "solid-js",
    providerImportSource: "solid-mdx",
    remarkPlugins: [
      remarkFrontmatter,
      remarkGfm,
      [remarkCaptions, { external: { table: "Table:" } }],
    ],
    rehypePlugins: [
      [
        rehypeShiki,
        {
          theme: "github-dark",
          langs: [
            ...Object.keys(bundledLanguages),
            // theme colors: https://github.com/shikijs/textmate-grammars-themes/blob/45c05724db7ce7015e81d68b5b3f56dfcc0e8a2b/packages/tm-themes/themes/github-dark.json
            JSON.parse(
              fs
                .readFileSync(
                  "vite/markdown/shikiGrammars/terminal.json",
                  "utf-8"
                )
                .toString()
            ),
          ],
          transformers: [
            // codeblock meta parser
            (() => {
              let meta: any;
              return {
                preprocess(raw: any, options: any) {
                  meta = {};
                  const rawMeta: string = options.meta.__raw;
                  if (!rawMeta) return;
                  meta = Object.fromEntries(
                    Object.entries(parseDelimitedString(rawMeta, " ")).map(
                      ([k, v]) => [k, JSON.parse(v)]
                    )
                  );
                },
                code(node: any) {
                  node.properties = { ...node.properties, ...meta };
                  node.meta = meta;
                },
              };
            })(),
            shikiDiffNotation(),
            shikiColorNotation(),
          ],
        },
      ],
      [rehypeRaw, { passThrough: nodeTypes }],
    ],
  });
