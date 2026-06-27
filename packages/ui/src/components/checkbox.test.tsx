import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { Checkbox } from "#components/checkbox";

afterEach(cleanup);

describe("Checkbox", () => {
  test("renders a checkbox role tagged with its data-slot", () => {
    render(<Checkbox aria-label="agree" />);
    const el = screen.getByRole("checkbox", { name: "agree" });
    expect(el.getAttribute("data-slot")).toBe("checkbox");
  });

  test("merges user className over the base classes", () => {
    render(<Checkbox aria-label="x" className="custom-checkbox" />);
    const el = screen.getByRole("checkbox", { name: "x" });
    expect(el.className).toContain("custom-checkbox");
    expect(el.className).toContain("rounded-sm");
  });
});
