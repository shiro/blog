import type { ShikiTransformer } from "@shikijs/core";
import upstreamRehypeShiki, { type RehypeShikiOptions } from "@shikijs/rehype";
import type { Element, Root } from "hast";
import { unified, type Transformer } from "unified";
import { visit } from "unist-util-visit";

export default function rehypeShiki(
  options: RehypeShikiOptions
): Transformer<Root> {
  const processor = unified()
    .use(rehypeDiffNotation)
    .use(upstreamRehypeShiki, {
      ...options,
      transformers: [...(options.transformers ?? []), shikiDiffNotation()]
    });

  return async function (tree, file) {
    await processor.run(tree, file);
  };
}

function rehypeDiffNotation() {
  return function (tree: Root) {
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
  };
}

export interface shikiDiffNotationOptions {
  // class for added lines
  classLineAdd?: string;
  // class for removed lines
  classLineRemove?: string;
  // class added to the <pre> element when the current code has diff
  classActivePre?: string;
}

function shikiDiffNotation(
  options: shikiDiffNotationOptions = {}
): ShikiTransformer {
  const {
    classLineAdd = "add",
    classLineRemove = "remove",
    classActivePre = "diff",
  } = options;

  return {
    name: "shiki-diff-notation",
    code(node) {
      if (!/^diff(?:\s|$)/.test(this.options.meta?.__raw || "")) return;

      this.addClassToHast(this.pre, classActivePre);

      const lines = node.children.filter(
        (node) => node.type === "element"
      ) as Element[];

      lines.forEach((line) => {
        for (const child of line.children) {
          if (child.type !== "element") continue;
          const text = child.children[0];
          if (text.type !== "text") continue;

          const marker = text.value[0];

          if (/^[+ -]/.test(text.value)) {
            text.value = text.value.slice(1);
          }

          if (marker === "+" || marker === "-") {
            this.addClassToHast(
              line,
              marker === "+" ? classLineAdd : classLineRemove
            );
          }
          break;
        }
      });
    },
  };
}
