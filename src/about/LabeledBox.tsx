import { Component, JSX } from "solid-js";
import cn from "classnames";

interface Props {
  children?: JSX.Element;
  style?: JSX.CSSProperties;
  label: string;
  class?: string;
}

const LabeledBox: Component<Props> = (props) => {
  const { style, children, label, class: $class } = $destructure(props);
  return (
    <div class={cn("relative mt-[14px] flex", $class)} style={style}>
      <span class="absolute left-2 top-[-14px] bg-colors-special-bg pl-2 pr-2 text-colors-text-300a">
        {label}
      </span>
      <div class="min-w-full overflow-hidden rounded-md border-2 border-colors-text-100a p-8">
        {children}
      </div>
    </div>
  );
};

export default LabeledBox;
