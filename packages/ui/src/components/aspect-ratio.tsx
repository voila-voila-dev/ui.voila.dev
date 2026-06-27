import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type * as React from "react";
import { cn } from "#lib/cn";

// Base UI does not ship an AspectRatio primitive — Tailwind/native CSS handles
// it. This is a thin styled wrapper around `aspect-ratio` so callers keep the
// shadcn-shaped API, made polymorphic via Base UI's `useRender`.

export interface AspectRatioProps extends useRender.ComponentProps<"div"> {
  ratio?: number;
}

export function AspectRatio({ ratio = 1, className, style, render, ...props }: AspectRatioProps) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn("relative w-full", className),
        style: { aspectRatio: `${ratio} / 1`, ...style } as React.CSSProperties,
      },
      props,
    ),
    render,
    state: { slot: "aspect-ratio" },
  });
}
