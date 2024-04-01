import { JSX, Component } from "solid-js";
import { css } from "@linaria/core";
import cn from "classnames";
import IconText from "~/components/IconText";

interface Props {
  children?: JSX.Element;
}

const AboutSite: Component<Props> = (props) => {
  return (
    <div class={cn(_AboutSite)}>
      hi
      <IconText icon="github" />
    </div>
  );
};

const _AboutSite = css``;

export default AboutSite;
