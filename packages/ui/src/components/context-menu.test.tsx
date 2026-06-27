import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { ContextMenu } from "#components/context-menu";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot="${slot}"]`);
}

describe("ContextMenu", () => {
  test("portals content + items tagged with data-slots when open", () => {
    const screen = render(
      <ContextMenu.Root open>
        <ContextMenu.Trigger>Right click</ContextMenu.Trigger>
        <ContextMenu.Content className="custom-content">
          <ContextMenu.Label>Section</ContextMenu.Label>
          <ContextMenu.Item>Copy</ContextMenu.Item>
          <ContextMenu.Separator />
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    const content = queryBySlot(screen, "context-menu-content");
    expect(content).not.toBeNull();
    expect(content?.className).toContain("custom-content");
    expect(content?.className).toContain("bg-popover");
    expect(queryBySlot(screen, "context-menu-item")?.textContent).toContain("Copy");
    expect(queryBySlot(screen, "context-menu-label")?.textContent).toBe("Section");
    expect(queryBySlot(screen, "context-menu-separator")).not.toBeNull();
  });

  test("renders the trigger with its data-slot", () => {
    const screen = render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
      </ContextMenu.Root>,
    );
    expect(queryBySlot(screen, "context-menu-trigger")?.textContent).toBe("Area");
  });
});
