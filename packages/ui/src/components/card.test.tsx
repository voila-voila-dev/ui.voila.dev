import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Card } from "#components/card";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("Card", () => {
  test("renders each part tagged with its data-slot", () => {
    const screen = render(
      <Card.Root>
        <Card.Header.Root>
          <Card.Header.Title>Title</Card.Header.Title>
          <Card.Header.Description>Description</Card.Header.Description>
        </Card.Header.Root>
        <Card.Content>Body</Card.Content>
        <Card.Footer>Footer</Card.Footer>
      </Card.Root>,
    );
    expect(queryBySlot(screen, "card")?.tagName).toBe("DIV");
    expect(queryBySlot(screen, "card-header")?.textContent).toContain("Title");
    expect(queryBySlot(screen, "card-title")?.textContent).toBe("Title");
    expect(queryBySlot(screen, "card-description")?.textContent).toBe("Description");
    expect(queryBySlot(screen, "card-content")?.textContent).toBe("Body");
    expect(queryBySlot(screen, "card-footer")?.textContent).toBe("Footer");
  });

  test("merges user className over the base classes", () => {
    const screen = render(<Card.Root className="custom-card">x</Card.Root>);
    const card = queryBySlot(screen, "card");
    expect(card?.classList.contains("custom-card")).toBe(true);
    expect(card?.classList.contains("rounded-lg")).toBe(true);
  });

  test("renders polymorphically via the render prop", () => {
    const screen = render(<Card.Root render={<section />}>x</Card.Root>);
    expect(queryBySlot(screen, "card")?.tagName).toBe("SECTION");
  });
});
