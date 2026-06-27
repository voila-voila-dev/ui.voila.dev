import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Alert } from "#components/alert";

afterEach(cleanup);

function queryBySlot(view: ReturnType<typeof render>, slot: string) {
  return view.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("Alert", () => {
  test("renders each part tagged with its data-slot", () => {
    const view = render(
      <Alert.Root>
        <Alert.Title>Heads up</Alert.Title>
        <Alert.Description>Details</Alert.Description>
      </Alert.Root>,
    );
    const root = queryBySlot(view, "alert");
    expect(root?.getAttribute("role")).toBe("alert");
    expect(root?.getAttribute("data-variant")).toBe("default");
    expect(queryBySlot(view, "alert-title")?.textContent).toBe("Heads up");
    expect(queryBySlot(view, "alert-description")?.textContent).toBe("Details");
  });

  test("reflects the variant on data-variant and the classes", () => {
    const view = render(<Alert.Root variant="destructive">x</Alert.Root>);
    const root = queryBySlot(view, "alert");
    expect(root?.getAttribute("data-variant")).toBe("destructive");
    expect(root?.className).toContain("text-destructive");
  });

  test("merges user className over the base classes", () => {
    const view = render(<Alert.Root className="custom-alert">x</Alert.Root>);
    const root = queryBySlot(view, "alert");
    expect(root?.classList.contains("custom-alert")).toBe(true);
    expect(root?.classList.contains("rounded-lg")).toBe(true);
  });
});
