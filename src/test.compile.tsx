import { tokensToHast } from "shiki";
import { tokenizeAnsiWithTheme } from "shiki";
import { bundledThemes } from "shiki";
import { hastToHtml } from "shiki";
import fs from "fs";
import trim from "lodash/trim";
import max from "lodash/max";
import repeat from "lodash/repeat";
import createPatch from "textdiff-create";

const hexToRGB = (hex: string) => {
  hex = hex.replace("#", "");

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return [r, g, b];
};

export interface FrameHeader {
  time: number;
  cursor_x: number;
  cursor_y: number;
  cursor_blinking: boolean;
  cursor_very_visible: boolean;
  cursor_color: string | null;
}

const closestColor = (targetColor: string, colorArray: string[]) => {
  let closestDistance = Number.MAX_VALUE;
  let closestColor: string | undefined;

  const [r1, g1, b1] = hexToRGB(targetColor);

  colorArray.forEach((color) => {
    const [r2, g2, b2] = hexToRGB(color);
    const distance = Math.sqrt(
      (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2
    );
    if (distance < closestDistance) {
      closestDistance = distance;
      closestColor = color;
    }
  });

  return closestColor;
};

const colors = [
  "##97bde3", // blue
  "#e39797", // red
  "#51c640", // green
];

export const testHtml = async () => {
  const t = (await bundledThemes.nord()) as any;

  let raw = fs
    .readFileSync(
      fs.readdirSync(".").filter((p) => p.startsWith("termcap-"))[0]
    )
    .toString();

  let frames: [FrameHeader, string][] = [];
  const frameMarker = "=== frame ===";
  let prevLength = 0;

  while (raw.length != prevLength) {
    prevLength = raw.length;

    if (!raw.startsWith(frameMarker)) break;

    const headerEndIdx = raw.indexOf("\n");
    if (headerEndIdx == -1) break;

    const header: FrameHeader = JSON.parse(
      raw.slice(frameMarker.length, headerEndIdx)
    );

    const nextFrameIdx = raw.indexOf(frameMarker, 1);

    if (nextFrameIdx == -1) {
      const frame = trim(raw.slice(headerEndIdx + 1), "\n");
      frames.push([header, frame]);
      break;
    }

    const frame = raw.slice(headerEndIdx + 1, nextFrameIdx - 1);
    frames.push([header, frame]);

    raw = raw.slice(nextFrameIdx);
  }

  frames = padFrames(frames);
  frames = addCursor(frames);

  let lastFrame = frames[0][1];
  return frames
    .map(([header, frame]) => [header, parseFrame(t, frame)] as const)
    .map(([header, frame], idx, frames) => {
      if (idx == 0) {
        lastFrame = frames[idx][1];
        return [header, frame] as const;
      }
      const delta = createPatch(lastFrame, frame) as any;
      lastFrame = frame;
      return [header, delta] as const;
    });
};

const padFrames = (
  frames: [FrameHeader, string][]
): [FrameHeader, string][] => {
  const lines = frames.map(([_, frame]) =>
    frame.split("\n").filter((line) => line != "")
  );
  const maxLines = max(lines.map(([frame]) => frame.length)) ?? 0;

  return frames.map(([header], idx) => [
    header,
    lines[idx].join("\n") + repeat("\n", maxLines - lines[idx].length),
  ]);
};

function findSequence(value: string, position: number) {
  const nextEscape = value.indexOf("\u001b", position);

  if (nextEscape !== -1) {
    if (value[nextEscape + 1] === "[") {
      const nextClose = value.indexOf("m", nextEscape);
      if (nextClose !== -1) {
        return {
          sequence: value.substring(nextEscape + 2, nextClose).split(";"),
          startPosition: nextEscape,
          endPosition: nextClose,
        };
      }
    }
  }

  // return { position: value.length };
  return undefined;
}

const addCursor = (
  frames: [FrameHeader, string][]
): [FrameHeader, string][] => {
  // const lines = frames.map(([_, frame]) =>
  //   frame.split("\n").filter((line) => line != "")
  // );
  // const maxLines = max(lines.map(([frame]) => frame.length)) ?? 0;

  return frames.map(([header, frame]) => {
    let cursorCol = 2;
    let cursorRow = 0;

    const lines = frame.split("\n");
    if (cursorRow >= lines.length) return [header, frame];

    // https://github.com/blake-mealey/ansi-sequence-parser/blob/main/src/parser.ts
    let line = lines[cursorRow];

    let pos = 0;
    let offset = 0;
    let bgColorSeqCode = `\x1b[49m`;

    while (pos < line.length) {
      const nextSeq = findSequence(line, pos);

      if (!nextSeq || nextSeq.startPosition > cursorCol + offset) {
        pos = cursorCol + offset;

        if (pos >= line.length) break;

        lines[cursorRow] =
          line.slice(0, pos) +
          "[41m" +
          line[pos] +
          bgColorSeqCode +
          line.slice(pos + 1);
        break;
      }

      for (const seqCode of nextSeq.sequence) {
        if (Number(seqCode) < 40 || Number(seqCode) > 49) continue;
        bgColorSeqCode = `\x1b[${seqCode}m`;
      }

      pos = nextSeq.endPosition + 1;
      offset += nextSeq.endPosition - nextSeq.startPosition + 1;
    }

    return [header, lines.join("\n")];
  });
};

const parseFrame = (t: any, text: string) => {
  const tokens = tokenizeAnsiWithTheme(t.default as any, text);

  for (const tokenList of tokens) {
    for (const token of tokenList) {
      if (token.color && !token.color.startsWith("var(")) {
        // token.color = closestColor(token.color, colors);
      }
      if (token.bgColor && !token.bgColor.startsWith("var(")) {
        // token.bgColor = closestColor(token.bgColor, colors);
      }
    }
  }

  const hast = tokensToHast(
    tokens,
    { themes: {}, lang: "typescript" },
    {} as any
  );
  const html = hastToHtml(hast);
  return html;
};
