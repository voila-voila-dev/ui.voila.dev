import { afterEach, describe, expect, mock, test } from "bun:test";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import {
  type CalendarEvent,
  DayView,
  EventCalendar,
  eventCoversDay,
  isAllDay,
  layoutDay,
  MonthView,
  monthMatrix,
  startOfWeek,
  viewLabel,
  weekDates,
} from "#components/event-calendar";

afterEach(cleanup);

function ev(over: Partial<CalendarEvent> & { start: Date }): CalendarEvent {
  return { id: "e", title: "Event", ...over };
}

describe("date helpers", () => {
  test("startOfWeek honors weekStartsOn", () => {
    const thu = new Date(2026, 5, 25); // Thursday
    expect(startOfWeek(thu, 1).getDate()).toBe(22); // Monday June 22
    expect(startOfWeek(thu, 0).getDate()).toBe(21); // Sunday June 21
  });

  test("weekDates returns the 7 days of the week", () => {
    const days = weekDates(new Date(2026, 5, 25), 1);
    expect(days).toHaveLength(7);
    expect(days[0]?.getDate()).toBe(22);
    expect(days[6]?.getDate()).toBe(28);
  });

  test("monthMatrix spans whole weeks and includes the 1st", () => {
    const cells = monthMatrix(new Date(2026, 5, 15), 1);
    expect(cells.length % 7).toBe(0);
    expect(cells.some((d) => d.getDate() === 1 && d.getMonth() === 5)).toBe(true);
  });
});

describe("eventCoversDay", () => {
  test("a point event covers only its start day", () => {
    const e = ev({ start: new Date(2026, 5, 25, 10, 0) });
    expect(eventCoversDay(e, new Date(2026, 5, 25))).toBe(true);
    expect(eventCoversDay(e, new Date(2026, 5, 24))).toBe(false);
    expect(eventCoversDay(e, new Date(2026, 5, 26))).toBe(false);
  });

  test("a multi-day event covers every day it spans", () => {
    const e = ev({ start: new Date(2026, 5, 24, 22, 0), end: new Date(2026, 5, 26, 2, 0) });
    expect(eventCoversDay(e, new Date(2026, 5, 24))).toBe(true);
    expect(eventCoversDay(e, new Date(2026, 5, 25))).toBe(true);
    expect(eventCoversDay(e, new Date(2026, 5, 26))).toBe(true);
    expect(eventCoversDay(e, new Date(2026, 5, 27))).toBe(false);
  });

  test("an end at exactly midnight belongs to the earlier day only", () => {
    const e = ev({ start: new Date(2026, 5, 24, 23, 0), end: new Date(2026, 5, 25, 0, 0) });
    expect(eventCoversDay(e, new Date(2026, 5, 24))).toBe(true);
    expect(eventCoversDay(e, new Date(2026, 5, 25))).toBe(false);
  });
});

describe("isAllDay", () => {
  test("explicit allDay, or a span of a day or more", () => {
    expect(isAllDay(ev({ start: new Date(2026, 5, 25), allDay: true }))).toBe(true);
    expect(isAllDay(ev({ start: new Date(2026, 5, 24), end: new Date(2026, 5, 25) }))).toBe(true);
    expect(
      isAllDay(ev({ start: new Date(2026, 5, 25, 10, 0), end: new Date(2026, 5, 25, 11, 0) })),
    ).toBe(false);
  });
});

describe("layoutDay", () => {
  const day = new Date(2026, 5, 25);

  test("packs overlapping events into side-by-side lanes", () => {
    const a = ev({
      id: "a",
      start: new Date(2026, 5, 25, 10, 0),
      end: new Date(2026, 5, 25, 11, 0),
    });
    const b = ev({
      id: "b",
      start: new Date(2026, 5, 25, 10, 30),
      end: new Date(2026, 5, 25, 11, 30),
    });
    const out = layoutDay([a, b], day);
    expect(out).toHaveLength(2);
    expect(out.every((s) => s.lanes === 2)).toBe(true);
    expect(new Set(out.map((s) => s.lane))).toEqual(new Set([0, 1]));
  });

  test("non-overlapping events each get a single full-width lane", () => {
    const a = ev({
      id: "a",
      start: new Date(2026, 5, 25, 9, 0),
      end: new Date(2026, 5, 25, 10, 0),
    });
    const b = ev({
      id: "b",
      start: new Date(2026, 5, 25, 11, 0),
      end: new Date(2026, 5, 25, 12, 0),
    });
    const out = layoutDay([a, b], day);
    expect(out.every((s) => s.lanes === 1 && s.lane === 0)).toBe(true);
  });

  test("clips to the visible hour range and drops all-day events", () => {
    const spillover = ev({
      id: "s",
      start: new Date(2026, 5, 25, 6, 0),
      end: new Date(2026, 5, 25, 12, 0),
    });
    const allDay = ev({ id: "ad", start: new Date(2026, 5, 25), allDay: true });
    const out = layoutDay([spillover, allDay], day, [8, 18]);
    expect(out).toHaveLength(1);
    expect(out[0]?.startMin).toBe(8 * 60); // clipped from 06:00 up to 08:00
  });
});

describe("viewLabel", () => {
  test("month / day / week", () => {
    expect(viewLabel("month", new Date(2026, 5, 15), 1)).toBe("June 2026");
    expect(viewLabel("day", new Date(2026, 5, 25), 1)).toBe("Thursday, June 25, 2026");
    expect(viewLabel("week", new Date(2026, 5, 25), 1)).toBe("June 2026");
  });

  test("a week spanning two months reads as a range", () => {
    expect(viewLabel("week", new Date(2026, 6, 30), 1)).toBe("July – August 2026");
  });
});

describe("MonthView", () => {
  test("renders a timed event in its day cell", () => {
    const e = ev({ id: "1", title: "Standup", start: new Date(2026, 5, 10, 10, 0) });
    render(<MonthView date={new Date(2026, 5, 15)} events={[e]} />);
    const cell = screen.getByRole("cell", { name: "June 10, 2026" });
    expect(within(cell).getByText("10:00 Standup")).toBeDefined();
  });
});

describe("DayView", () => {
  test("renders a timed event block and fires onEventClick", () => {
    const onEventClick = mock();
    const e = ev({
      id: "1",
      title: "Demo",
      start: new Date(2026, 5, 25, 14, 0),
      end: new Date(2026, 5, 25, 15, 0),
    });
    render(<DayView date={new Date(2026, 5, 25)} events={[e]} onEventClick={onEventClick} />);
    fireEvent.click(screen.getByText("Demo"));
    expect(onEventClick.mock.calls[0]?.[0]).toMatchObject({ id: "1" });
  });
});

describe("EventCalendar", () => {
  test("navigates months and switches view from the toolbar", () => {
    render(<EventCalendar defaultDate={new Date(2026, 5, 15)} defaultView="month" />);
    expect(screen.getByRole("heading", { name: "June 2026" })).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("heading", { name: "July 2026" })).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Today" }));
    fireEvent.click(screen.getByRole("button", { name: "Day" }));
    // The Day toggle is pressed and the label switches to a single-day heading.
    expect(screen.getByRole("button", { name: "Day" }).getAttribute("aria-pressed")).toBe("true");
  });

  test("exposes structural data-slots", () => {
    const { container } = render(
      <EventCalendar defaultDate={new Date(2026, 5, 15)} defaultView="month" />,
    );
    expect(container.querySelector("[data-slot=event-calendar]")).not.toBeNull();
    expect(container.querySelector("[data-slot=calendar-toolbar]")).not.toBeNull();
    expect(container.querySelector("[data-slot=calendar-month]")).not.toBeNull();
  });
});

describe("event meta lines", () => {
  test("renders configured meta lines under an event title", () => {
    const e = ev({
      id: "1",
      title: "Demo",
      start: new Date(2026, 5, 25, 14, 0),
      meta: ["Owner: Sam", "Priority: High"],
    });
    render(<DayView date={new Date(2026, 5, 25)} events={[e]} />);
    expect(screen.getByText("Owner: Sam")).toBeDefined();
    expect(screen.getByText("Priority: High")).toBeDefined();
  });
});
