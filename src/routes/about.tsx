import { Title } from "@solidjs/meta";
import { css } from "@linaria/core";

export default function Home() {
  return (
    <main>
      <Title>About</Title>
      <h1 class={f}>About</h1>
    </main>
  );
}

const f = css`
    background: red;
`;
