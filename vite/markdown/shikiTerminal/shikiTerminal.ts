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

const inputRegex = new RegExp(`^\\[(.*)@(.*)\\]([$#])(.*)`);

export function shikiTerminal(
  options: shikiDiffNotationOptions = {}
): ShikiTransformer {
  const {
    classLineAdd = "add",
    classLineRemove = "remove",
    classActivePre = "diff",
  } = options;
  let lang = "";

  return {
    name: "shiki-terminal",
    preprocess(raw: any, options: any) {
      // options.colorReplacements = undefined;
      lang = options.lang;
      if (lang != "ansi") return;
      options.colorReplacements = {
        ...(options.colorReplacements ?? {}),
        // "#24292e": "var(--color-colors-primary-50, #24292e)",
        "#e1e4e8": "inherit",
      };
    },
    code(node: MetaNode) {
      if (lang != "ansi") return;
      if (!node.meta?.terminal) return;
      this.addClassToHast(this.pre, "terminal");

      const lines = node.children.filter(
        (node) => node.type === "element"
      ) as Element[];

      lines.forEach((line) => {
        for (const child of line.children) {
          if (child.type !== "element") continue;

          if (child.children[0]?.type == "text") {
            const match = inputRegex.exec(child.children[0].value);
            if (match) {
              this.addClassToHast(line, "input");

              const [_, user, location, sign, rest] = match;

              const vals: [string, string | undefined][] = [
                ["[", undefined],
                [user, "var(--color-colors-primary-800)"],
                ["@", undefined],
                [location, "var(--color-colors-secondary-800)"],
                ["]", undefined],
                [sign, "var(--color-colors-primary-800)"],
                [rest, undefined],
              ];

              line.children = [
                ...vals.map(
                  ([a, b]) =>
                    ({
                      type: "element",
                      tagName: "span",
                      properties: { style: `color: ${b ?? "inherit"}` },
                      children: [{ type: "text", value: a }],
                    }) as Element
                ),
                ...line.children.slice(1),
              ];

              continue;
            }

            // remove escaped "\"
            if (
              child.children[0].value[0] == "\\" &&
              inputRegex.test(child.children[0].value.slice(1))
            ) {
              child.children[0].value = child.children[0].value.slice(1);
            }
          }
          this.addClassToHast(line, "output");

          //   if (text.value.startsWith("+")) {
          //     text.value = text.value.slice(1);
          //     this.addClassToHast(line, classLineAdd);
          //   }
          //   if (text.value.startsWith("-")) {
          //     text.value = text.value.slice(1);
          //     this.addClassToHast(line, classLineRemove);
          //   }
        }
      });
    },
  };
}
