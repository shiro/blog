import { Change } from "textdiff-create";
import applyPatch from "textdiff-patch";
import { FrameHeader } from "~/test.compile";

interface Props {
  encodedFrames: [[FrameHeader, string], ...[FrameHeader, Change[]][]];
}

const Terminalcap = (props: Props) => {
  const { encodedFrames } = $destructure(props);

  let decodedFrames = $memo(
    (() => {
      if (!encodedFrames.length) return [];

      const frames = [encodedFrames[0]];
      let lastFrame = encodedFrames[0][1];

      for (let i = 1; i < encodedFrames.length; i++) {
        const [header, change] = encodedFrames[i] as [FrameHeader, Change[]];
        frames[i] = [header, applyPatch(lastFrame, change)];
        lastFrame = frames[i][1];
      }

      return frames;
    })()
  );

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
  return <div innerHTML={decodedFrames[activeFrameIdx][1]} />;
};

export default Terminalcap;
