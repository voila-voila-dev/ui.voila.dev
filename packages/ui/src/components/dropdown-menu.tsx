import { Menu as MenuPrimitive } from "@base-ui/react/menu";
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
} from "./menu-variants";

// Base UI exposes this as `Menu`; shadcn calls it `DropdownMenu`. We keep the
// shadcn names so component imports stay familiar.

function Root({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function Trigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function Group({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function Portal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function Sub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

function RadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return <MenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function SubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & { inset?: boolean }) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      className={cn(
        "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-popup-open:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
      <CaretRightIcon className="ml-auto" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

function SubContent({ className, ...props }: MenuPrimitive.Popup.Props) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner>
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-sub-content"
          className={cn(menuContentVariants(), "shadow-lg", className)}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function Content({
  className,
  align,
  alignOffset,
  side,
  sideOffset = 4,
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
          data-slot="dropdown-menu-content"
          className={cn(menuContentVariants(), className)}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function Item({ className, inset, ...props }: MenuPrimitive.Item.Props & { inset?: boolean }) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(
        menuItemVariants(),
        "gap-2 transition-colors [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        inset && "pl-8",
        className,
      )}
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
      data-slot="dropdown-menu-checkbox-item"
      checked={checked}
      className={cn(menuItemVariants({ indicator: "start" }), "transition-colors", className)}
      {...props}
    >
      <span data-slot="dropdown-menu-checkbox-item-indicator" className={menuIndicatorVariants()}>
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
      data-slot="dropdown-menu-radio-item"
      className={cn(menuItemVariants({ indicator: "start" }), "transition-colors", className)}
      {...props}
    >
      <span data-slot="dropdown-menu-radio-item-indicator" className={menuIndicatorVariants()}>
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
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(menuLabelVariants(), inset && "pl-8", className)}
      {...props}
    />
  );
}

function Separator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn(menuSeparatorVariants(), className)}
      {...props}
    />
  );
}

function Shortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(menuShortcutVariants(), "opacity-60", className)}
      {...props}
    />
  );
}

export const DropdownMenu = {
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
