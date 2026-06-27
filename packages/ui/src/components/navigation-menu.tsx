import { NavigationMenu as BaseNavigationMenu } from "@base-ui/react/navigation-menu";
import { CaretDownIcon } from "@phosphor-icons/react";
import { cn } from "#lib/cn";
import { cva } from "#lib/cva";

function Root({ className, children, ...props }: BaseNavigationMenu.Root.Props) {
  return (
    <BaseNavigationMenu.Root
      data-slot="navigation-menu"
      className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
      {...props}
    >
      {children}
    </BaseNavigationMenu.Root>
  );
}

function List({ className, ...props }: BaseNavigationMenu.List.Props) {
  return (
    <BaseNavigationMenu.List
      data-slot="navigation-menu-list"
      className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)}
      {...props}
    />
  );
}

function Item({ className, ...props }: BaseNavigationMenu.Item.Props) {
  return (
    <BaseNavigationMenu.Item data-slot="navigation-menu-item" className={className} {...props} />
  );
}

export const navigationMenuTriggerStyle = cva({
  base: "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-popup-open:bg-accent/50",
});

function Trigger({ className, children, ...props }: BaseNavigationMenu.Trigger.Props) {
  return (
    <BaseNavigationMenu.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <CaretDownIcon
        className="relative top-px ml-1 h-3 w-3 transition duration-300 group-data-popup-open:rotate-180"
        aria-hidden="true"
      />
    </BaseNavigationMenu.Trigger>
  );
}

function Content({ className, ...props }: BaseNavigationMenu.Content.Props) {
  return (
    <BaseNavigationMenu.Content
      data-slot="navigation-menu-content"
      className={cn(
        "left-0 top-0 w-full transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 md:absolute md:w-auto",
        className,
      )}
      {...props}
    />
  );
}

function Link({ className, ...props }: BaseNavigationMenu.Link.Props) {
  return (
    <BaseNavigationMenu.Link data-slot="navigation-menu-link" className={className} {...props} />
  );
}

function Viewport({ className, ...props }: BaseNavigationMenu.Viewport.Props) {
  return (
    <BaseNavigationMenu.Portal>
      <BaseNavigationMenu.Positioner>
        <BaseNavigationMenu.Popup className="origin-top">
          <BaseNavigationMenu.Viewport
            data-slot="navigation-menu-viewport"
            className={cn(
              "relative mt-1.5 h-(--positioner-height) w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow md:w-(--positioner-width)",
              className,
            )}
            {...props}
          />
        </BaseNavigationMenu.Popup>
      </BaseNavigationMenu.Positioner>
    </BaseNavigationMenu.Portal>
  );
}

export const NavigationMenu = { Root, List, Item, Trigger, Content, Link, Viewport };
