import type { ShikiTransformer } from "@shikijs/core";
import type { Element } from "hast";

export interface shikiColorNotationOptions {
  colors?: string[];
}

type MetaNode = Element & { meta?: Record<string, any> };

export function shikiColorNotation(
  options: shikiColorNotationOptions = {}
): ShikiTransformer {
  const { colors = ["red", "blue", "green", "orange", "gray"] } = options;

  return {
    name: "shiki-color-notation",
    code(node: MetaNode) {
      if (!node.meta?.colors) return;

      const lines = node.children.filter(
        (node) => node.type === "element"
      ) as Element[];

      lines.forEach((line) => {
        for (let i = 0; i < line.children.length; i++) {
          const child = line.children[i];

          if (child.type !== "element") continue;
          const text = child.children[0];
          if (text.type !== "text") continue;

          const m = /(.*)%(.+)%(.*)%\2%(.*)/.exec(text.value);

          if (!m) continue;

          const [raw, before, color, inner, after] = m;

          if (colors.includes(color)) {
            text.value = inner;

            if (inner) {
              child.properties.class = `color-${color}`;
            }

            if (after) {
              line.children.splice(i + 1, 0, {
                type: "element",
                tagName: "span",
                properties: {},
                children: [{ type: "text", value: after }],
              });
            }

            if (before) {
              line.children.splice(i, 0, {
                type: "element",
                tagName: "span",
                properties: {},
                children: [{ type: "text", value: before }],
              });
              i--;
            }
          }
        }
      });
    },
  };
}
