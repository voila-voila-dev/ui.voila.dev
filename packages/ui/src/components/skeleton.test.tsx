import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Skeleton } from "#components/skeleton";

afterEach(cleanup);

function queryBySlot(view: ReturnType<typeof render>, slot: string) {
  return view.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("Skeleton", () => {
  test("renders a <div> tagged with its data-slot", () => {
    const view = render(<Skeleton />);
    const el = queryBySlot(view, "skeleton");
    expect(el?.tagName).toBe("DIV");
    expect(el?.className).toContain("animate-pulse");
  });

  test("merges user className over the base classes", () => {
    const view = render(<Skeleton className="h-8 w-8" />);
    const el = queryBySlot(view, "skeleton");
    expect(el?.classList.contains("h-8")).toBe(true);
    expect(el?.classList.contains("rounded-md")).toBe(true);
  });

  test("renders polymorphically via the render prop", () => {
    const view = render(<Skeleton render={<span />} />);
    expect(queryBySlot(view, "skeleton")?.tagName).toBe("SPAN");
  });
});
