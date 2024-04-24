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

type MetaNode = Element & { meta?: Record<string, any> };

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
    code(node: MetaNode) {
      if (!node.meta?.diff) return;
      this.addClassToHast(this.pre, classActivePre);

      const lines = node.children.filter(
        (node) => node.type === "element"
      ) as Element[];

      lines.forEach((line) => {
        for (const child of line.children) {
          if (child.type !== "element") continue;
          const text = child.children[0];
          if (text.type !== "text") continue;

          if (text.value.startsWith("+")) {
            text.value = text.value.slice(1);
            this.addClassToHast(line, classLineAdd);
          }
          if (text.value.startsWith("-")) {
            text.value = text.value.slice(1);
            this.addClassToHast(line, classLineRemove);
          }
        }
      });
    },
  };
}
