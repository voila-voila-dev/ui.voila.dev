import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Textarea } from "#components/textarea";

afterEach(cleanup);

function queryBySlot(view: ReturnType<typeof render>, slot: string) {
  return view.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("Textarea", () => {
  test("renders a <textarea> tagged with its data-slot", () => {
    const view = render(<Textarea />);
    const el = queryBySlot(view, "textarea");
    expect(el?.tagName).toBe("TEXTAREA");
    expect(el?.className).toContain("rounded-md");
  });

  test("merges user className over the base classes", () => {
    const view = render(<Textarea className="custom-textarea" />);
    const el = queryBySlot(view, "textarea");
    expect(el?.classList.contains("custom-textarea")).toBe(true);
    expect(el?.classList.contains("border-input")).toBe(true);
  });
});
