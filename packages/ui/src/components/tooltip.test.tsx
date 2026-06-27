import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Tooltip } from "#components/tooltip";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot="${slot}"]`);
}

describe("Tooltip", () => {
  test("portals content tagged with data-slot when open", () => {
    const screen = render(
      <Tooltip.Provider>
        <Tooltip.Root open>
          <Tooltip.Trigger>Hover</Tooltip.Trigger>
          <Tooltip.Content className="custom-content">Hint</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    const content = queryBySlot(screen, "tooltip-content");
    expect(content).not.toBeNull();
    expect(content?.textContent).toContain("Hint");
    expect(content?.className).toContain("custom-content");
    expect(content?.className).toContain("bg-primary");
  });

  test("renders the trigger with its data-slot", () => {
    const screen = render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>Hover</Tooltip.Trigger>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );
    expect(queryBySlot(screen, "tooltip-trigger")?.textContent).toBe("Hover");
  });
});
