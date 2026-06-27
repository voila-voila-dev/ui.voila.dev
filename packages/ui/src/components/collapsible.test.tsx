import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Collapsible } from "#components/collapsible";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("Collapsible", () => {
  test("tags root, trigger and content with data-slots and merges classNames", () => {
    const screen = render(
      <Collapsible.Root defaultOpen className="custom-root">
        <Collapsible.Trigger className="custom-trigger">Toggle</Collapsible.Trigger>
        <Collapsible.Content className="custom-content">Body</Collapsible.Content>
      </Collapsible.Root>,
    );
    expect(queryBySlot(screen, "collapsible")?.className).toContain("custom-root");
    expect(queryBySlot(screen, "collapsible-trigger")?.textContent).toBe("Toggle");
    expect(queryBySlot(screen, "collapsible-trigger")?.className).toContain("custom-trigger");
    const content = queryBySlot(screen, "collapsible-content");
    expect(content?.textContent).toContain("Body");
    expect(content?.className).toContain("custom-content");
    expect(content?.className).toContain("h-(--collapsible-panel-height)");
  });
});
