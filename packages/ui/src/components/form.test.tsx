import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { Form } from "#components/form";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot="${slot}"]`);
}

function Harness() {
  const form = useForm({ defaultValues: { name: "" } });
  return (
    <Form.Root {...form}>
      <Form.Field
        name="name"
        control={form.control}
        render={() => (
          <Form.Item className="custom-item">
            <Form.Label>Name</Form.Label>
            <Form.Control render={<input />} />
            <Form.Description>Your full name</Form.Description>
          </Form.Item>
        )}
      />
    </Form.Root>
  );
}

describe("Form", () => {
  test("wires react-hook-form fields with data-slots", () => {
    const screen = render(<Harness />);

    const item = queryBySlot(screen, "form-item");
    expect(item).not.toBeNull();
    expect(item?.className).toContain("custom-item");
    expect(item?.className).toContain("space-y-2");

    expect(queryBySlot(screen, "form-label")?.textContent).toBe("Name");
    expect(queryBySlot(screen, "form-control")).not.toBeNull();
    expect(queryBySlot(screen, "form-description")?.textContent).toBe("Your full name");
  });
});
