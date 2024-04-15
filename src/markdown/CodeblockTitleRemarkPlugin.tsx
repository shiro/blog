import { visit } from "unist-util-visit";

export const CodeblockTitleRemarkPlugin = () => {
  return (tree: any, file: any) => {
    visit(tree, "element", (node, idx, parent) => {
      if (node.tagName != "code" || !node.meta?.title) return;
      console.log(node);
      parent.children[idx!] = {
        type: "element",
        tagName: "div",
        children: [
          {
            type: "element",
            tagName: "div",
            properties: { class: "code-title" },
            children: [
              {
                type: "text",
                value: node.meta.title,
              },
            ],
          },
          node,
        ],
      };
    });
  };
};
