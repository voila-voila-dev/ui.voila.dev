import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { ToggleGroup } from "#components/toggle-group";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("ToggleGroup", () => {
  test("tags the group root with its data-slot", () => {
    const screen = render(
      <ToggleGroup.Root>
        <ToggleGroup.Item value="a" aria-label="a">
          a
        </ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    expect(queryBySlot(screen, "toggle-group")).not.toBeNull();
  });

  test("propagates variant/size from the group context to items", () => {
    const screen = render(
      <ToggleGroup.Root variant="outline" size="sm">
        <ToggleGroup.Item value="a" aria-label="a">
          a
        </ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    const item = queryBySlot(screen, "toggle-group-item");
    expect(item?.getAttribute("data-variant")).toBe("outline");
    expect(item?.getAttribute("data-size")).toBe("sm");
  });

  test("merges user className over the base classes on the root", () => {
    const screen = render(<ToggleGroup.Root className="custom-group" />);
    const root = queryBySlot(screen, "toggle-group");
    expect(root?.classList.contains("custom-group")).toBe(true);
    expect(root?.classList.contains("flex")).toBe(true);
  });
});
