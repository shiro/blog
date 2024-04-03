import { JSX, Component } from "solid-js";
import { css } from "@linaria/core";
import cn from "classnames";
import LabeledBox from "~/about/LabeledBox";
import { color } from "~/style/commonStyle";

type Pos = [number, number];
const TICK_SPEED = 90;

var MAX_16BIT_SIGNED = 32767;
const getKey = (x: number, y: number) => {
  x += MAX_16BIT_SIGNED;
  y += MAX_16BIT_SIGNED;
  return (x << 16) | y;
};

function convertPixelsToRem(px: number) {
  return (
    px /
    parseFloat(
      getComputedStyle(document.documentElement).fontSize.replace("px", "")
    )
  );
}

interface Props {
  style?: JSX.CSSProperties;
  class?: string;
}

var svgns = "http://www.w3.org/2000/svg";

const SnakeGame: Component<Props> = (props) => {
  const { style, class: $class } = $destructure(props);

  let canvas!: SVGSVGElement;

  $mount(() => {
    let map: Record<number, number> = {};

    const setNode = (x: number, y: number, type: number) => {
      var c = document.createElementNS(svgns, "rect");
      c.setAttribute(
        "class",
        type == 1 ? "fill-colors-primary-800" : "fill-colors-secondary-800"
      );
      c.setAttribute("x", `${x}rem`);
      c.setAttribute("y", `${y}rem`);
      c.setAttribute("width", "1rem");
      c.setAttribute("height", "1rem");
      canvas.appendChild(c);
      return c;
    };

    let h = 20;
    let w = 20;

    const randomPos = (): Pos => [
      Math.round(Math.random() * (w - 1)),
      Math.round(Math.random() * (h - 1)),
    ];

    const moveFruit = () => {
      fruitEl?.remove();
      let i = 0;
      while (map[getKey(...fruitPos)]) {
        // avoid crashing the browser
        if (++i == 30) {
          reset();
          return;
        }

        fruitPos = [
          Math.round(Math.random() * (w - 1)),
          Math.round(Math.random() * (h - 1)),
        ];
      }
      fruitEl = setNode(...fruitPos, 2);
      map[getKey(...fruitPos)] = 2;
    };

    let snake: { el: Element; pos: Pos }[] = [];
    let pos = randomPos();
    let fruitPos: Pos;
    let fruitEl: Element | null = null;

    const reset = () => {
      canvas.innerHTML = "";
      snake = [];
      map = {};
      pos = randomPos();
      snake.push({ el: setNode(...pos, 1), pos });
      map[getKey(...pos)] = 1;
      fruitPos = randomPos();
      moveFruit();
    };

    reset();
    let interval = setInterval(loop, TICK_SPEED);
    let resetTimeout: NodeJS.Timeout;
    const handleResize = (entries: ResizeObserverEntry[]) => {
      const { width, height } = entries[0].contentRect;
      const newW = Math.floor(convertPixelsToRem(width) - 1);
      const newH = Math.floor(convertPixelsToRem(height) - 1);
      if (newW < 1 || newH < 1) return;
      if (w == newW && h == newH) return;
      w = newW;
      h = newH;
      clearInterval(interval);
      clearTimeout(resetTimeout);
      canvas.innerHTML = "";
      resetTimeout = setTimeout(() => {
        reset();
        interval = setInterval(loop, TICK_SPEED);
      }, 1000);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    function loop() {
      const available = [
        ["down", 0, 1],
        ["up", 0, -1],
        ["right", 1, 0],
        ["left", -1, 0],
      ]
        .filter(([label, x, y]) => {
          const newPos: Pos = [pos[0] + (x as number), pos[1] + (y as number)];
          return (
            newPos[0] >= 0 &&
            newPos[0] < w &&
            newPos[1] >= 0 &&
            newPos[1] < h &&
            map[getKey(...newPos)] != 1
          );
        })
        .reduce(
          (acc, [direction, ...pos]) => ({ ...acc, [direction]: pos }),
          {}
        ) as Record<string, Pos>;

      if (pos[0] < fruitPos[0] && available["right"]) {
        ++pos[0];
      } else if (pos[0] > fruitPos[0] && available["left"]) {
        --pos[0];
      } else if (pos[1] < fruitPos[1] && available["down"]) {
        ++pos[1];
      } else if (pos[1] > fruitPos[1] && available["up"]) {
        --pos[1];
      } else if (Object.keys(available).length) {
        var keys = Object.keys(available);
        const direction = available[keys[(keys.length * Math.random()) << 0]];

        pos[0] += direction[0];
        pos[1] += direction[1];
      } else {
        reset();
        return;
      }

      snake.push({ el: setNode(...pos, 1), pos: [...pos] });
      map[getKey(...pos)] = 1;

      if (pos[0] == fruitPos[0] && pos[1] == fruitPos[1]) {
        moveFruit();
      } else {
        const tail = snake.splice(0, 1)[0];
        delete map[getKey(...tail.pos)];
        tail.el.remove();
      }
    }

    $cleanup(() => {
      clearInterval(interval);
      clearTimeout(resetTimeout);
    });
  });

  return (
    <LabeledBox class={cn(_SnakeGame, $class, "")} label="snake" style={style}>
      <div class="relative h-full min-h-20 w-full overflow-hidden">
        <div class="absolute left-0 top-0 h-full w-full">
          <svg class={cn(Board, "h-full w-full")} ref={canvas} />
        </div>
      </div>
    </LabeledBox>
  );
};

const _SnakeGame = css``;

const Board = css`
  background: repeating-conic-gradient(
      ${color("colors-primary-100")} 0 90deg,
      transparent 0 180deg
    )
    0 0/32px 32px;
`;

export default SnakeGame;
