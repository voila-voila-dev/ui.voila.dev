import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cn } from "#lib/cn";
import { type ToggleVariants, toggleVariants } from "./toggle-variants";

type ToggleProps = TogglePrimitive.Props & ToggleVariants;

export function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: ToggleProps) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      data-variant={variant}
      data-size={size}
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export {
  type ToggleSize,
  type ToggleVariant,
  type ToggleVariants,
  toggleSizeOptions,
  toggleVariantOptions,
  toggleVariants,
} from "./toggle-variants";
export type { ToggleProps };
