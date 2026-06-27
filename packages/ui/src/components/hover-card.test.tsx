import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { HoverCard } from "#components/hover-card";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot="${slot}"]`);
}

describe("HoverCard", () => {
  test("portals content tagged with data-slot when open", () => {
    const screen = render(
      <HoverCard.Root open>
        <HoverCard.Trigger>Hover</HoverCard.Trigger>
        <HoverCard.Content className="custom-content">Preview</HoverCard.Content>
      </HoverCard.Root>,
    );

    const content = queryBySlot(screen, "hover-card-content");
    expect(content).not.toBeNull();
    expect(content?.textContent).toContain("Preview");
    expect(content?.className).toContain("custom-content");
    expect(content?.className).toContain("w-64");
  });

  test("renders the trigger with its data-slot", () => {
    const screen = render(
      <HoverCard.Root>
        <HoverCard.Trigger>Hover</HoverCard.Trigger>
      </HoverCard.Root>,
    );
    expect(queryBySlot(screen, "hover-card-trigger")?.textContent).toBe("Hover");
  });
});
