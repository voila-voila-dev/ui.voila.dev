import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Carousel } from "#components/carousel";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
  return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

function renderCarousel() {
  return render(
    <Carousel.Root className="custom-root">
      <Carousel.Content className="custom-content">
        <Carousel.Item className="custom-item">Slide</Carousel.Item>
      </Carousel.Content>
      <Carousel.Previous className="custom-prev" />
      <Carousel.Next className="custom-next" />
    </Carousel.Root>,
  );
}

describe("Carousel", () => {
  test("tags every part with its data-slot", () => {
    const screen = renderCarousel();
    expect(queryBySlot(screen, "carousel")).not.toBeNull();
    expect(queryBySlot(screen, "carousel-content")).not.toBeNull();
    expect(queryBySlot(screen, "carousel-track")).not.toBeNull();
    expect(queryBySlot(screen, "carousel-item")?.textContent).toBe("Slide");
    expect(queryBySlot(screen, "carousel-previous")).not.toBeNull();
    expect(queryBySlot(screen, "carousel-next")).not.toBeNull();
  });

  test("merges user className over base classes", () => {
    const screen = renderCarousel();
    expect(queryBySlot(screen, "carousel")?.className).toContain("custom-root");
    expect(queryBySlot(screen, "carousel")?.className).toContain("relative");
    expect(queryBySlot(screen, "carousel-item")?.className).toContain("custom-item");
    expect(queryBySlot(screen, "carousel-previous")?.className).toContain("custom-prev");
  });

  test("exposes the WAI-ARIA carousel roles", () => {
    const screen = renderCarousel();
    expect(queryBySlot(screen, "carousel")?.getAttribute("role")).toBe("region");
    expect(queryBySlot(screen, "carousel-item")?.getAttribute("role")).toBe("group");
  });
});
