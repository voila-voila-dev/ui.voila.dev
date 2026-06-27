import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "#lib/cn";
import { type ButtonVariants, buttonVariants } from "./button-variants";

type ButtonProps = ButtonPrimitive.Props & ButtonVariants;

function Button({ className, variant = "default", size = "default", ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export {
  type ButtonSize,
  type ButtonVariant,
  type ButtonVariants,
  buttonSizeOptions,
  buttonVariantOptions,
  buttonVariants,
} from "./button-variants";
export { Button, type ButtonProps };
