import { cva, type VariantProps } from "#lib/cva";

/**
 * The single canonical alert cva - base and variants. Built on the project-wide,
 * tailwind-merge-configured `cva` (see `#lib/cva`), and re-exported from
 * `@voila/ui/alert`. Import `alertVariants` from here (or from the component),
 * never inline the strings.
 */
export const alertVariants = cva({
  base: "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  variants: {
    variant: {
      default: "bg-card text-card-foreground",
      destructive:
        "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
    },
  },
  defaultVariants: { variant: "default" },
});

export type AlertVariants = VariantProps<typeof alertVariants>;

/** The semantic variant names - keep in sync with the `variant` axis above. */
export const alertVariantOptions = [
  "default",
  "destructive",
] as const satisfies readonly NonNullable<AlertVariants["variant"]>[];

export type AlertVariant = (typeof alertVariantOptions)[number];
