import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Input } from "#components/input";

afterEach(cleanup);

function queryBySlot(view: ReturnType<typeof render>, slot: string) {
  return view.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("Input", () => {
  test("renders an <input> tagged with its data-slot", () => {
    const view = render(<Input />);
    const el = queryBySlot(view, "input");
    expect(el?.tagName).toBe("INPUT");
    expect(el?.className).toContain("rounded-md");
  });

  test("merges user className over the base classes", () => {
    const view = render(<Input className="custom-input" />);
    const el = queryBySlot(view, "input");
    expect(el?.classList.contains("custom-input")).toBe(true);
    expect(el?.classList.contains("border-input")).toBe(true);
  });

  test("forwards native props", () => {
    const view = render(<Input type="email" placeholder="you@example.com" />);
    const el = queryBySlot(view, "input");
    expect(el?.getAttribute("type")).toBe("email");
    expect(el?.getAttribute("placeholder")).toBe("you@example.com");
  });
});
