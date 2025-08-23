import fs from "fs";
import AsciinemaVite from "~/terminalcap/Asciinema.vite";
// @ts-ignore
import Terminal from "asciinema-player/terminal.js";

const VTPromise = Terminal.loadVt();

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
  theme?: {
    foreground?: string;
    background?: string;
    palette?: string[];
  };
}

type Meta = Parameters<typeof AsciinemaVite>[0];

export const compileAsciinema = async (filepath: string): Promise<Meta> => {
  let raw = fs
    .readFileSync(filepath)
    .toString()
    .split("\n")
    .filter((l) => l.length)
    .map((l) => JSON.parse(l));
  const header = (await Terminal.parser.asciicast(raw)) as {
    cols: number;
    rows: number;
    events: [number, string, string][];
    theme?: {
      foreground?: string;
      background?: string;
      palette?: string[];
    };
  };
  header.theme = undefined;

  const VT = await VTPromise;
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

          const segments = l.map((VTSegment) => ({
            ...VTSegment,
            pen: Object.fromEntries(VTSegment.pen.entries()),
          }));

          acc[lnr] = { segments } satisfies Line;

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
