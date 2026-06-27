import { cva, type VariantProps } from "#lib/cva";

/**
 * The single canonical badge cva - base and variants. Built on the project-wide,
 * tailwind-merge-configured `cva` (see `#lib/cva`), and re-exported from
 * `@voila/ui/badge`. Import `badgeVariants` from here (or from the component),
 * never inline the strings.
 */
export const badgeVariants = cva({
  base: "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  variants: {
    variant: {
      default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
      secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      outline: "text-foreground",
    },
  },
  defaultVariants: { variant: "default" },
});

export type BadgeVariants = VariantProps<typeof badgeVariants>;

/** The semantic variant names - keep in sync with the `variant` axis above. */
export const badgeVariantOptions = [
  "default",
  "secondary",
  "destructive",
  "outline",
] as const satisfies readonly NonNullable<BadgeVariants["variant"]>[];

export type BadgeVariant = (typeof badgeVariantOptions)[number];
