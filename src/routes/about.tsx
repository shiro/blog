import { Title } from "@solidjs/meta";
import { css } from "@linaria/core";
import { getRequestEvent } from "solid-js/web";

export default function Home() {
  const q = getRequestEvent()?.request.url;
  return (
    <main>
      <Title>About</Title>
      <h1 class={f}>About</h1>
      <div>q: {q}</div>
    </main>
  );
}

const f = css`
    background: red;
`;
