import { css } from "@linaria/core";
import { Change } from "textdiff-create";
import cn from "classnames";
import applyPatch from "textdiff-patch";
import { boxShadow } from "~/style/commonStyle";
import { FrameHeader, TermcapHeader } from "~/test.compile";
import { subText } from "~/style/commonStyle";
import IconText from "~/components/IconText";

interface Props {
  header: TermcapHeader;
  encodedFrames: [[FrameHeader, string], ...[FrameHeader, Change[]][]];
}

const FINAL_FRAME_TIME = 1000;

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

  let ref!: HTMLDivElement;

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

  return (
    <div class={cn(container)} onKeyDown={handleKeyDown} tabIndex={0}>
      <div class="flex justify-center">
        <div
          class={cn("bg-colors-primary-50 mt-16 mb-16 flex flex-col", shadow)}>
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
                class={cn(content, "absolute top-0")}
                innerHTML={decodedFrames[activeFrameIdx][1]}
              />
            </div>
          </div>
          <div class="flex h-6 w-full">
            <div class="text-sub mr-2 ml-2 flex gap-2">
              <IconText icon="skip" class="scale-x-[-1]" onclick={seekPrev} />
              <IconText icon={playing ? "pause" : "play"} onclick={playPause} />
              <IconText icon="skip" onclick={seekNext} />
            </div>
            <div
              class="bg-colors-primary-200 relative m-1 flex flex-1 cursor-pointer rounded-sm"
              onclick={(ev) =>
                handleSeekRelative(
                  (ev.clientX - ev.target.getBoundingClientRect().left) /
                    ev.target.clientWidth
                )
              }>
              <div
                ref={ref}
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

const container = css`
  font-family: Courier New;
`;

const seekbar = css`
  // transition: width linear var(--animation-time);
  // transition: width linear 10000ms;
`;

const shadow = css`
  ${boxShadow(0, 2, 16, "rgba(0, 0, 0, 0.1)")};
`;

const spacer = css`
  display: inline-block;
  overflow: hidden;
  ${subText};
  line-height: 1.1;
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
