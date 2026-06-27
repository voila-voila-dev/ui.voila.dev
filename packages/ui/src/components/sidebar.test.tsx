import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import type * as React from "react";
import { Sidebar } from "#components/sidebar";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot="${slot}"]`);
}

function renderSidebar(children: React.ReactNode) {
  return render(
    <Sidebar.Provider>
      <Sidebar.Root>{children}</Sidebar.Root>
      <Sidebar.Inset>main</Sidebar.Inset>
    </Sidebar.Provider>,
  );
}

describe("Sidebar", () => {
  test("renders the provider, root and key parts tagged with data-slots", () => {
    const screen = renderSidebar(
      <>
        <Sidebar.Header>Header</Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group.Root>
            <Sidebar.Group.Label>Group</Sidebar.Group.Label>
            <Sidebar.Group.Content>
              <Sidebar.Menu.Root>
                <Sidebar.Menu.Item>
                  <Sidebar.Menu.Button>Item</Sidebar.Menu.Button>
                </Sidebar.Menu.Item>
              </Sidebar.Menu.Root>
            </Sidebar.Group.Content>
          </Sidebar.Group.Root>
        </Sidebar.Content>
        <Sidebar.Footer>Footer</Sidebar.Footer>
      </>,
    );
    expect(queryBySlot(screen, "sidebar-wrapper")).not.toBeNull();
    expect(queryBySlot(screen, "sidebar")).not.toBeNull();
    expect(queryBySlot(screen, "sidebar-inset")?.textContent).toContain("main");
    expect(queryBySlot(screen, "sidebar-header")?.textContent).toBe("Header");
    expect(queryBySlot(screen, "sidebar-footer")?.textContent).toBe("Footer");
    expect(queryBySlot(screen, "sidebar-group")).not.toBeNull();
    expect(queryBySlot(screen, "sidebar-group-label")?.textContent).toBe("Group");
    expect(queryBySlot(screen, "sidebar-menu")?.tagName).toBe("UL");
    expect(queryBySlot(screen, "sidebar-menu-item")?.tagName).toBe("LI");
    const button = queryBySlot(screen, "sidebar-menu-button");
    expect(button?.tagName).toBe("BUTTON");
    expect(button?.getAttribute("data-sidebar")).toBe("menu-button");
  });

  test("menu button reflects active state and merges className", () => {
    const screen = renderSidebar(
      <Sidebar.Menu.Root>
        <Sidebar.Menu.Item>
          <Sidebar.Menu.Button isActive className="custom-btn">
            Active
          </Sidebar.Menu.Button>
        </Sidebar.Menu.Item>
      </Sidebar.Menu.Root>,
    );
    const button = queryBySlot(screen, "sidebar-menu-button");
    expect(button?.getAttribute("data-active")).toBe("true");
    expect(button?.classList.contains("custom-btn")).toBe(true);
    expect(button?.classList.contains("peer/menu-button")).toBe(true);
  });

  test("menu button renders polymorphically via the render prop", () => {
    const screen = renderSidebar(
      <Sidebar.Menu.Root>
        <Sidebar.Menu.Item>
          <Sidebar.Menu.Button render={<a href="/x">Link</a>} />
        </Sidebar.Menu.Item>
      </Sidebar.Menu.Root>,
    );
    expect(queryBySlot(screen, "sidebar-menu-button")?.tagName).toBe("A");
  });

  test("useSidebar throws outside of a provider", () => {
    expect(() => render(<Sidebar.Trigger />)).toThrow(
      "useSidebar must be used within a SidebarProvider.",
    );
  });
});
