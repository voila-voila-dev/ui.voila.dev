import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Dialog } from "#components/dialog";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("Dialog", () => {
  test("renders content, title and description tagged with data-slots when open", () => {
    const screen = render(
      <Dialog.Root open>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Edit view</Dialog.Title>
            <Dialog.Description>Tweak the columns</Dialog.Description>
          </Dialog.Header>
        </Dialog.Content>
      </Dialog.Root>,
    );
    expect(queryBySlot(screen, "dialog-content")?.textContent).toContain("Edit view");
    expect(queryBySlot(screen, "dialog-title")?.textContent).toBe("Edit view");
    expect(queryBySlot(screen, "dialog-description")?.textContent).toBe("Tweak the columns");
    // The auto-injected close button renders through the Button primitive.
    expect(queryBySlot(screen, "dialog-close-button")).not.toBeNull();
  });

  test("does not render content while closed", () => {
    const screen = render(
      <Dialog.Root>
        <Dialog.Content>
          <Dialog.Title>Hidden</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );
    expect(queryBySlot(screen, "dialog-content")).toBeNull();
  });
});
