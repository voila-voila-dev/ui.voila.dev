import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Pagination } from "#components/pagination";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot="${slot}"]`);
}

describe("Pagination", () => {
  test("renders each part tagged with its data-slot", () => {
    const screen = render(
      <Pagination.Root>
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous href="#" />
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Link href="#" isActive>
              1
            </Pagination.Link>
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Ellipsis />
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Next href="#" />
          </Pagination.Item>
        </Pagination.Content>
      </Pagination.Root>,
    );
    expect(queryBySlot(screen, "pagination")?.getAttribute("aria-label")).toBe("pagination");
    expect(queryBySlot(screen, "pagination-content")?.tagName).toBe("UL");
    expect(queryBySlot(screen, "pagination-item")?.tagName).toBe("LI");
    expect(queryBySlot(screen, "pagination-ellipsis")?.textContent).toContain("More pages");
  });

  test("marks the active link with aria-current and the outline variant classes", () => {
    const screen = render(
      <Pagination.Link href="#" isActive className="custom-link">
        2
      </Pagination.Link>,
    );
    const link = queryBySlot(screen, "pagination-link");
    expect(link?.tagName).toBe("A");
    expect(link?.getAttribute("aria-current")).toBe("page");
    expect(link?.classList.contains("custom-link")).toBe(true);
    // outline variant from buttonVariants
    expect(link?.classList.contains("border")).toBe(true);
  });

  test("inactive link has no aria-current", () => {
    const screen = render(
      <Pagination.Link href="#" size="icon">
        3
      </Pagination.Link>,
    );
    expect(queryBySlot(screen, "pagination-link")?.getAttribute("aria-current")).toBeNull();
  });
});
