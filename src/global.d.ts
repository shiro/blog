/// <reference types="@solidjs/start/env" />
/// <reference types="solid-labels" />

declare module "*.md";

declare module "*.bmp" {
  const src: string;
  export default src;
}

declare module "*.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
