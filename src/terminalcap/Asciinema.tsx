import { css } from "@linaria/core";
import cn from "classnames";
import { boxShadow } from "~/style/commonStyle";
import { subText } from "~/style/commonStyle";
import { color } from "~/style/commonStyle";
import Icon from "~/components/Icon";
import {
  createEffect,
  createSignal,
  on,
  Signal,
  untrack,
  ValidComponent,
} from "solid-js";
import {
  Cursor,
  Frame,
  Segment,
  TermcapHeader,
} from "~/terminalcap/asciinema.server";
import { cloneDeep } from "lodash";

export type RGBColor = [number, number, number];

interface Props extends Partial<ReturnType<typeof useTerminalcapState>> {
  class?: string;
  header: TermcapHeader;
  encodedFrames: Frame[];
  fullscreenButtonComponent?: ValidComponent;
  fullscreenExitButtonComponent?: ValidComponent;
  disableTrueColor?: boolean;
  forceCustomTheme?: boolean;
  maxFontSize?: string;
  autoplay?: boolean;
  onKeyDown?: (ev: KeyboardEvent) => void;
  onClickOutside?: () => void;
  foregroundColor?: () => string;
  backgroundColor?: () => string;
  colors?: () => string[];
}

const DEFAULT_COLORS = () => {
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  if (prefersDarkScheme) {
    // https://github.com/Gogh-Co/Gogh/blob/dfc128e018aa4d7429f0a5bbd8a90955e36f0752/themes/Gruvbox%20Dark.yml
    return [
      "#282828",
      "#CC241D",
      "#98971A",
      "#D79921",
      "#458588",
      "#B16286",
      "#689D6A",
      "#A89984",
      "#928374",
      "#FB4934",
      "#B8BB26",
      "#FABD2F",
      "#83A598",
      "#D3869B",
      "#8EC07C",
      "#EBDBB2",
    ];
  }

  // https://github.com/Gogh-Co/Gogh/blob/dfc128e018aa4d7429f0a5bbd8a90955e36f0752/themes/Gruvbox.yml
  return [
    "#FBF1C7",
    "#CC241D",
    "#98971A",
    "#D79921",
    "#458588",
    "#B16286",
    "#689D6A",
    "#7C6F64",
    "#928374",
    "#9D0006",
    "#79740E",
    "#B57614",
    "#076678",
    "#8F3F71",
    "#427B58",
    "#3Cl836",
  ];
};

const DEFAULT_BACKGROUND = () => DEFAULT_COLORS()[0];
const DEFAULT_FOREGROUND = () => DEFAULT_COLORS()[15];

/** keep the last frame up for a bit */
const FINAL_FRAME_TIME = 1000;

interface ClientSegment extends Segment {
  cursor?: Cursor;
}

const toRGB = (input: string | RGBColor): RGBColor => {
  if (Array.isArray(input)) return input;

  if (input.startsWith("rgb")) {
    const start = input.indexOf("(") + 1;
    const end = input.indexOf(")", start);
    const rgbComponents = input
      .substring(start, end)
      .split(",")
      .map((component) => Number(component.trim()));
    return rgbComponents.slice(0, 3) as [number, number, number];
  }

  input = input.replace("#", "");

  const r = parseInt(input.slice(0, 2), 16);
  const g = parseInt(input.slice(2, 4), 16);
  const b = parseInt(input.slice(4, 6), 16);

  return [r, g, b];
};

const closestColorIndex = (
  targetColor: RGBColor,
  colorArray: [number, number, number][]
) => {
  let closestDistance = Number.MAX_VALUE;
  let closest = 0;

  const [r1, g1, b1] = targetColor;

  colorArray.forEach((color, idx) => {
    const [r2, g2, b2] = color;
    const distance = Math.sqrt(
      (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2
    );
    if (distance < closestDistance) {
      closestDistance = distance;
      closest = idx;
    }
  });

  return closest;
};

/**
 * Magick number scaling function that always scales the terminal text correctly.
 * Supports up to 300 columns.
 */
const getScale = (cols: number) =>
  (266.3 - 1.388 * cols + 0.002235 * Math.pow(cols, 2)) / 100;

const decode = (encodedFrames: Props["encodedFrames"]) => {
  const firstFrame = encodedFrames[0];
  if (!firstFrame) return [];

  const frames = [firstFrame];
  let prevLines = cloneDeep(firstFrame.lines);

  // fill in empty lines from the previous frame
  for (const [frameIdx, frame] of encodedFrames.slice(1).entries()) {
    // apply changed lines
    frame.lines = { ...prevLines, ...frame.lines };
    prevLines = cloneDeep(frame.lines);

    if (frame.cursor.visible) {
      const [row, col] = frame.cursor.pos;
      const segments = frame.lines[row].segments as ClientSegment[];

      let cellOffset = 0;
      for (const [segmentIdx, segment] of segments.entries()) {
        if (segment.text === undefined) {
          break;
        }

        const charIdx = Math.floor((col - cellOffset) / segment.charWidth);
        const chars = segment.text?.split("") ?? [];

        // if cursor is in current segment
        if (col < cellOffset + segment.cellCount) {
          // split segment into half and put a new cursor segment in the middle
          // this invalidates offset positions, but we don't care

          // remove segment, we'll replace it with new ones
          segments.splice(segmentIdx, 1);

          // after segment
          if (chars.length > charIdx) {
            segments.splice(segmentIdx, 0, {
              ...segment,
              text: chars.slice(charIdx + 1).join(""),
            });
          }

          // cursor segment
          segments.splice(segmentIdx, 0, {
            ...segment,
            text: chars[charIdx],
            cursor: frame.cursor,
            pen: {
              ...segment.pen,
              inverse:
                frame.cursor.shape == "block" || frame.cursor.shape == "box",
            },
          });

          // before segment
          if (charIdx != 0) {
            segments.splice(segmentIdx, 0, {
              ...segment,
              text: chars.slice(0, charIdx).join(""),
            });
          }

          // keep segments after this one as they are
          break;
        }

        cellOffset += segment.cellCount;
      }
    }

    frames.push(frame);
  }

  return frames;
};

export const useTerminalcapState = () => {
  const playing = createSignal(false);
  const currentTime = createSignal(0);

  return {
    playing,
    currentTime,
  };
};

const shadowSignal = <T extends unknown>(
  [getInner, setInner]: Signal<T>,
  effectFn: (value: T) => void
): Signal<T> => {
  const [getOuter, setOuter] = createSignal(getInner());
  createEffect(
    on(
      () => getInner(),
      (value) => {
        if (value == untrack(getOuter)) return;
        effectFn(value);
        setOuter(value as any);
      }
    )
  );
  const setter: Setter<T> = (...args) => {
    const ret = setOuter(...(args as any));
    if (getOuter() != untrack(getInner)) setInner(...(args as any));
    return ret;
  };
  return [getOuter, setter];
};

/**
 * Converts color. to rgb, ensures 16 colors (and wraps if missing).
 * Returns default colors if not provided.
 */
const initColors = (colors?: (string | RGBColor)[]): RGBColor[] => {
  if (!colors || !colors.length) return DEFAULT_COLORS().map(toRGB);

  const rgbColors = new Array(Math.max(colors.length, 16))
    .fill(0)
    .map((_, idx) => toRGB(colors[idx % colors.length]));

  return rgbColors;
};

const Asciinema = (props: Props) => {
  const {
    class: $class,
    encodedFrames,
    header,
    fullscreenButtonComponent,
    fullscreenExitButtonComponent,
    disableTrueColor,
    forceCustomTheme,
    autoplay = false,
    maxFontSize = "16px",
    foregroundColor: _foregroundColor,
    backgroundColor: _backgroundColor,
    colors: _colors,
    onKeyDown,
    ...state
  } = $destructure(props);

  const colors = $memo(
    initColors(
      (!forceCustomTheme ? header.theme?.palette : undefined) ?? _colors?.()
    )
  );
  const foregroundColor = $memo(
    (!forceCustomTheme ? header?.theme?.foreground : undefined) ??
      _foregroundColor?.() ??
      DEFAULT_FOREGROUND()
  );
  const backgroundColor = $memo(
    (!forceCustomTheme ? header?.theme?.background : undefined) ??
      _backgroundColor?.() ??
      DEFAULT_BACKGROUND()
  );

  let decodedFrames = $memo(decode(encodedFrames));

  const getSegmentColor = (segment: ClientSegment, name: "fg" | "bg") => {
    const g = (c?: string | number | RGBColor) => {
      if (!c) return undefined;
      if (typeof c == "number") {
        return `var(--terminal-color-${c})`;
      }
      if (typeof c == "string") {
        c = toRGB(c);
      }
      if (disableTrueColor) {
        const idx = closestColorIndex(c, colors);
        return `var(--terminal-color-${idx})`;
      }
      return `rgb(${c.join(",")})`;
    };

    return name == "fg"
      ? segment.pen.inverse
        ? (g(segment.pen.bg) ?? backgroundColor)
        : (g(segment.pen.fg) ?? foregroundColor)
      : segment.pen.inverse
        ? (g(segment.pen.fg) ?? foregroundColor)
        : (g(segment.pen.bg) ?? backgroundColor);
  };

  const totalTime = $memo(
    (() => {
      const lastFrame = decodedFrames[decodedFrames.length - 1];
      if (!lastFrame) return 0;
      return lastFrame.time + FINAL_FRAME_TIME;
    })()
  );

  let playing = $derefSignal(state.playing ?? createSignal(false));
  let currentTime = $derefSignal(
    shadowSignal(state.currentTime ?? createSignal(0), (v) => {
      handleSeekAbsolute(v);
    })
  );
  let activeFrameIdx = $signal(0);

  let progress = $memo(currentTime / totalTime);

  let seekbarRef!: HTMLDivElement;
  let contentRef!: HTMLDivElement;
  let boxRef!: HTMLDivElement;

  let lastUpdate = +new Date();

  let interval: NodeJS.Timeout | undefined;
  const startPlayLoop = () => {
    const tickDuration = 10;

    clearInterval(interval);
    lastUpdate = +new Date();

    interval = setInterval(() => {
      requestAnimationFrame(() => {
        const now = +new Date();
        const delta = now - lastUpdate;
        lastUpdate = now;

        const nextFrameIdx = (activeFrameIdx + 1) % encodedFrames.length;

        const nextFrameTime =
          nextFrameIdx != 0
            ? decodedFrames[nextFrameIdx].time
            : decodedFrames[activeFrameIdx].time + FINAL_FRAME_TIME;

        if (nextFrameTime <= currentTime) {
          activeFrameIdx = nextFrameIdx;

          if (nextFrameIdx == 0) {
            currentTime = 0;
            return;
          }
        }

        currentTime += delta;
      });
    }, tickDuration);
    $cleanup(() => clearInterval(interval));
  };

  $effect(
    $on(
      [playing],
      () => (playing ? startPlayLoop() : clearInterval(interval)),
      { defer: true }
    )
  );

  const playPause = () => (playing = !playing);

  const handleSeekRelative = (progress: number) =>
    handleSeekAbsolute(progress * totalTime);

  const handleSeekAbsolute = (seekTime: number) => {
    let nextFrameIdx = decodedFrames.findIndex(({ time }) => time > seekTime);
    if (nextFrameIdx == -1) nextFrameIdx = decodedFrames.length;

    const frameIdx = Math.max(0, nextFrameIdx - 1);

    lastUpdate = +new Date();
    activeFrameIdx = frameIdx;
    currentTime = seekTime;
  };

  const seekPrev = () => {
    playing = false;
    if (activeFrameIdx == 0) return;
    --activeFrameIdx;
    currentTime = decodedFrames[activeFrameIdx].time;
  };

  const seekNext = () => {
    playing = false;
    if (activeFrameIdx == decodedFrames.length - 1) return;
    ++activeFrameIdx;
    currentTime = decodedFrames[activeFrameIdx].time;
  };

  const handleKeyDown = (ev: KeyboardEvent) => {
    onKeyDown?.(ev);
    if (ev.defaultPrevented) return;

    switch (ev.key) {
      case " ": {
        ev.preventDefault();
        playPause();
        break;
      }
      case "h":
      case "ArrowLeft": {
        ev.preventDefault();
        seekPrev();
        break;
      }
      case "l":
      case "ArrowRight": {
        ev.preventDefault();
        seekNext();
        break;
      }
    }
  };

  $mount(() => {
    // find iniitial frame
    handleSeekAbsolute(currentTime);
    playing = autoplay;
  });

  let contentFocused = $signal(false);
  $effect(() => {
    const observer = new MutationObserver((mutations) => {
      if (!contentFocused || document.activeElement !== document.body) return;
      if (!mutations.some((mutation) => mutation.removedNodes.length > 0))
        return;
      boxRef?.focus();
    });

    observer.observe(contentRef, {
      subtree: true,
      attributes: false,
      childList: true,
    });

    $cleanup(() => observer.disconnect());
  });

  const fallbackTerminalColors = colors.reduce(
    (acc, color, idx) => ({
      ...acc,
      [`--terminal-color-${idx}`]: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
    }),
    {} as Record<string, string>
  );

  return (
    <div class={cn(container, $class, "w-full")} style={fallbackTerminalColors}>
      <div
        class={cn(innerContainer, "flex justify-center", {
          "cursor-pointer": props.onClickOutside,
        })}
        onclick={
          !!props.onClickOutside
            ? (ev) => {
                if (ev.currentTarget != ev.target) return;
                props.onClickOutside?.();
              }
            : undefined
        }
        style={{
          "--scale": 0.6,
          "--max-font-size": maxFontSize,
          "--dynamic-font-size": `${getScale(header.width)}cqw`,
        }}>
        <div
          ref={boxRef}
          class={cn("flex cursor-auto flex-col", box)}
          onFocusOut={() => (contentFocused = false)}
          onKeyDown={handleKeyDown}
          tabindex={0}
          style={{ background: backgroundColor }}>
          <div class="m-2">
            <div class="relative flex flex-col">
              {/* X spacer */}
              <Show when={header.width}>
                <span class={cn(spacer, "h-0")}>
                  {Array(header.width)
                    .fill(0)
                    .map(() => "a")}
                </span>
              </Show>
              {/* Y spacer */}
              <Show when={header.height}>
                <span class="flex flex-col">
                  {Array(header.height)
                    .fill(0)
                    .map(() => (
                      <span class={spacer}>{"\u200b"}</span>
                    ))}
                </span>
              </Show>
              {/* content */}
              <code
                ref={contentRef}
                class={cn(content, "absolute top-0 flex w-full flex-col")}
                onFocusIn={() => (contentFocused = true)}
                onFocusOut={() => (contentFocused = false)}>
                <For each={Object.values(decodedFrames[activeFrameIdx].lines)}>
                  {(line) => (
                    <span class="line">
                      <For each={line.segments as ClientSegment[]}>
                        {(segment) => (
                          <span
                            class={cn(
                              { "font-bold": segment.pen.bold },
                              segment.cursor
                                ? [
                                    `cursor cursor-${segment.cursor.shape}`,
                                    {
                                      "cursor-blinking":
                                        segment.cursor.blinking,
                                    },
                                  ]
                                : []
                            )}
                            style={{
                              color: getSegmentColor(segment, "fg"),
                              background: getSegmentColor(segment, "bg"),
                              ...(segment.cursor
                                ? {
                                    "--fg": getSegmentColor(segment, "fg"),
                                    "--bg": getSegmentColor(segment, "bg"),
                                  }
                                : {}),
                            }}>
                            {segment.text}
                          </span>
                        )}
                      </For>
                    </span>
                  )}
                </For>
              </code>
            </div>
          </div>
          <div class="flex h-6 w-full">
            <div class="text-sub mr-2 ml-2 flex gap-2">
              <Icon
                icon="skip"
                class="h-5 w-5 scale-x-[-1]"
                onClick={seekPrev}
              />
              <Icon
                icon={playing ? "pause" : "play"}
                class="h-5 w-5"
                onClick={playPause}
              />
              <Icon icon="skip" onClick={seekNext} class="h-5 w-5" />
            </div>
            <div
              class="bg-colors-primary-200 relative m-1 flex flex-1 cursor-pointer rounded-sm"
              onclick={(ev) => {
                ev.preventDefault();
                handleSeekRelative(
                  (ev.clientX - ev.target.getBoundingClientRect().left) /
                    ev.target.clientWidth
                );
              }}>
              <div
                ref={seekbarRef}
                class={cn(
                  seekbar,
                  "bg-colors-primary-600 w-full origin-left rounded-sm"
                )}
                style={{ transform: `scaleX(${progress})` }}
              />
              {/* <For each={decodedFrames}> */}
              {/*   {({ time }) => ( */}
              {/*     <div */}
              {/*       class="bg-colors-primary-700 absolute top-0 h-full w-px" */}
              {/*       style={{ */}
              {/*         left: `${Math.round((time / totalTime) * 100)}%`, */}
              {/*       }} */}
              {/*     /> */}
              {/*   )} */}
              {/* </For> */}
            </div>
            <Show when={fullscreenButtonComponent}>
              <div class="text-sub mr-2 ml-2 flex gap-2">
                <Dynamic component={fullscreenButtonComponent}>
                  <Icon icon="fullscreen" class="h-5 w-5" />
                </Dynamic>
              </div>
            </Show>
            <Show when={fullscreenExitButtonComponent}>
              <div class="text-sub mr-2 ml-2 flex gap-2">
                <Dynamic component={fullscreenExitButtonComponent}>
                  <Icon icon="fullscreen-exit" class="h-5 w-5" />
                </Dynamic>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
};

const container = css`
  font-family: Courier New;
  ${subText};
  line-height: 1.1;
  container-type: inline-size;
`;

const innerContainer = css`
  font-size: min(var(--dynamic-font-size), var(--max-font-size));
`;

const seekbar = css`
  transition: transform linear 30ms;
`;

const box = css`
  ${boxShadow(0, 2, 16, "rgba(0, 0, 0, 0.1)")}

  &:focus, &:focus-within {
    outline: 2px solid ${color("colors/primary-500")};
    ${boxShadow(0, 2, 16, "rgba(0, 0, 0, 0.35)")}
  }
`;

const spacer = css`
  display: inline-block;
  overflow: hidden;
`;

const content = css`
  display: flex;
  justify-content: center;

  .line {
    width: initial;
    font-size: inherit !important;
    line-height: inherit !important;
    white-space: pre;

    span:last-child {
      flex: 1;
    }
  }

  .cursor-block,
  .cursor-default {
    &.cursor-blinking {
      animation: blinkingCursorBlock 1s step-end infinite;
      @keyframes blinkingCursorBlock {
        0%,
        49% {
          color: var(--fg);
          background-color: var(--bg);
        }
        50%,
        100% {
          color: var(--bg);
          background-color: var(--fg);
        }
      }
    }
  }
  .cursor-underscore {
    text-decoration: underline;

    &.cursor-blinking {
      animation: blinkingCursorUnderscore 1s step-end infinite;
      @keyframes blinkingCursorUnderscore {
        0%,
        49% {
          text-decoration: underline;
        }
        50%,
        100% {
          text-decoration: none;
        }
      }
    }
  }
  .cursor-line {
    border-left: solid 2px currentColor;

    &.cursor-blinking {
      animation: blinkingCursorLine 1s step-end infinite;
      @keyframes blinkingCursorLine {
        0%,
        49% {
          border-left-color: var(--fg);
        }
        50%,
        100% {
          border-left-color: var(--bg);
        }
      }
    }
  }
  .cursor-hidden {
    text-decoration: none !important;
  }
`;

export default Asciinema;
