import type { ShikiTransformer } from "@shikijs/core";
import type { Element } from "hast";

export interface shikiDiffNotationOptions {
  // class for added lines
  classLineAdd?: string;
  // class for removed lines
  classLineRemove?: string;
  // class added to the <pre> element when the current code has diff
  classActivePre?: string;
}

export function shikiDiffNotation(
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
