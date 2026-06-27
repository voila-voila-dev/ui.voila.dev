import { cva, type VariantProps } from "#lib/cva";

/**
 * Edge-anchored Sheet positioning. A Sheet is a Dialog pinned to one side of the
 * viewport; the `side` axis swaps the inset/border/enter-exit transform. Built on
 * the project-wide tailwind-merge-configured `cva` (see `#lib/cva`).
 */
export const sheetVariants = cva({
  base: "fixed z-50 gap-4 bg-background p-6 shadow-lg transition-transform ease-in-out duration-300",
  variants: {
    side: {
      top: "inset-x-0 top-0 border-b data-starting-style:-translate-y-full data-ending-style:-translate-y-full",
      bottom:
        "inset-x-0 bottom-0 border-t data-starting-style:translate-y-full data-ending-style:translate-y-full",
      left: "inset-y-0 left-0 h-full w-3/4 border-r data-starting-style:-translate-x-full data-ending-style:-translate-x-full sm:max-w-sm",
      right:
        "inset-y-0 right-0 h-full w-3/4 border-l data-starting-style:translate-x-full data-ending-style:translate-x-full sm:max-w-sm",
    },
  },
  defaultVariants: { side: "right" },
});

export type SheetVariants = VariantProps<typeof sheetVariants>;

/** The edges a Sheet can anchor to - keep in sync with the `side` axis above. */
export const sheetSideOptions = [
  "top",
  "bottom",
  "left",
  "right",
] as const satisfies readonly NonNullable<SheetVariants["side"]>[];

export type SheetSide = (typeof sheetSideOptions)[number];
