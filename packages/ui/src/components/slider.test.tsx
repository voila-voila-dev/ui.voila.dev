import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { Slider } from "#components/slider";

afterEach(cleanup);

describe("Slider", () => {
  test("renders a slider thumb and merges className on the root", () => {
    const { container } = render(
      <Slider defaultValue={50} min={0} max={100} aria-label="volume" className="custom-slider" />,
    );

    const root = container.querySelector("[data-slot=slider]");
    expect(root).not.toBeNull();
    expect(root?.className).toContain("custom-slider");
    expect(root?.className).toContain("touch-none");

    expect(screen.getByRole("slider")).not.toBeNull();
  });
});
