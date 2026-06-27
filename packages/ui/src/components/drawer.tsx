import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import * as React from "react";
import { cn } from "#lib/cn";

const DrawerContext = React.createContext<{ close: () => void } | null>(null);

interface RootProps extends DialogPrimitive.Root.Props {}

function Root({ open, defaultOpen, onOpenChange, ...props }: RootProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : internalOpen;

  const handleOpenChange: NonNullable<RootProps["onOpenChange"]> = (next, details) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next, details);
  };

  const close = React.useCallback(() => {
    if (!isControlled) setInternalOpen(false);
    onOpenChange?.(false, {} as Parameters<NonNullable<RootProps["onOpenChange"]>>[1]);
  }, [isControlled, onOpenChange]);

  return (
    <DrawerContext.Provider value={{ close }}>
      <DialogPrimitive.Root
        data-slot="drawer"
        open={currentOpen}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </DrawerContext.Provider>
  );
}

function Trigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function Portal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function Close({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="drawer-close" {...props} />;
}

function Overlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/80 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

// Swipe-to-dismiss threshold (px) and velocity threshold (px/ms).
const DISMISS_DISTANCE = 100;
const DISMISS_VELOCITY = 0.5;

function Content({ className, children, ...props }: DialogPrimitive.Popup.Props) {
  const ctx = React.useContext(DrawerContext);
  const popupRef = React.useRef<HTMLDivElement>(null);
  const dragState = React.useRef<{ startY: number; startTime: number; pointerId: number } | null>(
    null,
  );
  const [dragOffset, setDragOffset] = React.useState(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    dragState.current = { startY: e.clientY, startTime: Date.now(), pointerId: e.pointerId };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current || dragState.current.pointerId !== e.pointerId) return;
    const delta = e.clientY - dragState.current.startY;
    setDragOffset(Math.max(0, delta));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current || dragState.current.pointerId !== e.pointerId) return;
    const delta = e.clientY - dragState.current.startY;
    const elapsed = Date.now() - dragState.current.startTime;
    const velocity = delta / Math.max(elapsed, 1);
    dragState.current = null;
    if (delta > DISMISS_DISTANCE || velocity > DISMISS_VELOCITY) {
      ctx?.close();
    }
    setDragOffset(0);
  };

  return (
    <Portal>
      <Overlay />
      <DialogPrimitive.Popup
        ref={popupRef}
        data-slot="drawer-content"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border border-border bg-background data-ending-style:translate-y-full data-starting-style:translate-y-full",
          dragOffset === 0 && "transition-transform duration-300",
          className,
        )}
        style={dragOffset > 0 ? { transform: `translateY(${dragOffset}px)` } : undefined}
        {...props}
      >
        <div
          data-slot="drawer-handle"
          className="mx-auto mt-4 h-2 w-[100px] shrink-0 cursor-grab touch-none rounded-full bg-muted active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
        {children}
      </DialogPrimitive.Popup>
    </Portal>
  );
}

function Header({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function Footer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function Title({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function Description({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export const Drawer = {
  Root,
  Trigger,
  Portal,
  Close,
  Overlay,
  Content,
  Header,
  Footer,
  Title,
  Description,
};
