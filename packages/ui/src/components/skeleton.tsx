import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#lib/cn";

export function Skeleton({ className, render, ...props }: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { className: cn("animate-pulse rounded-md bg-primary/10", className) },
      props,
    ),
    render,
    state: { slot: "skeleton" },
  });
}
