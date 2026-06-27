import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Label } from "#components/label";

afterEach(cleanup);

function queryBySlot(view: ReturnType<typeof render>, slot: string) {
  return view.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("Label", () => {
  test("renders a <label> tagged with its data-slot", () => {
    const view = render(<Label>Email</Label>);
    const el = queryBySlot(view, "label");
    expect(el?.tagName).toBe("LABEL");
    expect(el?.textContent).toBe("Email");
    expect(el?.className).toContain("font-medium");
  });

  test("merges user className over the base classes", () => {
    const view = render(<Label className="custom-label">x</Label>);
    const el = queryBySlot(view, "label");
    expect(el?.classList.contains("custom-label")).toBe(true);
    expect(el?.classList.contains("leading-none")).toBe(true);
  });

  test("renders polymorphically via the render prop", () => {
    const view = render(<Label render={<span />}>x</Label>);
    expect(queryBySlot(view, "label")?.tagName).toBe("SPAN");
  });
});
