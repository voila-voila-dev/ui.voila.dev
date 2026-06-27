import { cva, type VariantProps } from "#lib/cva";

/**
 * The single canonical button cva - base, variants and sizes. Built on the
 * project-wide, tailwind-merge-configured `cva` (see `#lib/cva`), and shared via
 * the `@voila/ui/button-variants` subpath so non-React surfaces can render the
 * same button. Import `buttonVariants` from here (or from `@voila/ui/button`,
 * which re-exports it), never inline the strings.
 */
export const buttonVariants = cva({
  base: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export type ButtonVariants = VariantProps<typeof buttonVariants>;

/** The semantic variant names - keep in sync with the `variant` axis above. */
export const buttonVariantOptions = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
] as const satisfies readonly NonNullable<ButtonVariants["variant"]>[];

export type ButtonVariant = (typeof buttonVariantOptions)[number];

/** The size names - keep in sync with the `size` axis above. */
export const buttonSizeOptions = [
  "default",
  "sm",
  "lg",
  "icon",
] as const satisfies readonly NonNullable<ButtonVariants["size"]>[];

export type ButtonSize = (typeof buttonSizeOptions)[number];
