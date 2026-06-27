import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { Tabs } from "#components/tabs";

afterEach(cleanup);

function renderTabs() {
  return render(
    <Tabs.Root defaultValue="account">
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="password">Password</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">Account panel</Tabs.Content>
      <Tabs.Content value="password">Password panel</Tabs.Content>
    </Tabs.Root>,
  );
}

describe("Tabs", () => {
  test("tags every part with its data-slot and merges classNames", () => {
    const view = render(
      <Tabs.Root defaultValue="account" className="custom-root">
        <Tabs.List className="custom-list">
          <Tabs.Trigger value="account" className="custom-trigger">
            Account
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="account" className="custom-content">
          Account panel
        </Tabs.Content>
      </Tabs.Root>,
    );
    expect(view.baseElement.querySelector("[data-slot=tabs]")?.className).toContain("custom-root");
    expect(view.baseElement.querySelector("[data-slot=tabs-list]")?.className).toContain(
      "custom-list",
    );
    expect(view.baseElement.querySelector("[data-slot=tabs-trigger]")?.className).toContain(
      "custom-trigger",
    );
    expect(view.baseElement.querySelector("[data-slot=tabs-content]")?.className).toContain(
      "custom-content",
    );
  });

  test("marks only the selected trigger as active", () => {
    renderTabs();
    const account = screen.getByRole("tab", { name: "Account" });
    const password = screen.getByRole("tab", { name: "Password" });

    // Base UI flags the selected tab with `data-active` + aria-selected — the
    // hook the active-state styling targets.
    expect(account.hasAttribute("data-active")).toBe(true);
    expect(account.getAttribute("aria-selected")).toBe("true");
    expect(password.hasAttribute("data-active")).toBe(false);
    expect(password.getAttribute("aria-selected")).toBe("false");
  });

  test("styles the active tab via the data-[active] hook, not data-[selected]", () => {
    // Regression: Base UI (rc) emits `data-active`, NOT `data-selected`, so a
    // `data-[selected]:` variant never matches and the current tab looks
    // identical to the others.
    renderTabs();
    const account = screen.getByRole("tab", { name: "Account" });
    expect(account.className).toContain("data-[active]:bg-background");
    expect(account.className).not.toContain("data-[selected]:");
  });
});
