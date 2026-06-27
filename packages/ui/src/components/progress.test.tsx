import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Progress } from "#components/progress";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("Progress", () => {
  test("renders root, track and indicator parts with their data-slot", () => {
    const screen = render(<Progress value={50} />);
    expect(queryBySlot(screen, "progress")).not.toBeNull();
    expect(queryBySlot(screen, "progress-track")).not.toBeNull();
    expect(queryBySlot(screen, "progress-indicator")).not.toBeNull();
  });

  test("merges user className over the base classes", () => {
    const screen = render(<Progress value={50} className="custom-progress" />);
    const root = queryBySlot(screen, "progress");
    expect(root?.classList.contains("custom-progress")).toBe(true);
    expect(root?.classList.contains("relative")).toBe(true);
  });
});
