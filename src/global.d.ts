/// <reference types="@solidjs/start/env" />
/// <reference types="solid-labels" />
/// <reference types="vite-plugin-compile-time/client" />

declare module "*.md";

declare module "*.bmp" {
  const src: string;
  export default src;
}

declare module "*.jpg?lazy" {
  import { Component, ComponentProps } from "solid-js";
  import LazyImage from "~/LazyImage";
  const src: Component<ComponentProps<ReturnType<typeof LazyImage>>>;
  export default src;
}

declare module "*.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
