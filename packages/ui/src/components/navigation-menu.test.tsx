import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { NavigationMenu, navigationMenuTriggerStyle } from "#components/navigation-menu";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot="${slot}"]`);
}

describe("NavigationMenu", () => {
  test("renders root, list, item, trigger and link tagged with data-slots", () => {
    const screen = render(
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Menu</NavigationMenu.Trigger>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="/">Home</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>,
    );
    expect(queryBySlot(screen, "navigation-menu")?.tagName).toBe("NAV");
    expect(queryBySlot(screen, "navigation-menu-list")?.tagName).toBe("UL");
    expect(queryBySlot(screen, "navigation-menu-item")).not.toBeNull();
    expect(queryBySlot(screen, "navigation-menu-trigger")?.textContent).toContain("Menu");
    expect(queryBySlot(screen, "navigation-menu-link")?.textContent).toBe("Home");
  });

  test("merges user className over the root base classes", () => {
    const screen = render(<NavigationMenu.Root className="custom-nav">x</NavigationMenu.Root>);
    const root = queryBySlot(screen, "navigation-menu");
    expect(root?.classList.contains("custom-nav")).toBe(true);
    expect(root?.classList.contains("relative")).toBe(true);
  });

  test("navigationMenuTriggerStyle returns the shared trigger classes", () => {
    expect(navigationMenuTriggerStyle()).toContain("inline-flex");
    expect(navigationMenuTriggerStyle()).toContain("data-popup-open:bg-accent/50");
  });
});
