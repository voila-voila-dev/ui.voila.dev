import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Menubar } from "#components/menubar";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot="${slot}"]`);
}

describe("Menubar", () => {
  test("renders the bar + trigger with data-slots", () => {
    const screen = render(
      <Menubar.Root>
        <Menubar.Menu>
          <Menubar.Trigger>File</Menubar.Trigger>
        </Menubar.Menu>
      </Menubar.Root>,
    );
    expect(queryBySlot(screen, "menubar")?.className).toContain("rounded-md");
    expect(queryBySlot(screen, "menubar-trigger")?.textContent).toBe("File");
  });

  test("portals content + items tagged with data-slots when open", () => {
    const screen = render(
      <Menubar.Root>
        <Menubar.Menu open>
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Content className="custom-content">
            <Menubar.Item>New</Menubar.Item>
            <Menubar.Separator />
            <Menubar.Shortcut>⌘N</Menubar.Shortcut>
          </Menubar.Content>
        </Menubar.Menu>
      </Menubar.Root>,
    );

    const content = queryBySlot(screen, "menubar-content");
    expect(content).not.toBeNull();
    expect(content?.className).toContain("custom-content");
    expect(content?.className).toContain("min-w-[12rem]");
    expect(queryBySlot(screen, "menubar-item")?.textContent).toContain("New");
    expect(queryBySlot(screen, "menubar-separator")).not.toBeNull();
  });
});
