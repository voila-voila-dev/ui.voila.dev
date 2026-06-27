import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#lib/cn";
import { type BadgeVariants, badgeVariants } from "./badge-variants";

export type BadgeProps = useRender.ComponentProps<"div"> & BadgeVariants;

export function Badge({ className, variant = "default", render, ...props }: BadgeProps) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">({ className: cn(badgeVariants({ variant }), className) }, props),
    render,
    state: { slot: "badge", variant },
  });
}

export {
  type BadgeVariant,
  type BadgeVariants,
  badgeVariantOptions,
  badgeVariants,
} from "./badge-variants";
