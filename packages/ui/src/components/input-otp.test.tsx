import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { InputOTP } from "#components/input-otp";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot="${slot}"]`);
}

describe("InputOTP", () => {
  test("renders groups and slots tagged with data-slots", () => {
    const screen = render(
      <InputOTP.Root maxLength={4}>
        <InputOTP.Group className="custom-group">
          <InputOTP.Slot index={0} className="custom-slot" />
          <InputOTP.Slot index={1} />
          <InputOTP.Separator />
          <InputOTP.Slot index={2} />
          <InputOTP.Slot index={3} />
        </InputOTP.Group>
      </InputOTP.Root>,
    );

    const group = queryBySlot(screen, "input-otp-group");
    expect(group).not.toBeNull();
    expect(group?.className).toContain("custom-group");

    const slots = screen.baseElement.querySelectorAll('[data-slot="input-otp-slot"]');
    expect(slots).toHaveLength(4);
    expect(slots[0]?.className).toContain("custom-slot");
    expect(slots[0]?.className).toContain("rounded-l-md");

    expect(queryBySlot(screen, "input-otp-separator")).not.toBeNull();
  });
});
