import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { Button } from "#components/button";

afterEach(cleanup);

describe("Button", () => {
  test("renders its children as a <button>", () => {
    render(<Button>Save</Button>);
    const el = screen.getByRole("button", { name: "Save" });
    expect(el.tagName).toBe("BUTTON");
    expect(el.getAttribute("type")).toBe("button");
  });

  test("tags the default variant and size as data attributes", () => {
    render(<Button>Save</Button>);
    const el = screen.getByRole("button", { name: "Save" });
    expect(el.getAttribute("data-slot")).toBe("button");
    expect(el.getAttribute("data-variant")).toBe("default");
    expect(el.getAttribute("data-size")).toBe("default");
  });

  test("exposes the chosen variant and size as data attributes", () => {
    render(
      <Button variant="outline" size="sm">
        x
      </Button>,
    );
    const el = screen.getByRole("button", { name: "x" });
    expect(el.getAttribute("data-variant")).toBe("outline");
    expect(el.getAttribute("data-size")).toBe("sm");
  });

  test("applies the destructive variant classes", () => {
    render(<Button variant="destructive">Delete</Button>);
    const el = screen.getByRole("button", { name: "Delete" });
    expect(el.className).toContain("bg-destructive");
  });

  test("merges user className with variant classes", () => {
    render(<Button className="custom-x">x</Button>);
    const el = screen.getByRole("button", { name: "x" });
    expect(el.className).toContain("custom-x");
    expect(el.className).toContain("inline-flex");
  });
});
