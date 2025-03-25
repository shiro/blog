import { css } from "@linaria/core";
import { Change } from "textdiff-create";
import cn from "classnames";
import applyPatch from "textdiff-patch";
import { boxShadow } from "~/style/commonStyle";
import { FrameHeader, TermcapHeader } from "~/test.compile";
import { subText } from "~/style/commonStyle";

interface Props {
  header: TermcapHeader;
  encodedFrames: [[FrameHeader, string], ...[FrameHeader, Change[]][]];
}

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

  let activeFrameIdx = $signal(0);
  $effect(() => {
    let timeout: NodeJS.Timeout | undefined;
    const fn = () => {
      const nextFrameIdx =
        ($untrack(activeFrameIdx) + 1) % encodedFrames.length;
      const nextFrameTime =
        nextFrameIdx == 0
          ? 2000
          : decodedFrames[nextFrameIdx][0].time -
            decodedFrames[$untrack(activeFrameIdx)][0].time;

      timeout = setTimeout(() => {
        activeFrameIdx = nextFrameIdx;
        fn();
      }, nextFrameTime);
    };
    fn();

    return () => clearTimeout(timeout);
  });

  return (
    <div class={cn(container, "flex justify-center")}>
      <div
        class={cn(
          "bg-colors-primary-50 relative mt-16 mb-16 flex p-2",
          shadow
        )}>
        <Show when={header.width}>
          <span class={cn(spacer, "h-0")}>
            {Array(header.width)
              .fill(0)
              .map(() => "a")}
          </span>
        </Show>
        <Show when={header.height}>
          <span class="flex flex-col">
            {Array(header.height)
              .fill(0)
              .map(() => (
                <span class={spacer}>{"\u200b"}</span>
              ))}
          </span>
        </Show>
        <div
          class={cn(content, "absolute")}
          innerHTML={decodedFrames[activeFrameIdx][1]}
        />
      </div>
    </div>
  );
};

const container = css`
  font-family: Courier New;
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
