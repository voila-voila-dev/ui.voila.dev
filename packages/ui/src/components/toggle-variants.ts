import { cva, type VariantProps } from "#lib/cva";

/**
 * The single canonical toggle cva - base, variants and sizes. Built on the
 * project-wide, tailwind-merge-configured `cva` (see `#lib/cva`), and shared via
 * the `@voila/ui/toggle-variants` subpath so `toggle-group` (and non-React
 * surfaces) can render the same toggle. Import `toggleVariants` from here (or
 * from `@voila/ui/toggle`, which re-exports it), never inline the strings.
 */
export const toggleVariants = cva({
  base: "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-pressed:bg-accent data-pressed:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  variants: {
    variant: {
      default: "bg-transparent",
      outline:
        "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
    },
    size: {
      default: "h-9 px-2 min-w-9",
      sm: "h-8 px-1.5 min-w-8",
      lg: "h-10 px-2.5 min-w-10",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export type ToggleVariants = VariantProps<typeof toggleVariants>;

/** The semantic variant names - keep in sync with the `variant` axis above. */
export const toggleVariantOptions = ["default", "outline"] as const satisfies readonly NonNullable<
  ToggleVariants["variant"]
>[];

export type ToggleVariant = (typeof toggleVariantOptions)[number];

/** The size names - keep in sync with the `size` axis above. */
export const toggleSizeOptions = ["default", "sm", "lg"] as const satisfies readonly NonNullable<
  ToggleVariants["size"]
>[];

export type ToggleSize = (typeof toggleSizeOptions)[number];
