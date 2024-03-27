import {style} from "~/style/styleUtilTS";


// iOS dies without this for some reason
const base = style`
  -webkit-transform: translateZ(0);
  -webkit-perspective: 1000;
  -webkit-backface-visibility: hidden;
`;

export const _dropShadowMixin = (x: number, y: number, blur: number, color: string) => style`
  filter: drop-shadow(${x}px ${y}px ${blur}px ${color});
  ${base}
`;

export const _boxShadowMixin = (x: number, y: number, blur: number, color: string, options?: { inset?: boolean }) => style`
  box-shadow: ${options?.inset ? "inset " : ""}${x}px ${y}px ${blur}px ${color};
  ${base}
`;
