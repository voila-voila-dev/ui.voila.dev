import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { AlertDialog } from "#components/alert-dialog";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("AlertDialog", () => {
  test("renders portaled content, title, description and actions when open", () => {
    const screen = render(
      <AlertDialog.Root open>
        <AlertDialog.Content className="custom-content">
          <AlertDialog.Header>
            <AlertDialog.Title>Delete view</AlertDialog.Title>
            <AlertDialog.Description>This cannot be undone</AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action>Delete</AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>,
    );
    const content = queryBySlot(screen, "alert-dialog-content");
    expect(content?.textContent).toContain("Delete view");
    expect(content?.className).toContain("custom-content");
    expect(queryBySlot(screen, "alert-dialog-title")?.textContent).toBe("Delete view");
    expect(queryBySlot(screen, "alert-dialog-description")?.textContent).toBe(
      "This cannot be undone",
    );
    // Action/Cancel render through the Button primitive (data-slot=button).
    const action = queryBySlot(screen, "alert-dialog-action");
    expect(action?.getAttribute("data-slot")).toBe("alert-dialog-action");
    expect(action?.getAttribute("data-variant")).toBe("default");
    const cancel = queryBySlot(screen, "alert-dialog-cancel");
    expect(cancel?.getAttribute("data-variant")).toBe("outline");
    expect(cancel?.className).toContain("mt-2");
  });

  test("does not render content while closed", () => {
    const screen = render(
      <AlertDialog.Root>
        <AlertDialog.Content>
          <AlertDialog.Title>Hidden</AlertDialog.Title>
        </AlertDialog.Content>
      </AlertDialog.Root>,
    );
    expect(queryBySlot(screen, "alert-dialog-content")).toBeNull();
  });
});
