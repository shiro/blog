import { tokensToHast } from "shiki";
import { hastToHtml } from "shiki";
import fs from "fs";
import trim from "lodash/trim.js";
import repeat from "lodash/repeat.js";
import createPatch from "textdiff-create";
import { tokenizeAnsiWithTheme } from "./ansiParser";

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
  cursor_shape: "underline" | "block" | "bar" | "default";
  cursor_blinking: boolean;
  cursor_very_visible: boolean;
  cursor_color: string | null;
}

export interface TermcapHeader {
  width: number;
  height: number;
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

const namedColorsMap = {
  black: "#000000",
  red: "#bb0000",
  green: "#00bb00",
  yellow: "#bbbb00",
  blue: "#97bde3",
  magenta: "#ff00ff",
  cyan: "#00bbbb",
  white: "#eeeeee",
  brightBlack: "#555555",
  brightRed: "#ff5555",
  brightGreen: "#00ff00",
  brightYellow: "#ffff55",
  brightBlue: "#97bde3",
  brightMagenta: "#ff55ff",
  brightCyan: "#55ffff",
  brightWhite: "#ffffff",
};

const colors = [
  ...Object.values(namedColorsMap),

  "#97bde3", // blue
  "#e39797", // red
  "#51c640", // green

  "#CC4542",
  // "#C0D5C1",
  "#F5C504",
  "#90C93F",
  "#569E16",
  "#93784E",
  "#CE830D",
  "#458383",
  "#007E8A",
  "#7A7A43",
  "#DD6718",
  "#CC4542",
  // "#716D6A",
  // "#989BA2",
  // "#5B5957",
];

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

  return undefined;
}

const addCursor = (header: FrameHeader, frame: string) => {
  let cursorCol = header.cursor_x;
  let cursorRow = header.cursor_y;

  let pos = 0;
  let line = 0;

  while (line != cursorRow) {
    const nextLineBreakIdx = frame.indexOf("\n", pos);
    if (nextLineBreakIdx == -1) return undefined;
    ++line;
    pos = nextLineBreakIdx + 1;
    continue;
  }

  let nextLineBreakIdx = frame.indexOf("\n", pos);
  if (nextLineBreakIdx == -1) nextLineBreakIdx = frame.length;

  // we're on the right row now
  while (pos < nextLineBreakIdx + 1) {
    const nextSeq = findSequence(frame, pos);

    if (!nextSeq || nextSeq.startPosition > pos + cursorCol) {
      pos += cursorCol;

      // out of bounds (column)
      if (pos >= nextLineBreakIdx) {
        frame =
          frame.slice(0, nextLineBreakIdx) +
          repeat(" ", pos - nextLineBreakIdx + 1) +
          frame.slice(nextLineBreakIdx);
      }

      return { frame, offset: pos };
    }

    // reduce the target column by the number of chars until the next ctrl seq
    cursorCol -= nextSeq.startPosition - pos;
    pos = nextSeq.endPosition + 1;
  }

  return undefined;
};

export const compileTermcap = async (filepath: string) => {
  let raw = fs
    .readFileSync(
      // fs.readdirSync(".").filter((p) => p.startsWith("termcap-"))[0]
      filepath
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

  // frames = frames.slice(17, 18);

  const mainHeader = { width: 0, height: 0 };

  const parsedFrames: [FrameHeader, string][] = [];
  for (const [header, frame] of frames) {
    const addCursorRet = addCursor(header, frame);

    const tokenizedLines = tokenizeAnsiWithTheme(
      {
        name: "",
        type: "dark",
        bg: "",
        fg: "",
        settings: [],
        colors: Object.fromEntries(
          Object.entries(namedColorsMap).map(([name, value]) => [
            `terminal.ansi${name[0].toUpperCase()}${name.substring(1)}`,
            value,
          ])
        ),
      },
      addCursorRet?.frame ?? frame
    );

    // add in the cursor
    if (addCursorRet) {
      const lineTokens = tokenizedLines[header.cursor_y];
      if (lineTokens) {
        for (let i = 0; i < lineTokens.length; i++) {
          const token = lineTokens[i];
          const startOffset = token.offset;
          const endOffset = lineTokens[i + 1]?.offset ?? Number.MAX_VALUE;

          if (
            startOffset > addCursorRet.offset ||
            endOffset <= addCursorRet.offset
          )
            continue;

          const pos = addCursorRet.offset - startOffset;

          const hidden = token.htmlAttrs?.class == "reverse" && !token.color;

          lineTokens.splice(
            i,
            1,
            { ...token, content: token.content.slice(0, pos) },
            {
              ...token,
              content: token.content[pos],
              // content: token.content.slice(pos, pos + 1),
              color: header.cursor_color ?? token.color,
              htmlAttrs: {
                class: `cursor cursor-${header.cursor_shape} cursor-${!hidden ? "visible" : "hidden"}`,
              },
            },
            { ...token, content: token.content.slice(pos + 1) }
          );
          break;
        }
      }
    }

    // update frame size
    mainHeader.height = Math.max(mainHeader.height, tokenizedLines.length);
    for (const lineTokens of tokenizedLines) {
      let lineLength = lineTokens.reduce(
        (acc, token) => acc + token.content.length,
        0
      );
      mainHeader.width = Math.max(mainHeader.width, lineLength);
    }

    // map colors
    for (const lineTokens of tokenizedLines) {
      for (const token of lineTokens) {
        if (token.color && !token.color.startsWith("var(")) {
          token.color = closestColor(token.color, colors);
        }
        if (token.bgColor && !token.bgColor.startsWith("var(")) {
          token.bgColor = closestColor(token.bgColor, colors);
        }
      }
    }

    const hast = tokensToHast(
      tokenizedLines,
      { themes: {}, lang: "typescript" },
      {} as any
    );
    const html = hastToHtml(hast);
    parsedFrames.push([header, html]);
  }

  let lastFrame = frames[0][1];
  const encodedFrames = parsedFrames.map(([header, frame], idx, frames) => {
    if (idx == 0) {
      lastFrame = frames[idx][1];
      return [header, frame] as const;
    }
    const delta = createPatch(lastFrame, frame) as any;
    lastFrame = frame;
    return [header, delta] as const;
  });

  return {
    header: mainHeader,
    encodedFrames,
  };
};
