import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Avatar } from "#components/avatar";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("Avatar", () => {
  test("tags the root and fallback parts with their data-slot", () => {
    const screen = render(
      <Avatar.Root>
        <Avatar.Fallback>AB</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(queryBySlot(screen, "avatar")).not.toBeNull();
    expect(queryBySlot(screen, "avatar-fallback")?.textContent).toBe("AB");
  });

  test("merges user className over the base classes", () => {
    const screen = render(<Avatar.Root className="custom-avatar" />);
    const root = queryBySlot(screen, "avatar");
    expect(root?.classList.contains("custom-avatar")).toBe(true);
    expect(root?.classList.contains("rounded-full")).toBe(true);
  });
});
