import { Select as BaseSelect } from "@base-ui/react/select";
import { CaretDownIcon, CaretUpIcon, CheckIcon } from "@phosphor-icons/react";
import { cn } from "#lib/cn";

function Root<Value, Multiple extends boolean | undefined = false>(
  props: BaseSelect.Root.Props<Value, Multiple>,
) {
  return <BaseSelect.Root data-slot="select" {...props} />;
}

function Group({ ...props }: BaseSelect.Group.Props) {
  return <BaseSelect.Group data-slot="select-group" {...props} />;
}

function Value({ ...props }: BaseSelect.Value.Props) {
  return <BaseSelect.Value data-slot="select-value" {...props} />;
}

function Trigger({ className, children, ...props }: BaseSelect.Trigger.Props) {
  return (
    <BaseSelect.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className,
      )}
      {...props}
    >
      {children}
      <BaseSelect.Icon render={<CaretDownIcon className="h-4 w-4 opacity-50" />} />
    </BaseSelect.Trigger>
  );
}

function ScrollUpButton({ className, ...props }: BaseSelect.ScrollUpArrow.Props) {
  return (
    <BaseSelect.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}
    >
      <CaretUpIcon className="h-4 w-4" />
    </BaseSelect.ScrollUpArrow>
  );
}

function ScrollDownButton({ className, ...props }: BaseSelect.ScrollDownArrow.Props) {
  return (
    <BaseSelect.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}
    >
      <CaretDownIcon className="h-4 w-4" />
    </BaseSelect.ScrollDownArrow>
  );
}

function Content({
  className,
  children,
  align = "center",
  alignOffset,
  side,
  sideOffset = 4,
  positionerProps,
  ...props
}: BaseSelect.Popup.Props &
  Pick<BaseSelect.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset"> & {
    // Escape hatch for the Positioner props not surfaced as dedicated props
    // (alignItemWithTrigger, collisionPadding, sticky, anchor, positionMethod...).
    positionerProps?: Omit<
      BaseSelect.Positioner.Props,
      "align" | "alignOffset" | "side" | "sideOffset" | "children"
    >;
  }) {
  const { className: positionerClassName, ...restPositionerProps } = positionerProps ?? {};
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className={positionerClassName}
        {...restPositionerProps}
      >
        <BaseSelect.Popup
          data-slot="select-content"
          className={cn(
            "relative z-50 max-h-(--available-height) w-(--anchor-width) min-w-[8rem] origin-(--transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:scale-95 data-starting-style:scale-95",
            className,
          )}
          {...props}
        >
          <ScrollUpButton />
          <BaseSelect.List>{children}</BaseSelect.List>
          <ScrollDownButton />
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

function Label({ className, ...props }: BaseSelect.GroupLabel.Props) {
  return (
    <BaseSelect.GroupLabel
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-sm font-semibold", className)}
      {...props}
    />
  );
}

function Item({ className, children, ...props }: BaseSelect.Item.Props) {
  return (
    <BaseSelect.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
        <BaseSelect.ItemIndicator>
          <CheckIcon className="h-4 w-4" weight="bold" />
        </BaseSelect.ItemIndicator>
      </span>
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
    </BaseSelect.Item>
  );
}

function Separator({ className, ...props }: BaseSelect.Separator.Props) {
  return (
    <BaseSelect.Separator
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  );
}

export const Select = {
  Root,
  Group,
  Value,
  Trigger,
  ScrollUpButton,
  ScrollDownButton,
  Content,
  Label,
  Item,
  Separator,
};
