import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { Toggle, toggleVariantOptions } from "#components/toggle";

afterEach(cleanup);

describe("Toggle", () => {
  test("renders as a toggle and tags the default variant/size", () => {
    render(<Toggle aria-label="bold">B</Toggle>);
    const el = screen.getByRole("button", { name: "bold" });
    expect(el.getAttribute("data-slot")).toBe("toggle");
    expect(el.getAttribute("data-variant")).toBe("default");
    expect(el.getAttribute("data-size")).toBe("default");
  });

  test("exposes the chosen variant and size as data attributes", () => {
    render(
      <Toggle aria-label="x" variant="outline" size="sm">
        x
      </Toggle>,
    );
    const el = screen.getByRole("button", { name: "x" });
    expect(el.getAttribute("data-variant")).toBe("outline");
    expect(el.getAttribute("data-size")).toBe("sm");
    expect(el.className).toContain("border-input");
  });

  test("merges user className with variant classes", () => {
    render(
      <Toggle aria-label="y" className="custom-toggle">
        y
      </Toggle>,
    );
    const el = screen.getByRole("button", { name: "y" });
    expect(el.className).toContain("custom-toggle");
    expect(el.className).toContain("inline-flex");
  });

  test("exposes the canonical variant options", () => {
    expect(toggleVariantOptions).toEqual(["default", "outline"]);
  });
});
