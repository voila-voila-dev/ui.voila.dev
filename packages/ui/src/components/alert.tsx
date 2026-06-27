import type * as React from "react";
import { cn } from "#lib/cn";
import { type AlertVariants, alertVariants } from "./alert-variants";

function Root({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & AlertVariants) {
  return (
    <div
      data-slot="alert"
      data-variant={variant}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function Title({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className)}
      {...props}
    />
  );
}

function Description({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export const Alert = { Root, Title, Description };

export {
  type AlertVariant,
  type AlertVariants,
  alertVariantOptions,
  alertVariants,
} from "./alert-variants";
