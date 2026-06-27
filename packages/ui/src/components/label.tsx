import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#lib/cn";

// Base UI uses native `<label>` paired with `Field` parts — no dedicated Label
// primitive. This is a styled, polymorphic wrapper around the native element.

export function Label({ className, render, ...props }: useRender.ComponentProps<"label">) {
  return useRender({
    defaultTagName: "label",
    props: mergeProps<"label">(
      {
        className: cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className,
        ),
      },
      props,
    ),
    render,
    state: { slot: "label" },
  });
}
