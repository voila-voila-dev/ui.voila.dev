import { defineConfig } from "cva";
import { twMerge } from "tailwind-merge";

/**
 * Project-wide `cva` (the class-variance-authority successor, v1), configured to
 * run every generated class string through `tailwind-merge`. This is the single
 * source of variant styling - always import `cva`/`cx`/`compose` from here (or
 * `@voila/ui/cva`), never from the raw `cva` package, so conflicting Tailwind
 * utilities resolve consistently everywhere.
 */
export const { cva, cx, compose } = defineConfig({
  hooks: {
    onComplete: (className) => twMerge(className),
  },
});

export type { VariantProps } from "cva";
