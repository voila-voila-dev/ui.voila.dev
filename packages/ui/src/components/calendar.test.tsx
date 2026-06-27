import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Calendar } from "#components/calendar";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("Calendar", () => {
  test("tags the root with its data-slot and merges className", () => {
    const screen = render(<Calendar.Root className="custom-calendar" />);
    const root = queryBySlot(screen, "calendar");
    expect(root).not.toBeNull();
    expect(root?.className).toContain("custom-calendar");
    expect(root?.className).toContain("p-3");
  });

  test("renders day-picker month grid", () => {
    const screen = render(<Calendar.Root />);
    expect(queryBySlot(screen, "calendar")?.querySelector("table")).not.toBeNull();
  });
});
