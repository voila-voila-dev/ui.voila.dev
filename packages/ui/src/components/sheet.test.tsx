import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Sheet } from "#components/sheet";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("Sheet", () => {
  test("renders portaled content with the side variant and a close button", () => {
    const screen = render(
      <Sheet.Root open>
        <Sheet.Content side="left" className="custom-sheet">
          <Sheet.Header>
            <Sheet.Title>Filters</Sheet.Title>
            <Sheet.Description>Refine the list</Sheet.Description>
          </Sheet.Header>
        </Sheet.Content>
      </Sheet.Root>,
    );
    const content = queryBySlot(screen, "sheet-content");
    expect(content?.getAttribute("data-side")).toBe("left");
    // Left-anchored variant classes flow from sheetVariants.
    expect(content?.className).toContain("left-0");
    expect(content?.className).toContain("custom-sheet");
    expect(queryBySlot(screen, "sheet-title")?.textContent).toBe("Filters");
    expect(queryBySlot(screen, "sheet-description")?.textContent).toBe("Refine the list");
    expect(queryBySlot(screen, "sheet-close-button")).not.toBeNull();
  });

  test("defaults to the right side", () => {
    const screen = render(
      <Sheet.Root open>
        <Sheet.Content>
          <Sheet.Title>Default</Sheet.Title>
        </Sheet.Content>
      </Sheet.Root>,
    );
    const content = queryBySlot(screen, "sheet-content");
    expect(content?.getAttribute("data-side")).toBe("right");
    expect(content?.className).toContain("right-0");
  });
});
