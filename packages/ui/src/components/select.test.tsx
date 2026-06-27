import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Select } from "#components/select";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot="${slot}"]`);
}

describe("Select", () => {
  test("portals content + item tagged with data-slots when open", () => {
    const screen = render(
      <Select.Root defaultValue="a" defaultOpen>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content className="custom-content">
          <Select.Item value="a">Alpha</Select.Item>
          <Select.Item value="b">Beta</Select.Item>
        </Select.Content>
      </Select.Root>,
    );

    const content = queryBySlot(screen, "select-content");
    expect(content).not.toBeNull();
    expect(content?.className).toContain("custom-content");
    expect(content?.className).toContain("bg-popover");

    const item = queryBySlot(screen, "select-item");
    expect(item?.textContent).toContain("Alpha");

    expect(queryBySlot(screen, "select-trigger")).not.toBeNull();
  });

  test("does not render content while closed", () => {
    const screen = render(
      <Select.Root>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">Alpha</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    expect(queryBySlot(screen, "select-content")).toBeNull();
  });
});
