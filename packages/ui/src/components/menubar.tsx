import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar";
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

function Root({ className, ...props }: MenubarPrimitive.Props) {
  return (
    <MenubarPrimitive
      data-slot="menubar"
      className={cn(
        "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
        className,
      )}
      {...props}
    />
  );
}

function MenuRoot({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="menubar-menu" {...props} />;
}

function Group({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="menubar-group" {...props} />;
}

function Portal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="menubar-portal" {...props} />;
}

function Sub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="menubar-sub" {...props} />;
}

function RadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return <MenuPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />;
}

function Trigger({ className, ...props }: MenuPrimitive.Trigger.Props) {
  return (
    <MenuPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none data-popup-open:bg-accent data-popup-open:text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}

function SubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & { inset?: boolean }) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="menubar-sub-trigger"
      className={cn(menuSubTriggerVariants(), inset && "pl-8", className)}
      {...props}
    >
      {children}
      <CaretRightIcon className="ml-auto h-4 w-4" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

function SubContent({ className, ...props }: MenuPrimitive.Popup.Props) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner>
        <MenuPrimitive.Popup
          data-slot="menubar-sub-content"
          className={cn(menuContentVariants(), "shadow-none", className)}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function Content({
  className,
  align = "start",
  alignOffset,
  side,
  sideOffset = 8,
  positionerProps,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset"> & {
    // Escape hatch for the Positioner props not surfaced as dedicated props
    // (collisionPadding, sticky, anchor, positionMethod, arrowPadding...).
    positionerProps?: Omit<
      MenuPrimitive.Positioner.Props,
      "align" | "alignOffset" | "side" | "sideOffset" | "children"
    >;
  }) {
  const { className: positionerClassName, ...restPositionerProps } = positionerProps ?? {};
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className={positionerClassName}
        {...restPositionerProps}
      >
        <MenuPrimitive.Popup
          data-slot="menubar-content"
          className={cn(menuContentVariants(), "min-w-[12rem]", className)}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function Item({ className, inset, ...props }: MenuPrimitive.Item.Props & { inset?: boolean }) {
  return (
    <MenuPrimitive.Item
      data-slot="menubar-item"
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
}: MenuPrimitive.CheckboxItem.Props) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      checked={checked}
      className={cn(menuItemVariants({ indicator: "start" }), className)}
      {...props}
    >
      <span data-slot="menubar-checkbox-item-indicator" className={menuIndicatorVariants()}>
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon className="h-4 w-4" weight="bold" />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

function RadioItem({ className, children, ...props }: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(menuItemVariants({ indicator: "start" }), className)}
      {...props}
    >
      <span data-slot="menubar-radio-item-indicator" className={menuIndicatorVariants()}>
        <MenuPrimitive.RadioItemIndicator>
          <CircleIcon className="h-2 w-2" weight="fill" />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

// Plain div, not Menu.GroupLabel: Base UI's GroupLabel throws when rendered
// outside a Menu.Group, and labels are routinely used standalone.
function Label({ className, inset, ...props }: React.ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(menuLabelVariants(), inset && "pl-8", className)}
      {...props}
    />
  );
}

function Separator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="menubar-separator"
      className={cn(menuSeparatorVariants(), className)}
      {...props}
    />
  );
}

function Shortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(menuShortcutVariants(), "text-muted-foreground", className)}
      {...props}
    />
  );
}

export const Menubar = {
  Root,
  Menu: MenuRoot,
  Group,
  Portal,
  Sub,
  RadioGroup,
  Trigger,
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
