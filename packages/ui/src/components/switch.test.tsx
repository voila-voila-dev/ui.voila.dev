import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { Switch } from "#components/switch";

afterEach(cleanup);

describe("Switch", () => {
  test("renders a switch role tagged with its data-slot", () => {
    render(<Switch aria-label="notifications" />);
    const el = screen.getByRole("switch", { name: "notifications" });
    expect(el.getAttribute("data-slot")).toBe("switch");
  });

  test("renders the thumb part with its data-slot", () => {
    const view = render(<Switch aria-label="x" />);
    expect(view.baseElement.querySelector("[data-slot=switch-thumb]")).not.toBeNull();
  });

  test("merges user className over the base classes", () => {
    render(<Switch aria-label="y" className="custom-switch" />);
    const el = screen.getByRole("switch", { name: "y" });
    expect(el.className).toContain("custom-switch");
    expect(el.className).toContain("rounded-full");
  });
});
