import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { DropdownMenu } from "#components/dropdown-menu";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot="${slot}"]`);
}

describe("DropdownMenu", () => {
  test("portals content + items tagged with data-slots when open", () => {
    const screen = render(
      <DropdownMenu.Root open>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content className="custom-content">
          <DropdownMenu.Label>Section</DropdownMenu.Label>
          <DropdownMenu.Item>Edit</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item inset>Inset row</DropdownMenu.Item>
          <DropdownMenu.Shortcut>⌘E</DropdownMenu.Shortcut>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );

    const content = queryBySlot(screen, "dropdown-menu-content");
    expect(content).not.toBeNull();
    // className merges onto the popup.
    expect(content?.className).toContain("custom-content");
    expect(content?.className).toContain("bg-popover");
    expect(queryBySlot(screen, "dropdown-menu-item")?.textContent).toContain("Edit");
    expect(queryBySlot(screen, "dropdown-menu-label")?.textContent).toBe("Section");
    expect(queryBySlot(screen, "dropdown-menu-separator")).not.toBeNull();
  });

  test("renders the trigger with its data-slot", () => {
    const screen = render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
      </DropdownMenu.Root>,
    );
    expect(queryBySlot(screen, "dropdown-menu-trigger")?.textContent).toBe("Menu");
  });
});
