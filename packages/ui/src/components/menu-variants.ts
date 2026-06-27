import { cva, type VariantProps } from "#lib/cva";

/**
 * Shared menu recipe consumed by dropdown-menu, context-menu and menubar so
 * their popups and rows stay visually identical instead of each restating - and
 * drifting from - the same Tailwind strings. Built on the project-wide,
 * tailwind-merge-configured `cva` (see `#lib/cva`).
 *
 * Base UI 1.6 menus expose row state as bare data-attrs (`data-highlighted`,
 * `data-disabled`, `data-popup-open`) and the open/close transition as
 * `data-starting-style`/`data-ending-style`, so the selectors below use that
 * shorthand form rather than the older bracketed `data-[...]` syntax.
 */

/** Floating popup container shared by every menu surface. */
export const menuContentVariants = cva({
  base: "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:scale-95 data-starting-style:scale-95",
});

/**
 * Menu row. `indicator: "start"` swaps the symmetric padding for the left-side
 * gutter (`pl-8 pr-2`) that the check/dot indicator of checkbox and radio rows
 * sits in.
 */
export const menuItemVariants = cva({
  base: "relative flex cursor-default select-none items-center rounded-sm text-sm outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
  variants: {
    indicator: {
      none: "px-2 py-1.5",
      start: "py-1.5 pl-8 pr-2",
    },
  },
  defaultVariants: {
    indicator: "none",
  },
});

export type MenuItemVariants = VariantProps<typeof menuItemVariants>;

/** Indicator placements for menu rows - keep in sync with the `indicator` axis. */
export const menuItemIndicators = ["none", "start"] as const satisfies readonly NonNullable<
  MenuItemVariants["indicator"]
>[];

export type MenuItemIndicator = (typeof menuItemIndicators)[number];

/** Submenu trigger: a menu row that also lights up while its submenu is open. */
export const menuSubTriggerVariants = cva({
  base: "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-popup-open:bg-accent data-popup-open:text-accent-foreground",
});

/** Left-aligned wrapper for the check/dot indicator of selectable rows. */
export const menuIndicatorVariants = cva({
  base: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
});

/** Section heading inside a menu. */
export const menuLabelVariants = cva({
  base: "px-2 py-1.5 text-sm font-semibold",
});

/** Hairline divider between menu sections. */
export const menuSeparatorVariants = cva({
  base: "-mx-1 my-1 h-px bg-muted",
});

/** Right-aligned keyboard-shortcut hint (callers append the color token). */
export const menuShortcutVariants = cva({
  base: "ml-auto text-xs tracking-widest",
});
