import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Badge } from "#components/badge";

afterEach(cleanup);

function queryBySlot(view: ReturnType<typeof render>, slot: string) {
  return view.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("Badge", () => {
  test("renders a <div> tagged with its data-slot and default data-variant", () => {
    const view = render(<Badge>new</Badge>);
    const el = queryBySlot(view, "badge");
    expect(el?.tagName).toBe("DIV");
    expect(el?.getAttribute("data-variant")).toBe("default");
    expect(el?.className).toContain("bg-primary");
  });

  test("reflects the variant on data-variant and the classes", () => {
    const view = render(<Badge variant="outline">draft</Badge>);
    const el = queryBySlot(view, "badge");
    expect(el?.getAttribute("data-variant")).toBe("outline");
    expect(el?.className).toContain("text-foreground");
  });

  test("merges user className over the base classes", () => {
    const view = render(<Badge className="custom-badge">x</Badge>);
    const el = queryBySlot(view, "badge");
    expect(el?.classList.contains("custom-badge")).toBe(true);
    expect(el?.classList.contains("inline-flex")).toBe(true);
  });

  test("renders polymorphically via the render prop", () => {
    const view = render(<Badge render={<span />}>x</Badge>);
    expect(queryBySlot(view, "badge")?.tagName).toBe("SPAN");
  });
});
