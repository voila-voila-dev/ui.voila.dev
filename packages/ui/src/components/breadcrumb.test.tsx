import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Breadcrumb } from "#components/breadcrumb";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot="${slot}"]`);
}

describe("Breadcrumb", () => {
  test("renders each part tagged with its data-slot", () => {
    const screen = render(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>Current</Breadcrumb.Page>
          </Breadcrumb.Item>
          <Breadcrumb.Ellipsis />
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    );
    expect(queryBySlot(screen, "breadcrumb")?.getAttribute("aria-label")).toBe("breadcrumb");
    expect(queryBySlot(screen, "breadcrumb-list")?.tagName).toBe("OL");
    expect(queryBySlot(screen, "breadcrumb-item")?.tagName).toBe("LI");
    expect(queryBySlot(screen, "breadcrumb-link")?.textContent).toBe("Home");
    expect(queryBySlot(screen, "breadcrumb-page")?.getAttribute("aria-current")).toBe("page");
    expect(queryBySlot(screen, "breadcrumb-separator")?.getAttribute("aria-hidden")).toBe("true");
    expect(queryBySlot(screen, "breadcrumb-ellipsis")?.textContent).toContain("More");
  });

  test("merges user className over the base link classes", () => {
    const screen = render(
      <Breadcrumb.Link className="custom-link" href="/x">
        x
      </Breadcrumb.Link>,
    );
    const link = queryBySlot(screen, "breadcrumb-link");
    expect(link?.tagName).toBe("A");
    expect(link?.classList.contains("custom-link")).toBe(true);
    expect(link?.classList.contains("transition-colors")).toBe(true);
  });

  test("renders the link polymorphically via the render prop", () => {
    const screen = render(<Breadcrumb.Link render={<button type="button" />}>x</Breadcrumb.Link>);
    expect(queryBySlot(screen, "breadcrumb-link")?.tagName).toBe("BUTTON");
  });
});
