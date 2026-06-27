import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Popover } from "#components/popover";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot="${slot}"]`);
}

describe("Popover", () => {
  test("portals content tagged with data-slot when open", () => {
    const screen = render(
      <Popover.Root open>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content className="custom-content">Body</Popover.Content>
      </Popover.Root>,
    );

    const content = queryBySlot(screen, "popover-content");
    expect(content).not.toBeNull();
    expect(content?.textContent).toContain("Body");
    expect(content?.className).toContain("custom-content");
    expect(content?.className).toContain("bg-popover");
  });

  test("does not render content while closed", () => {
    const screen = render(
      <Popover.Root>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>Body</Popover.Content>
      </Popover.Root>,
    );
    expect(queryBySlot(screen, "popover-content")).toBeNull();
    expect(queryBySlot(screen, "popover-trigger")?.textContent).toBe("Open");
  });
});
