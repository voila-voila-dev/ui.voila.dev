import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Command } from "#components/command";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

function renderCommand() {
  return render(
    <Command.Root className="custom-root">
      <Command.Input className="custom-input" placeholder="Search" />
      <Command.List className="custom-list">
        <Command.Empty>No results</Command.Empty>
        <Command.Group className="custom-group" heading="Suggestions">
          <Command.Item className="custom-item">
            Calendar
            <Command.Shortcut className="custom-shortcut">⌘C</Command.Shortcut>
          </Command.Item>
        </Command.Group>
        <Command.Separator className="custom-sep" />
      </Command.List>
    </Command.Root>,
  );
}

describe("Command", () => {
  test("tags every part with its data-slot", () => {
    const screen = renderCommand();
    expect(queryBySlot(screen, "command")).not.toBeNull();
    expect(queryBySlot(screen, "command-input-wrapper")).not.toBeNull();
    expect(queryBySlot(screen, "command-input")).not.toBeNull();
    expect(queryBySlot(screen, "command-list")).not.toBeNull();
    expect(queryBySlot(screen, "command-group")).not.toBeNull();
    expect(queryBySlot(screen, "command-item")?.textContent).toContain("Calendar");
    expect(queryBySlot(screen, "command-shortcut")?.textContent).toBe("⌘C");
    expect(queryBySlot(screen, "command-separator")).not.toBeNull();
  });

  test("merges user className over base classes", () => {
    const screen = renderCommand();
    expect(queryBySlot(screen, "command")?.className).toContain("custom-root");
    expect(queryBySlot(screen, "command")?.className).toContain("bg-popover");
    expect(queryBySlot(screen, "command-list")?.className).toContain("custom-list");
    expect(queryBySlot(screen, "command-item")?.className).toContain("custom-item");
  });
});
