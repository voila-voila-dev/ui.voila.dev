import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Toaster, toast } from "#components/sonner";

afterEach(cleanup);

describe("Toaster", () => {
  // Sonner only renders its toast list (`[data-sonner-toaster]`, where the
  // `toaster` class lands) once a toast exists; the live region <section> is
  // always present, so we assert on that as the mount signal.
  test("mounts the sonner notifications region", () => {
    const screen = render(<Toaster theme="dark" />);
    const region = screen.baseElement.querySelector("section[aria-live]");
    expect(region).not.toBeNull();
    expect(region?.getAttribute("aria-label")).toContain("Notifications");
  });

  test("accepts a theme prop without throwing", () => {
    expect(() => render(<Toaster theme="light" />)).not.toThrow();
  });

  test("re-exports the toast imperative API", () => {
    expect(typeof toast).toBe("function");
  });
});
