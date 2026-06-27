import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import * as React from "react";
import { Toggle } from "#components/toggle";
import { cn } from "#lib/cn";
import type { ToggleVariants } from "./toggle-variants";

const ToggleGroupContext = React.createContext<ToggleVariants>({
  size: "default",
  variant: "default",
});

function Root({
  className,
  variant,
  size,
  children,
  ...props
}: ToggleGroupPrimitive.Props & ToggleVariants) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn("flex items-center justify-center gap-1", className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
}

function Item({ className, variant, size, ...props }: React.ComponentProps<typeof Toggle>) {
  const ctx = React.useContext(ToggleGroupContext);
  return (
    <Toggle
      data-slot="toggle-group-item"
      variant={ctx.variant ?? variant}
      size={ctx.size ?? size}
      className={className}
      {...props}
    />
  );
}

export const ToggleGroup = { Root, Item };
