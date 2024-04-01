"use server";
import fs from "fs";

export const _SVG_IMPORT_readFileSync = (path: string) => fs.readFileSync(path);
export const _SVG_IMPORT_readFileAsync = (path: string) =>
    fs.promises.readFile(path);
