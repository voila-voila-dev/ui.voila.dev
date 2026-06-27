import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Resizable } from "#components/resizable";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

function renderResizable(withHandle?: boolean) {
  return render(
    <Resizable.PanelGroup direction="horizontal" className="custom-group">
      <Resizable.Panel defaultSize={50} className="custom-panel">
        One
      </Resizable.Panel>
      <Resizable.Handle withHandle={withHandle} className="custom-handle" />
      <Resizable.Panel defaultSize={50}>Two</Resizable.Panel>
    </Resizable.PanelGroup>,
  );
}

describe("Resizable", () => {
  test("tags every part with its data-slot", () => {
    const screen = renderResizable();
    expect(queryBySlot(screen, "resizable-panel-group")).not.toBeNull();
    expect(queryBySlot(screen, "resizable-panel")).not.toBeNull();
    expect(queryBySlot(screen, "resizable-handle")).not.toBeNull();
  });

  test("merges user className over base classes", () => {
    const screen = renderResizable();
    expect(queryBySlot(screen, "resizable-panel-group")?.className).toContain("custom-group");
    expect(queryBySlot(screen, "resizable-panel-group")?.className).toContain("flex");
    expect(queryBySlot(screen, "resizable-handle")?.className).toContain("custom-handle");
  });

  test("renders the grip only when withHandle is set", () => {
    expect(queryBySlot(renderResizable(false), "resizable-handle-grip")).toBeNull();
    cleanup();
    expect(queryBySlot(renderResizable(true), "resizable-handle-grip")).not.toBeNull();
  });
});
