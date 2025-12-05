import { Collapsible, Separator } from "@kobalte/core";
import { css } from "@style-this/core";
import cn from "classnames";
import { Component, JSX } from "solid-js";
import { color } from "~/style/commonStyle";

interface Props {
  children?: JSX.Element;
  style?: JSX.CSSProperties;
  class?: string;
}

const Spoiler: Component<Props> = (props) => {
  const { children, class: $class, ...rest } = $destructure(props);

  return (
    <Collapsible.Root class={cn($class, "mt-8 mb-8")} {...rest}>
      <div class="flex items-center">
        <Collapsible.Trigger
          class={cn(
            "bg-colors-primary-200 inline-flex items-center justify-between pr-4 pl-4 text-center outline-none",
            ToggleButton
          )}>
          <span class="open-text">View collapsed content</span>
          <span class="close-text">Hide collapsed content</span>
        </Collapsible.Trigger>
        <Separator.Root class="border-colors-text-100a ml-2 flex-1 border-2" />
      </div>
      <Collapsible.Content class={cn("collapsible__content", Content)}>
        {children}
      </Collapsible.Content>
      <Separator.Root class="border-colors-text-100a mt-4 flex-1 border-2" />
    </Collapsible.Root>
  );
};

const ToggleButton = css`
  .open-text {
    display: block;
  }
  .close-text {
    display: none;
  }

  &[data-expanded] {
    background-color: ${color("colors/primary-300")} !important;
    .open-text {
      display: none;
    }
    .close-text {
      display: block;
    }
  }
`;

const Content = css`
  overflow: hidden;
  animation: slideUp 300ms ease-out;
  &[data-expanded] {
    animation: slideDown 300ms ease-out;
  }
`;

const _GlobalStyle = css`
  @keyframes slideDown {
    from {
      height: 0;
    }
    to {
      height: var(--kb-collapsible-content-height);
    }
  }
  @keyframes slideUp {
    from {
      height: var(--kb-collapsible-content-height);
    }
    to {
      height: 0;
    }
  }
`;

export default Spoiler;
