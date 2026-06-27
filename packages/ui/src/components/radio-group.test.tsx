import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { RadioGroup } from "#components/radio-group";

afterEach(cleanup);

describe("RadioGroup", () => {
  test("renders a radiogroup with items, tagged with data-slots", () => {
    render(
      <RadioGroup.Root defaultValue="a" aria-label="options">
        <RadioGroup.Item value="a" className="custom-item" />
        <RadioGroup.Item value="b" />
      </RadioGroup.Root>,
    );

    const group = screen.getByRole("radiogroup", { name: "options" });
    expect(group.getAttribute("data-slot")).toBe("radio-group");

    const items = screen.getAllByRole("radio");
    expect(items).toHaveLength(2);
    expect(items[0]?.getAttribute("data-slot")).toBe("radio-group-item");
    expect(items[0]?.className).toContain("custom-item");
    expect(items[0]?.className).toContain("rounded-full");
  });
});
