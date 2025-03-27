import { css } from "@linaria/core";
import { Change } from "textdiff-create";
import cn from "classnames";
import applyPatch from "textdiff-patch";
import { boxShadow, textDefinitions } from "~/style/commonStyle";
import { FrameHeader, TermcapHeader } from "~/test.compile";
import { subText } from "~/style/commonStyle";
import { color } from "~/style/commonStyle";
import Icon from "~/components/Icon";

interface Props {
  header: TermcapHeader;
  encodedFrames: [[FrameHeader, string], ...[FrameHeader, Change[]][]];
}

const FINAL_FRAME_TIME = 1000;
const COLS = 300;

// const getScale = (x: number) => (-0.29 * x + 138) / 100;

/** Supports up to 300 columns. */
const getScale = (x: number) =>
  (266.3 - 1.388 * x + 0.002235 * Math.pow(x, 2)) / 100;

const decode = (encodedFrames: Props["encodedFrames"]) => {
  if (!encodedFrames.length) return [];

  const frames = [encodedFrames[0]];
  let lastFrame = encodedFrames[0][1];

  for (let i = 1; i < encodedFrames.length; i++) {
    const [header, change] = encodedFrames[i] as [FrameHeader, Change[]];
    frames[i] = [header, applyPatch(lastFrame, change)];
    lastFrame = frames[i][1];
  }

  return frames;
};

const Terminalcap = (props: Props) => {
  const { encodedFrames, header } = $destructure(props);

  header.width = COLS;

  let decodedFrames = $memo(decode(encodedFrames));

  const totalTime = $memo(
    (() => {
      const lastFrame = decodedFrames[decodedFrames.length - 1];
      if (!lastFrame) return 0;
      return lastFrame[0].time + FINAL_FRAME_TIME;
    })()
  );

  let playing = $signal(false);
  let currentTime = $signal(0);
  let activeFrameIdx = $signal(0);
  let progress = $memo(currentTime / totalTime);

  let seekbarRef!: HTMLDivElement;
  let contentRef!: HTMLDivElement;
  let boxRef!: HTMLDivElement;

  let lastUpdate = +new Date();

  let interval: NodeJS.Timeout | undefined;
  const startPlayLoop = () => {
    const tickDuration = 10;
    lastUpdate = +new Date();

    interval = setInterval(() => {
      requestAnimationFrame(() => {
        const now = +new Date();
        const delta = now - lastUpdate;
        lastUpdate = now;

        const nextFrameIdx = (activeFrameIdx + 1) % encodedFrames.length;

        const nextFrameTime =
          nextFrameIdx != 0
            ? decodedFrames[nextFrameIdx][0].time
            : decodedFrames[activeFrameIdx][0].time + FINAL_FRAME_TIME;

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
    return () => clearInterval(interval);
  };

  const play = () => {
    playing = true;
    startPlayLoop();
  };

  const pause = () => {
    playing = false;
    clearInterval(interval);
  };

  const playPause = () => (playing ? pause() : play());

  const handleSeekRelative = (progress: number) => {
    const seekTime = progress * totalTime;

    let nextFrameIdx = decodedFrames.findIndex(
      ([header]) => header.time > seekTime
    );
    if (nextFrameIdx == -1) nextFrameIdx = decodedFrames.length;

    const frameIdx = Math.max(0, nextFrameIdx - 1);

    lastUpdate = +new Date();
    activeFrameIdx = frameIdx;
    currentTime = seekTime;
  };
  const seekPrev = () => {
    pause();
    if (activeFrameIdx == 0) return;
    --activeFrameIdx;
    currentTime = decodedFrames[activeFrameIdx][0].time;
  };
  const seekNext = () => {
    pause();
    if (activeFrameIdx == decodedFrames.length - 1) return;
    ++activeFrameIdx;
    currentTime = decodedFrames[activeFrameIdx][0].time;
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

  $mount(() => playPause());

  let contentFocused = $signal(false);
  $effect(() => {
    const observer = new MutationObserver((mutations) => {
      if (!contentFocused || document.activeElement !== document.body) return;
      if (!mutations.some((mutation) => mutation.removedNodes.length > 0))
        return;
      boxRef.focus();
    });

    observer.observe(contentRef, {
      subtree: true,
      attributes: false,
      childList: true,
    });

    return () => observer.disconnect();
  });

  return (
    <div class={cn(container)}>
      <div
        class={cn(innerContainer, "flex justify-center")}
        style={{ "--scale": 0.6 }}>
        <div
          ref={boxRef}
          class={cn("bg-colors-primary-50 mt-16 mb-16 flex flex-col", box)}
          onFocusOut={() => (contentFocused = false)}
          onKeyDown={handleKeyDown}
          tabindex={0}>
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
              <div
                ref={contentRef}
                class={cn(content, "absolute top-0")}
                onFocusIn={() => (contentFocused = true)}
                onFocusOut={() => (contentFocused = false)}
                innerHTML={decodedFrames[activeFrameIdx][1]}
              />
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
              <For each={decodedFrames}>
                {([header]) => (
                  <div
                    class="bg-colors-primary-700 absolute top-0 h-full w-px"
                    style={{
                      left: `${Math.round((header.time / totalTime) * 100)}%`,
                    }}
                  />
                )}
              </For>
            </div>
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

  font-size: 0;
  container-type: size;
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
  font-size: min(${getScale(COLS)}cqw, ${textDefinitions.sub.size}px);
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

  pre {
    display: inline-flex;
    margin: 0;
    padding: 0;
    background: none;
  }
  code {
    // display: initial;
    // flex-direction: column;
    // align-items: flex-start;
  }

  .line {
    width: initial;
    display: flex;
    font-size: inherit !important;
    line-height: inherit !important;

    span:last-child {
      flex: 1;
    }
  }

  .cursor-underline {
    text-decoration: underline;
  }
  .cursor-block {
    background: red;
  }
  .cursor {
    // background: red;
  }
  .cursor-hidden {
    text-decoration: none !important;
  }
`;

export default Terminalcap;
