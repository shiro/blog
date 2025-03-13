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

  let frames = [];
  const frameMarker = "=== frame ===";
  let prevLength = 0;

  while (raw.length != prevLength) {
    prevLength = raw.length;

    if (!raw.startsWith(frameMarker)) break;

    const headerEndIdx = raw.indexOf("\n");
    if (headerEndIdx == -1) break;

    const header = raw.slice(0, headerEndIdx);
    // raw = raw.slice(0, headerEndIdx + 1);

    const nextFrameIdx = raw.indexOf(frameMarker, 1);

    if (nextFrameIdx == -1) {
      frames.push(trim(raw.slice(headerEndIdx + 1), "\n"));
      break;
    }

    const frame = raw.slice(headerEndIdx + 1, nextFrameIdx - 1);
    frames.push(frame);

    raw = raw.slice(nextFrameIdx);
  }

  frames = padFrames(frames);

  let lastFrame = frames[0];
  return frames
    .map((frame) => parseFrame(t, frame))
    .map((frame, idx, frames) => {
      if (idx == 0) {
        lastFrame = frames[idx];
        return frame;
      }
      const delta = createPatch(lastFrame, frame) as any;
      lastFrame = frame;
      return delta;
    });
};

const padFrames = (frames: string[]) => {
  const lines = frames.map((frame) =>
    frame.split("\n").filter((line) => line != "")
  );
  const maxLines = max(lines.map((frame) => frame.length)) ?? 0;

  return frames.map(
    (frame, idx) =>
      lines[idx].join("\n") + repeat("\n", maxLines - lines[idx].length)
  );
};

const parseFrame = (t: any, text: string) => {
  const tokens = tokenizeAnsiWithTheme(t.default as any, text);

  for (const tokenList of tokens) {
    for (const token of tokenList) {
      if (!token.color || token.color.startsWith("var(")) continue;
      token.color = closestColor(token.color, colors);
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
