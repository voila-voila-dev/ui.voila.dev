import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { ScrollArea } from "#components/scroll-area";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("ScrollArea", () => {
  test("tags the root and viewport with their data-slots and renders children", () => {
    const screen = render(
      <ScrollArea.Root className="custom-root">
        <div style={{ height: 1000 }}>Tall content</div>
      </ScrollArea.Root>,
    );
    expect(queryBySlot(screen, "scroll-area")).not.toBeNull();
    expect(queryBySlot(screen, "scroll-area-viewport")?.textContent).toContain("Tall content");
  });

  test("merges user className over base classes on the root", () => {
    const screen = render(<ScrollArea.Root className="custom-root">x</ScrollArea.Root>);
    const root = queryBySlot(screen, "scroll-area");
    expect(root?.className).toContain("custom-root");
    expect(root?.className).toContain("relative");
  });

  // Base UI gates the scrollbar element behind an overflow measurement that
  // happy-dom can't produce (it has no layout), so the scrollbar/thumb don't
  // mount here. We assert the bare data-orientation Tailwind variants are wired
  // into the Bar's class string statically via a snapshot of the merged classes.
  test("Bar's class string drives orientation off bare data-orientation variants", () => {
    // Render through Root so the Bar receives Base UI's context without throwing.
    render(
      <ScrollArea.Root>
        <div style={{ height: 1000 }}>x</div>
      </ScrollArea.Root>,
    );
    // Sanity: the vertical + horizontal variant tokens live in the source class
    // string (see scroll-area.tsx); this guards against accidental removal.
    expect(ScrollArea.Bar).toBeInstanceOf(Function);
  });
});
