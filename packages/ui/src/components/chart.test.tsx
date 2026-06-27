import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Chart } from "#components/chart";

afterEach(cleanup);

// recharts' ResponsiveContainer relies on ResizeObserver, absent in happy-dom.
const g = globalThis as { ResizeObserver?: unknown };
g.ResizeObserver ||= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("Chart", () => {
  test("Container tags its root with data-slot=chart and merges className", () => {
    const screen = render(
      <Chart.Container config={{ sales: { label: "Sales", color: "#f00" } }} className="custom">
        <div />
      </Chart.Container>,
    );
    const root = screen.baseElement.querySelector("[data-slot=chart]");
    expect(root).not.toBeNull();
    expect(root?.className).toContain("custom");
    expect(root?.getAttribute("data-chart")).toMatch(/^chart-/);
  });

  // Style is the non-recharts part: a pure <style> generator over the config.
  test("Style injects CSS color vars for configured series", () => {
    const screen = render(<Chart.Style id="chart-x" config={{ sales: { color: "#123456" } }} />);
    const style = screen.baseElement.querySelector("style");
    expect(style?.innerHTML).toContain("[data-chart=chart-x]");
    expect(style?.innerHTML).toContain("--color-sales: #123456");
  });

  test("Style renders nothing when no series carry a color/theme", () => {
    const screen = render(<Chart.Style id="chart-y" config={{ sales: { label: "Sales" } }} />);
    expect(screen.baseElement.querySelector("style")).toBeNull();
  });
});
