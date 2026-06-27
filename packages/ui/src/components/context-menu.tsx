import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { CaretRightIcon, CheckIcon, CircleIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { cn } from "#lib/cn";
import {
  menuContentVariants,
  menuIndicatorVariants,
  menuItemVariants,
  menuLabelVariants,
  menuSeparatorVariants,
  menuShortcutVariants,
  menuSubTriggerVariants,
} from "./menu-variants";

// Base UI's ContextMenu re-uses the Menu parts under the hood, so the whole
// family (Item, CheckboxItem, ...) comes from the context-menu namespace.

function Root({ ...props }: ContextMenuPrimitive.Root.Props) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function Trigger({ ...props }: ContextMenuPrimitive.Trigger.Props) {
  return <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />;
}

function Group({ ...props }: ContextMenuPrimitive.Group.Props) {
  return <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />;
}

function Portal({ ...props }: ContextMenuPrimitive.Portal.Props) {
  return <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />;
}

function Sub({ ...props }: ContextMenuPrimitive.SubmenuRoot.Props) {
  return <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />;
}

function RadioGroup({ ...props }: ContextMenuPrimitive.RadioGroup.Props) {
  return <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />;
}

function SubTrigger({
  className,
  inset,
  children,
  ...props
}: ContextMenuPrimitive.SubmenuTrigger.Props & { inset?: boolean }) {
  return (
    <ContextMenuPrimitive.SubmenuTrigger
      data-slot="context-menu-sub-trigger"
      className={cn(menuSubTriggerVariants(), inset && "pl-8", className)}
      {...props}
    >
      {children}
      <CaretRightIcon className="ml-auto h-4 w-4" />
    </ContextMenuPrimitive.SubmenuTrigger>
  );
}

function SubContent({ className, ...props }: ContextMenuPrimitive.Popup.Props) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner>
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-sub-content"
          className={cn(menuContentVariants(), className)}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
}

function Content({
  className,
  align,
  alignOffset,
  side,
  sideOffset,
  positionerProps,
  ...props
}: ContextMenuPrimitive.Popup.Props &
  Pick<ContextMenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset"> & {
    // Escape hatch for the Positioner props not surfaced as dedicated props
    // (collisionPadding, sticky, anchor, positionMethod, arrowPadding...).
    positionerProps?: Omit<
      ContextMenuPrimitive.Positioner.Props,
      "align" | "alignOffset" | "side" | "sideOffset" | "children"
    >;
  }) {
  const { className: positionerClassName, ...restPositionerProps } = positionerProps ?? {};
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className={positionerClassName}
        {...restPositionerProps}
      >
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-content"
          className={cn(menuContentVariants(), className)}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
}

function Item({
  className,
  inset,
  ...props
}: ContextMenuPrimitive.Item.Props & { inset?: boolean }) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      className={cn(menuItemVariants(), inset && "pl-8", className)}
      {...props}
    />
  );
}

function CheckboxItem({
  className,
  children,
  checked,
  ...props
}: ContextMenuPrimitive.CheckboxItem.Props) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      checked={checked}
      className={cn(menuItemVariants({ indicator: "start" }), className)}
      {...props}
    >
      <span data-slot="context-menu-checkbox-item-indicator" className={menuIndicatorVariants()}>
        <ContextMenuPrimitive.CheckboxItemIndicator>
          <CheckIcon className="h-4 w-4" weight="bold" />
        </ContextMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

function RadioItem({ className, children, ...props }: ContextMenuPrimitive.RadioItem.Props) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(menuItemVariants({ indicator: "start" }), className)}
      {...props}
    >
      <span data-slot="context-menu-radio-item-indicator" className={menuIndicatorVariants()}>
        <ContextMenuPrimitive.RadioItemIndicator>
          <CircleIcon className="h-2 w-2" weight="fill" />
        </ContextMenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

// Plain div, not GroupLabel: Base UI's GroupLabel throws when rendered outside
// a Group, and labels are routinely used standalone.
function Label({ className, inset, ...props }: React.ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(menuLabelVariants(), "text-foreground", inset && "pl-8", className)}
      {...props}
    />
  );
}

function Separator({ className, ...props }: ContextMenuPrimitive.Separator.Props) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn(menuSeparatorVariants(), "bg-border", className)}
      {...props}
    />
  );
}

function Shortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(menuShortcutVariants(), "text-muted-foreground", className)}
      {...props}
    />
  );
}

export const ContextMenu = {
  Root,
  Trigger,
  Group,
  Portal,
  Sub,
  RadioGroup,
  SubTrigger,
  SubContent,
  Content,
  Item,
  CheckboxItem,
  RadioItem,
  Label,
  Separator,
  Shortcut,
};
