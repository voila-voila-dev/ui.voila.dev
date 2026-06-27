import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { AspectRatio } from "#components/aspect-ratio";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot=${slot}]`) as HTMLElement | null;
}

describe("AspectRatio", () => {
  test("tags the part with its data-slot and applies the ratio style", () => {
    const screen = render(<AspectRatio ratio={16 / 9} />);
    const el = queryBySlot(screen, "aspect-ratio");
    expect(el?.tagName).toBe("DIV");
    expect(el?.style.aspectRatio).toBe(`${16 / 9} / 1`);
  });

  test("merges user className over the base classes", () => {
    const screen = render(<AspectRatio className="custom-ratio" />);
    const el = queryBySlot(screen, "aspect-ratio");
    expect(el?.classList.contains("custom-ratio")).toBe(true);
    expect(el?.classList.contains("relative")).toBe(true);
  });

  test("renders polymorphically via the render prop", () => {
    const screen = render(<AspectRatio render={<section />} />);
    expect(queryBySlot(screen, "aspect-ratio")?.tagName).toBe("SECTION");
  });
});
