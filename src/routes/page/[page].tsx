import { getRequestEvent } from "solid-js/web";

export default function Home() {
  const q = getRequestEvent()?.request.url;
  return (
    <main>
      <h1>Page</h1>
      <div>q: {q}</div>
    </main>
  );
}
