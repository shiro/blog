import { JSX, Component } from "solid-js";
import { css } from "@linaria/core";
import cn from "classnames";
import IconText from "~/components/IconText";
import { Link } from "@kobalte/core";

interface Props {
  children: string;
  icon: string;
}

const StatusButton: Component<Props> = (props) => {
  const { children, icon } = $destructure(props);

  return (
    <Link.Root
      href="mailto:matic@usagi.io"
      class={cn(
        _StatusButton,
        "relative flex w-[192px] gap-2 rounded-md border-2 border-colors-primary-300 pl-2 pr-2 no-underline hover:cursor-pointer hover:bg-colors-primary-300"
      )}>
      <IconText icon={icon} />
      {children}
    </Link.Root>
  );
};

const _StatusButton = css``;

export default StatusButton;
