import fs from "fs";
import repeat from "lodash/repeat.js";
import Terminal from "asciinema-player/terminal.js";
import AsciinemaVite from "~/terminalcap/Asciinema.vite";

const hexToRGB = (hex: string) => {
  hex = hex.replace("#", "");

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return [r, g, b];
};

interface VTSegment {
  text?: string;
  cellCount: number;
  charWidth: number;
  offset: number;
  pen: Map<string, string | boolean>;
}

export interface Segment {
  text?: string;
  cellCount: number;
  charWidth: number;
  offset: number;
  pen: {
    fg?: string | number;
    bg?: string | number;
    bold?: boolean;
    inverse?: boolean;
  };
}

export interface Line {
  segments: Segment[];
}
export interface Cursor {
  shape: "default" | "block" | "underscore" | "line" | "box";
  pos: [number, number];
  visible: boolean;
  blinking: boolean;
}
export interface Frame {
  time: number;
  lines: Record<number, Line>;
  cursor: Cursor;
}

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
  theme: {
    foreground: string;
    background: string;
    palette: string[];
  };
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

const terminalColors: Record<string, string> = {
  "#000000": "black",
  "#bb0000": "red",
  "#00bb00": "green",
  "#bbbb00": "yellow",
  "#97bde3": "blue",
  "#ff00ff": "magenta",
  "#00bbbb": "cyan",
  "#eeeeee": "white",
  "#555555": "brightBlack",
  "#ff5555": "brightRed",
  "#00ff00": "brightGreen",
  "#ffff55": "brightYellow",
  "#32afff": "brightBlue",
  "#ff55ff": "brightMagenta",
  "#55ffff": "brightCyan",
  "#ffffff": "brightWhite",
};

const namedColorsMap: Record<string, string> = {
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
  brightBlue: "#32afff",
  brightMagenta: "#ff55ff",
  brightCyan: "#55ffff",
  brightWhite: "#ffffff",
  //
  // "2": "#bb0000",

  // 1: "#CC4542",
  // 2: "#F5C504",
  // 3: "#90C93F",
  // 4: "#569E16",
  // 5: "#93784E",
  // 6: "#CE830D",
  // 7: "#458383",
  // 8: "#007E8A",
  // 9: "#7A7A43",
  // 10: "#DD6718",
  // 11: "#CC4542",
  // 12: "#ff55ff",
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

type Meta = Parameters<typeof AsciinemaVite>[0];

export const compileAsciinema = async (filepath: string): Promise<Meta> => {
  let raw = fs
    .readFileSync(filepath)
    .toString()
    .split("\n")
    .filter((l) => l.length)
    .map((l) => JSON.parse(l));
  const header = (await Terminal.default.parser.asciicast(raw)) as {
    cols: number;
    rows: number;
    events: [number, string, string][];
    theme: {
      foreground: string;
      background: string;
      palette: string[];
    };
  };

  const VT = await Terminal.default.loadVt();
  const vt = VT.create(header.cols, header.rows, false, 0);

  const encodedFrames: Frame[] = [];

  for (const ev of header.events) {
    const [time, type, data] = ev;
    if (type === "o") {
      const changedLines = vt.feed(data) as number[];
      if (!changedLines.length) continue;

      const lines = changedLines.reduce(
        (acc, lnr) => {
          const l = vt.getLine(lnr) as VTSegment[];

          const segments = l.map((VTSegment) => {
            const segment: Segment = {
              ...VTSegment,
              pen: Object.fromEntries(VTSegment.pen.entries()),
            };
            console.log(segment.pen.fg);
            // fg/bg it's a number from 1-16 or string "#ffffff"

            // if (segment.pen.fg && namedColorsMap[segment.pen.fg]) {
            //   segment.pen.fg = namedColorsMap[segment.pen.fg];
            // }
            // if (segment.pen.bg && namedColorsMap[segment.pen.bg]) {
            //   segment.pen.bg = namedColorsMap[segment.pen.bg];
            // }
            return segment;
          });

          acc[lnr] = {
            segments,
          } satisfies Line;

          return acc;
        },
        {} as Record<number, Line>
      );

      encodedFrames.push({
        time: time * 1000,
        lines,
        cursor: vt.getCursor(),
      });
    } else {
      console.log("unhandled event", ev);
    }
  }

  return {
    header: {
      width: header.cols,
      height: header.rows,
      theme: header.theme,
    },
    encodedFrames,
  };
};
