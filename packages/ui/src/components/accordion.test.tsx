import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Accordion } from "#components/accordion";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("Accordion", () => {
  test("tags item, trigger and content with data-slots and renders an open panel", () => {
    const screen = render(
      <Accordion.Root defaultValue={["one"]}>
        <Accordion.Item value="one" className="custom-item">
          <Accordion.Trigger className="custom-trigger">Section one</Accordion.Trigger>
          <Accordion.Content className="custom-content">Panel body</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    expect(queryBySlot(screen, "accordion")).not.toBeNull();
    expect(queryBySlot(screen, "accordion-item")?.className).toContain("custom-item");
    const trigger = queryBySlot(screen, "accordion-trigger");
    expect(trigger?.textContent).toContain("Section one");
    expect(trigger?.className).toContain("custom-trigger");
    const content = queryBySlot(screen, "accordion-content");
    expect(content?.className).toContain("h-(--accordion-panel-height)");
    // The custom className lands on the inner padding wrapper.
    expect(content?.querySelector(".custom-content")?.textContent).toBe("Panel body");
  });
});
