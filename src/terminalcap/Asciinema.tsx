import { css } from "@linaria/core";
import cn from "classnames";
import { boxShadow, textDefinitions } from "~/style/commonStyle";
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

type RGBColor = [number, number, number];

interface Props extends Partial<ReturnType<typeof useTerminalcapState>> {
  class?: string;
  header: TermcapHeader;
  encodedFrames: Frame[];
  fullscreenButtonComponent?: ValidComponent;
  fullscreenExitButtonComponent?: ValidComponent;
  onClickOutside?: () => void;
  foregroundColor?: () => string;
  backgroundColor?: () => string;
  colors?: () => RGBColor[];
}

const FINAL_FRAME_TIME = 1000;
const COLS = 100;

interface ClientSegment extends Segment {
  cursor?: Cursor;
}

const hexToRGB = (hex: string) => {
  hex = hex.replace("#", "");

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return [r, g, b];
};

const closestColor = (
  targetColor: string,
  colorArray: [number, number, number][]
) => {
  let closestDistance = Number.MAX_VALUE;
  let closestColor: string | undefined;

  const [r1, g1, b1] = hexToRGB(targetColor);

  colorArray.forEach((color) => {
    const [r2, g2, b2] = color;
    const distance = Math.sqrt(
      (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2
    );
    if (distance < closestDistance) {
      closestDistance = distance;
      closestColor = `rgb(${color.join(", ")})`;
    }
  });

  return closestColor;
};

// const getScale = (x: number) => (-0.29 * x + 138) / 100;

/** Supports up to 300 columns. */
const getScale = (x: number) =>
  (266.3 - 1.388 * x + 0.002235 * Math.pow(x, 2)) / 100;

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
            // class: cn(`cursor cursor-${frame.cursor.shape}`, {
            //   blinking: frame.cursor.blinking,
            // }),
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

const Asciinema = (props: Props) => {
  const {
    class: $class,
    encodedFrames,
    header,
    fullscreenButtonComponent,
    fullscreenExitButtonComponent,
    foregroundColor: _foregroundColor,
    backgroundColor: _backgroundColor,
    colors,
    ...state
  } = $destructure(props);

  const foregroundColor = $memo(
    _foregroundColor?.() ?? header?.theme?.foreground ?? "currentColor"
  );
  const backgroundColor = $memo(
    _backgroundColor?.() ?? header?.theme?.background ?? "#ffffff"
  );

  // header.width = COLS;

  let decodedFrames = $memo(decode(encodedFrames));

  const getSegmentColor = (segment: ClientSegment, name: "fg" | "bg") => {
    const g = (c?: string | number) => {
      if (!c) return undefined;
      if (typeof c == "string") {
        if (colors) return closestColor(c, colors());
        return c;
      }
      return `var(--terminal-color-${c}, var(--fallback-terminal-color-${c}))`;
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

  $mount(() => (playing = true));

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

  const fallbackTerminalColors = header.theme?.palette?.reduce(
    (acc, value, idx) => ({
      ...acc,
      [`--fallback-terminal-color-${idx}`]: value,
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
        style={{ "--scale": 0.6 }}>
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

/**
 * Generate a CSS property value that scales linearly in `[minFontSize..maxFontSize]`, proportional to `[minWidth..maxWidth]`
 */
export const fluidProperty = (
  minWidth: string,
  maxVW: string,
  minFontSize: string,
  fontSizeDelta: string
) => {
  // const usesVariables = [minWidth, maxVW, minFontSize, maxFonSize].some((v) =>
  //   v.startsWith("var(")
  // );

  // only check if units are the same on static values, no way to do it on variables
  // if (!usesVariables) {
  //   const units = [minWidth, maxVW, minFontSize, maxFonSize].map(getUnit);
  //   const allEqual = units.every((u) => u == units[0]);
  //   if (!allEqual) {
  //     throw new Error(
  //       `_calculateFluidProperty: all 4 values need to have the same units, got ${units}`
  //     );
  //   }
  // }

  // calculate values without unit
  // const minFontSizeNumber = usesVariables
  //   ? minFontSize.replace(/(px|rem)/g, "")
  //   : parseFloat(minFontSize);
  // const maxFontSizeNumber = usesVariables
  //   ? maxFonSize.replace(/(px|rem)/g, "")
  //   : parseFloat(maxFonSize);

  // the pxToRem plugin converts "0px" to "0", which breaks things
  if (minWidth == "0px") minWidth = "0rem";

  const deltaVW = parseFloat(maxVW) - parseFloat(minWidth);

  return `calc(${minFontSize} + ${fontSizeDelta} * ((100cqw - ${minWidth}) / ${
    deltaVW
  }))`;
};

const widthFrom = "200px";
const widthTo = "1500px";
const fontFrom = textDefinitions.sub.size;
const fontTo = textDefinitions.body.size;

const container = css`
  font-family: Courier New;
  ${subText};
  line-height: 1.1;
  container-type: inline-size;
`;

const innerContainer = css`
  // @container (min-width: ${widthFrom}) {
  // --cols: 140;
  --unit: 1px;

  --scale: 2 !important;

  --from: calc(${fontFrom} * var(--scale));
  --from-unit: calc(var(--from) * var(--unit));
  --to: calc(${fontTo} * var(--scale));
  --delta: calc(var(--to) - var(--from));

  // font-size: min(
  //   ${fluidProperty(widthFrom, widthTo, "var(--from-unit)", "var(--delta)")},
  //   ${textDefinitions.body.size}px,
  //   1.1cqw
  // );
  font-size: min(
    ${getScale(COLS)}cqw,
    var(--max-font-size, ${textDefinitions.sub.size}px)
  );
  // font-size: ${getScale(COLS)}cqw;
  // font-size: 1.5cqw;
  // }
  // 300 = 0.51
  // 70 = 2.2
  // m = -0.00734782608
  // b = 1.6856521744
`;

const seekbar = css`
  // transition: width linear var(--animation-time);
  // transition: width linear 10000ms;
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

  // pre.shiki {
  //   width: 100%;
  //   display: inline-flex;
  //   margin: 0;
  //   padding: 0;
  //   background: none;
  // }
  // code {
  //   width: 100%;
  //   // display: initial;
  //   // flex-direction: column;
  //   // align-items: flex-start;
  // }

  .line {
    width: initial;
    // display: inline;
    // display: inline-flex;
    font-size: inherit !important;
    line-height: inherit !important;
    white-space: pre;

    span:last-child {
      flex: 1;
      // width: 100%;
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
    // margin-left: -2px;
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
  .cursor {
    //
  }
  .cursor-hidden {
    text-decoration: none !important;
  }

  :root {
    --blink-bg-color: 200, 200, 200;
  }
`;

export default Asciinema;
