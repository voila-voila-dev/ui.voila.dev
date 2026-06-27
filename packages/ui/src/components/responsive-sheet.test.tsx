import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { ResponsiveSheet } from "#components/responsive-sheet";

afterEach(cleanup);

describe("ResponsiveSheet", () => {
  test("renders the desktop Sheet content (with its data-slots) when open", () => {
    // happy-dom reports a desktop viewport, so the Sheet branch is taken and the
    // underlying Sheet primitives supply the structural data-slots.
    const screen = render(
      <ResponsiveSheet.Root open>
        <ResponsiveSheet.Content className="custom-content">
          <ResponsiveSheet.Header>
            <ResponsiveSheet.Title>Edit</ResponsiveSheet.Title>
            <ResponsiveSheet.Description>Change the record</ResponsiveSheet.Description>
          </ResponsiveSheet.Header>
        </ResponsiveSheet.Content>
      </ResponsiveSheet.Root>,
    );
    const content = screen.baseElement.querySelector("[data-slot=sheet-content]");
    expect(content).not.toBeNull();
    expect(content?.className).toContain("custom-content");
    expect(screen.baseElement.querySelector("[data-slot=sheet-title]")?.textContent).toBe("Edit");
    expect(screen.baseElement.querySelector("[data-slot=sheet-description]")?.textContent).toBe(
      "Change the record",
    );
  });
});
