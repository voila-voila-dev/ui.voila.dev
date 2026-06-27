import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Drawer } from "#components/drawer";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("Drawer", () => {
  test("renders portaled content, grab handle, title and description when open", () => {
    const screen = render(
      <Drawer.Root defaultOpen>
        <Drawer.Content className="custom-drawer">
          <Drawer.Header>
            <Drawer.Title>Quick actions</Drawer.Title>
            <Drawer.Description>Pick one</Drawer.Description>
          </Drawer.Header>
        </Drawer.Content>
      </Drawer.Root>,
    );
    const content = queryBySlot(screen, "drawer-content");
    expect(content?.className).toContain("custom-drawer");
    expect(content?.className).toContain("rounded-t-[10px]");
    expect(queryBySlot(screen, "drawer-handle")).not.toBeNull();
    expect(queryBySlot(screen, "drawer-title")?.textContent).toBe("Quick actions");
    expect(queryBySlot(screen, "drawer-description")?.textContent).toBe("Pick one");
  });

  test("does not render content while closed", () => {
    const screen = render(
      <Drawer.Root>
        <Drawer.Content>
          <Drawer.Title>Hidden</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );
    expect(queryBySlot(screen, "drawer-content")).toBeNull();
  });
});
