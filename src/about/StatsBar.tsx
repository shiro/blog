import cn from "classnames";
import { Component } from "solid-js";
import IconText from "~/components/IconText";

interface Props {
  class?: string;
  children: string;
  type?: "primary" | "secondary";
  icon: string;
  label: string;
  progress: number;
}

const StatsBar: Component<Props> = (props) => {
  const {
    class: $class,
    children,
    icon,
    progress,
    label,
    type = "primary",
  } = $destructure(props);

  return (
    <div
      class={cn(
        "relative flex w-[192px] select-none rounded-md border-2",
        {
          "border-colors-primary-300": type == "primary",
          "border-colors-secondary-300": type == "secondary",
        },
        $class
      )}>
      <span class="absolute left-2 flex gap-1">
        <IconText icon={icon} />
        {label}
      </span>
      <span class="absolute right-2 top-0">{children}</span>
      <div
        class={cn("h-[28px]", {
          "bg-colors-primary-500": type == "primary",
          "bg-colors-secondary-500": type == "secondary",
        })}
        style={{ width: `${progress}%` }}
      />
      <div
        class={cn(
          "h-0 w-0 border-r-[18px] border-t-[28px] border-transparent bg-transparent",
          {
            "border-t-colors-primary-500": type == "primary",
            "border-t-colors-secondary-500": type == "secondary",
          }
        )}
      />
    </div>
  );
};

export default StatsBar;
