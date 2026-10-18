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
      // select the highlighting language and keep the diff flag
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
