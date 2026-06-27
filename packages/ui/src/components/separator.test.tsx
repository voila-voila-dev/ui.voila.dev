import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Separator } from "#components/separator";

afterEach(cleanup);

function queryBySlot(view: ReturnType<typeof render>, slot: string) {
  return view.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("Separator", () => {
  test("renders tagged with its data-slot, horizontal by default", () => {
    const view = render(<Separator />);
    const el = queryBySlot(view, "separator");
    expect(el?.getAttribute("data-orientation")).toBe("horizontal");
    expect(el?.className).toContain("bg-border");
  });

  test("reflects the vertical orientation", () => {
    const view = render(<Separator orientation="vertical" />);
    const el = queryBySlot(view, "separator");
    expect(el?.getAttribute("data-orientation")).toBe("vertical");
  });

  test("merges user className over the base classes", () => {
    const view = render(<Separator className="custom-separator" />);
    const el = queryBySlot(view, "separator");
    expect(el?.classList.contains("custom-separator")).toBe(true);
    expect(el?.classList.contains("shrink-0")).toBe(true);
  });
});
