import {
  _SVG_IMPORT_readFileAsync,
  _SVG_IMPORT_readFileSync,
} from "./SVG.import";
import cn from "classnames";
import { Component, JSX } from "solid-js";
import { isServer } from "solid-js/web";
import { config } from "~/config";
import path from "path";

const allowedAttrs = ["width", "height", "viewBox", "fuji:stroke-count"];

const parseSVG = (raw: string) => {
  // remove preamble
  raw = raw.slice(raw.indexOf("<svg") + "<svg".length);

  let OpeningTag = raw.slice(0, raw.indexOf(">"));
  OpeningTag = OpeningTag.replaceAll("\n", " ");

  const attrs: Record<string, any> = {};

  while (true) {
    let idx = OpeningTag.indexOf("=");
    if (idx == -1) break;
    const key = OpeningTag.slice(0, idx).trim();
    OpeningTag = OpeningTag.slice(idx + 2);

    idx = OpeningTag.indexOf('"');
    const value = OpeningTag.slice(0, idx).trim();
    OpeningTag = OpeningTag.slice(idx + 1);

    if (!allowedAttrs.includes(key)) continue;
    attrs[key] = value;
  }

  const inner = raw
    .slice(raw.indexOf(">") + 1, raw.lastIndexOf("</svg>"))
    .trim();

  return { data: inner, attrs };
};

export interface SVGDataEntry {
  data: string;
  attrs: Record<string, any>;
}
const _cache = new Map<string, SVGDataEntry>();

function getInitialData(src: string, async: true): Promise<SVGDataEntry>;
function getInitialData(src: string, async?: false | never): SVGDataEntry;
function getInitialData(src: string, async?: boolean) {
  if (!isServer) {
    return undefined;
  } else {
    // if (src.startsWith(config.resourceBaseURL))
    //   src = src.slice(config.resourceBaseURL.length);
    if (src.startsWith(config.base)) src = src.slice(config.base.length);

    src = path.join(process.cwd(), "public", src);

    const lookup = _cache?.get(src);
    if (lookup) return lookup;

    try {
      if (async) {
        return _SVG_IMPORT_readFileAsync(src).then((raw) => {
          const rawStr = raw.toString();
          const parsed = parseSVG(rawStr);
          _cache?.set(src, parsed);
          return parsed;
        });
      } else {
        const raw = _SVG_IMPORT_readFileSync(src).toString();
        const parsed = parseSVG(raw);
        _cache?.set(src, parsed);
        return parsed;
      }
    } catch (err: any) {
      console.warn(`failed to SSR SVG at '${src}'`, err.toString());
      return undefined;
    }
  }
}

export const SVGPreloadServer = (src: string) => getInitialData(src);
export const SVGPreloadServerAsync = async (src: string) =>
  getInitialData(src, true);
export const SVGClearCacheServer = () => _cache.clear();

interface Props extends JSX.SvgSVGAttributes<SVGSVGElement> {
  className?: string;
  src: string;
  loader?: JSX.Element;
  onLoad?: () => void;
}

const SVG: Component<Props> = (props) => {
  const { src, loader, className, onLoad, ...rest } = $destructure(props);
  const initial = getInitialData(src);

  let loaded = $signal(true);
  let mounted = false;

  let ref!: SVGSVGElement;

  let effectTime = 0;
  $effect(async () => {
    effectTime = +new Date();
    const _effectTime = effectTime;

    // if SSR content is there, cache it for reuse
    if (
      !mounted &&
      ref.childNodes.length &&
      ref.attributes.getNamedItem("data-src")!.value == src
    ) {
      const currentAttrs: Record<string, any> = {};
      for (const attr of ref.attributes) {
        if (!allowedAttrs.includes(attr.name)) continue;
        currentAttrs[attr.name] = attr.value;
      }
      const parsed = {
        attrs: currentAttrs,
        data: ref.innerHTML,
      };
      _cache.set(src, parsed);

      mounted = true;
      loaded = true;
      onLoad?.();
      return;
    }

    const parsed =
      _cache?.get(src) ??
      (await (async () => {
        const res = await fetch(src);
        const resText = await res.text();
        const parsed = parseSVG(resText);
        _cache.set(src, parsed);
        return parsed;
      })());

    if (effectTime != _effectTime) return;

    ref.innerHTML = parsed.data;

    for (const attr of ref.attributes) {
      if (["class", ...Object.keys(rest)].includes(attr.name)) continue;
      ref.removeAttribute(attr.name);
    }
    for (const [key, attr] of Object.entries(parsed.attrs)) {
      ref.setAttribute(key, attr);
    }

    loaded = true;
    mounted = true;
    onLoad?.();
  });

  return (
    <Show when={loaded} fallback={loader}>
      <svg
        {...(initial?.attrs ?? {})}
        data-src={src}
        ref={ref}
        class={cn(className)}
        innerHTML={initial?.data}
        {...rest}
      />
    </Show>
  );
};

export default SVG;
