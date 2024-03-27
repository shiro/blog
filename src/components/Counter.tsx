import { css } from "@linaria/core";
import "./Counter.css";

export default function Counter() {
  let count = $signal(0);
  return (
    <button class={increment} onClick={() => {count++ }}>
      Clicks: {count}
    </button>
  );
}

const increment = css`
  font-family: inherit;
  font-size: inherit;
  padding: 1em 2em;
  color: #335d92;
  background-color: rgba(68, 107, 158, 0.1);
  border-radius: 2em;
  border: 2px solid blue;
  outline: none;
  width: 200px;
  font-variant-numeric: tabular-nums;
`;
