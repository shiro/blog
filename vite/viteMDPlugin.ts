import { nodeTypes } from "@mdx-js/mdx";
import rehypeRaw from "rehype-raw";
import remarkFrontmatter from "remark-frontmatter";
// @ts-ignore
import rehypeShiki from "@shikijs/rehype";
// @ts-ignore
import _mdx from "@vinxi/plugin-mdx";
// @ts-ignore
import remarkCaptions from "remark-captions";
import remarkGfm from "remark-gfm";
import { parseDelimitedString } from "../src/util/parseDelimitedString";
import { shikiDiffNotation } from "../ext/shikiDiffNotation/shikiDiffNotation";

const { default: mdx } = _mdx;

export const viteMDPlugin = () =>
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
          ],
        },
      ],
      [rehypeRaw, { passThrough: nodeTypes }],
    ],
  });
