import rehypeShiki, { type RehypeShikiOptions } from "@shikijs/rehype";
import type { Root } from "hast";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { shikiDiffNotation } from "./shikiDiffNotation";

export default function rehypeShikiDiff(options: RehypeShikiOptions) {
  const highlight = unified().use(rehypeShiki, {
    ...options,
    transformers: [...(options.transformers ?? []), shikiDiffNotation()]
  });

  return async function (tree: Root) {
    visit(tree, "element", (node) => {
      if (node.tagName !== "pre") return;
      const code = node.children[0];
      if (
        code?.type !== "element" ||
        !Array.isArray(code.properties.className) ||
        !code.properties.className.includes("language-diff") ||
        typeof code.data?.meta !== "string"
      )
        return;

      const metadata =
        code.data.meta.match(/(?:[^\s"']|"[^"]*"|'[^']*')+/g) ?? [];
      const language = metadata.find((token) => /^lang="[^"]+"$/.test(token));
      if (!language) return;
      // Select the highlighting language before Shiki loads grammars, consuming
      // lang="..." and retaining a diff flag for the transformer
      // MDX uses remark-rehype and mdast-util-to-hast to convert the fence
      // language to a class on the code element before running rehype plugins
      //
      // Equivalent fence before normalization:
      // ```diff lang="html" title="example.html"
      // ```
      //
      // Equivalent fence after normalization:
      // ```html diff title="example.html"
      // ```
      code.properties.className = code.properties.className.map((name) =>
        name === "language-diff" ? `language-${language.slice(6, -1)}` : name
      );
      code.data.meta = [
        "diff",
        ...metadata.filter((token) => token !== language)
      ].join(" ");
    });
    await highlight.run(tree);
  };
}
