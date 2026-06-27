// EventCalendar — a Google-Calendar-style scheduling calendar with Month, Week
// and Day views. Data-agnostic and presentational: the host passes plain
// `CalendarEvent`s (a `start`, optional `end`, optional `allDay`) and wires the
// click/navigation callbacks. View and focused date are controllable or run
// uncontrolled. All date math is LOCAL time — events sit on the day/time the
// viewer sees on their own clock.
//
// NOTE: distinct from `./calendar` (the react-day-picker date *picker*). This is
// the event/scheduling surface.

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "#lib/cn";

export type CalendarViewMode = "month" | "week" | "day";

export interface CalendarEvent {
  readonly id: string;
  readonly title: string;
  /** When the event starts (local time). */
  readonly start: Date;
  /** When it ends; absent → a 30-minute point at `start`. */
  readonly end?: Date;
  /** Render in the all-day lane (month grid + the week/day all-day row). */
  readonly allDay?: boolean;
  /** Optional accent color (any CSS color) for the event block. */
  readonly color?: string;
  /** Extra one-line details shown under the title (e.g. configured card fields). */
  readonly meta?: ReadonlyArray<string>;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const HOUR_HEIGHT = 48; // px per hour row in the time grid
const MS_PER_DAY = 86_400_000;

// ---------------------------------------------------------------------------
// Date helpers (pure, exported for testing) — all local time.
// ---------------------------------------------------------------------------

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** The start of the week containing `date`, honoring `weekStartsOn` (0=Sun, 1=Mon). */
export function startOfWeek(date: Date, weekStartsOn: 0 | 1): Date {
  const lead = (date.getDay() - weekStartsOn + 7) % 7;
  return addDays(startOfDay(date), -lead);
}

/** The seven dates of the week containing `date`. */
export function weekDates(date: Date, weekStartsOn: 0 | 1): Date[] {
  const start = startOfWeek(date, weekStartsOn);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/** Whole weeks spanning `date`'s month (leading/trailing days included). */
export function monthMatrix(date: Date, weekStartsOn: 0 | 1): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const lead = (new Date(year, month, 1).getDay() - weekStartsOn + 7) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const count = Math.ceil((lead + daysInMonth) / 7) * 7;
  return Array.from({ length: count }, (_, i) => new Date(year, month, 1 - lead + i));
}

/** Minutes since local midnight. */
function minutesIntoDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

/** An event's effective end — its `end`, or 30 minutes past `start`. */
function eventEnd(event: CalendarEvent): Date {
  if (event.end && event.end.getTime() > event.start.getTime()) return event.end;
  return new Date(event.start.getTime() + 30 * 60_000);
}

/** Whether an event's span intersects the calendar day `day`. */
export function eventCoversDay(event: CalendarEvent, day: Date): boolean {
  const dayStart = startOfDay(day).getTime();
  const dayEnd = dayStart + MS_PER_DAY;
  // A timed event touching exactly midnight (end === next day's 00:00) belongs
  // to the earlier day only, so the comparison on `end` is strict.
  return event.start.getTime() < dayEnd && eventEnd(event).getTime() > dayStart;
}

/** Whether an event should live in the all-day lane (explicit, or spans a day+). */
export function isAllDay(event: CalendarEvent): boolean {
  return event.allDay === true || eventEnd(event).getTime() - event.start.getTime() >= MS_PER_DAY;
}

export interface DaySegment {
  readonly event: CalendarEvent;
  /** Minutes from midnight where the event's portion in this day starts/ends. */
  readonly startMin: number;
  readonly endMin: number;
  /** Lane index + total lanes for side-by-side overlap layout. */
  readonly lane: number;
  readonly lanes: number;
}

/**
 * Lay timed events out within one day: clip each to the day, then pack
 * overlapping events into side-by-side lanes (Google-style columns).
 */
export function layoutDay(
  events: readonly CalendarEvent[],
  day: Date,
  hourRange: readonly [number, number] = [0, 24],
): DaySegment[] {
  const dayStart = startOfDay(day).getTime();
  const rangeStart = hourRange[0] * 60;
  const rangeEnd = hourRange[1] * 60;

  type Raw = { event: CalendarEvent; startMin: number; endMin: number };
  const raw: Raw[] = [];
  for (const event of events) {
    if (isAllDay(event) || !eventCoversDay(event, day)) continue;
    const startMin = Math.max(rangeStart, Math.round((event.start.getTime() - dayStart) / 60_000));
    const endMin = Math.min(rangeEnd, Math.round((eventEnd(event).getTime() - dayStart) / 60_000));
    if (endMin <= startMin) continue;
    raw.push({ event, startMin, endMin });
  }
  raw.sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);

  const out: DaySegment[] = [];
  let cluster: Raw[] = [];
  let clusterEnd = -Infinity;
  const flush = () => {
    const laneEnds: number[] = [];
    const placed = cluster.map((seg) => {
      let lane = laneEnds.findIndex((end) => end <= seg.startMin);
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(seg.endMin);
      } else {
        laneEnds[lane] = seg.endMin;
      }
      return { seg, lane };
    });
    const lanes = laneEnds.length;
    for (const { seg, lane } of placed) out.push({ ...seg, lane, lanes });
    cluster = [];
  };
  for (const seg of raw) {
    if (cluster.length > 0 && seg.startMin >= clusterEnd) flush();
    cluster.push(seg);
    clusterEnd = cluster.length === 1 ? seg.endMin : Math.max(clusterEnd, seg.endMin);
  }
  if (cluster.length > 0) flush();
  return out;
}

function formatTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

/** The toolbar title for a view + focused date. */
export function viewLabel(view: CalendarViewMode, date: Date, weekStartsOn: 0 | 1): string {
  if (view === "day") {
    return `${WEEKDAY_LONG[date.getDay()]}, ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
  if (view === "week") {
    const days = weekDates(date, weekStartsOn);
    const a = days[0];
    const b = days[6];
    if (!a || !b) return "";
    if (a.getMonth() === b.getMonth()) return `${MONTH_NAMES[a.getMonth()]} ${a.getFullYear()}`;
    if (a.getFullYear() === b.getFullYear()) {
      return `${MONTH_NAMES[a.getMonth()]} – ${MONTH_NAMES[b.getMonth()]} ${a.getFullYear()}`;
    }
    return `${MONTH_NAMES[a.getMonth()]} ${a.getFullYear()} – ${MONTH_NAMES[b.getMonth()]} ${b.getFullYear()}`;
  }
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

// ---------------------------------------------------------------------------
// Shared pieces
// ---------------------------------------------------------------------------

function eventStyle(event: CalendarEvent): CSSProperties | undefined {
  return event.color ? { backgroundColor: `${event.color}1a`, color: event.color } : undefined;
}

/** A clickable event block (used in the time grid). */
function EventBlock({
  event,
  className,
  style,
  onClick,
  children,
}: {
  event: CalendarEvent;
  className?: string;
  style?: CSSProperties;
  onClick?: (event: CalendarEvent) => void;
  children: ReactNode;
}): ReactNode {
  return (
    <button
      type="button"
      data-slot="calendar-event"
      disabled={!onClick}
      onClick={onClick ? () => onClick(event) : undefined}
      style={{ ...eventStyle(event), ...style }}
      className={cn(
        "overflow-hidden rounded px-1.5 py-0.5 text-left text-xs leading-tight",
        event.color ? undefined : "bg-primary/15 text-primary",
        onClick ? "hover:brightness-95" : "cursor-default",
        className,
      )}
    >
      {children}
      {event.meta?.map((line, index) => (
        <span key={`${index}-${line}`} className="block truncate opacity-70">
          {line}
        </span>
      ))}
    </button>
  );
}

/** The weekday + date-number column header for the time grid. */
function DayColumnHeader({ day }: { day: Date }): ReactNode {
  const today = isSameDay(day, new Date());
  return (
    <div data-slot="calendar-day-header" className="flex flex-1 flex-col items-center gap-1 py-1.5">
      <span className="text-[0.7rem] text-muted-foreground uppercase">
        {WEEKDAY_SHORT[day.getDay()]}
      </span>
      <span
        className={cn(
          "flex h-7 min-w-7 items-center justify-center rounded-full px-1 font-medium text-sm",
          today ? "bg-primary text-primary-foreground" : undefined,
        )}
      >
        {day.getDate()}
      </span>
    </div>
  );
}

/**
 * The hour-grid shared by Week (7 columns) and Day (1 column): an all-day lane,
 * an hour gutter, positioned timed events, and a "now" line on today's column.
 */
function TimeGrid({
  days,
  events,
  hourRange,
  onEventClick,
}: {
  days: readonly Date[];
  events: readonly CalendarEvent[];
  hourRange: readonly [number, number];
  onEventClick?: (event: CalendarEvent) => void;
}): ReactNode {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [startHour, endHour] = hourRange;
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const totalHeight = hours.length * HOUR_HEIGHT;
  const now = new Date();
  const nowMin = minutesIntoDay(now);
  const nowVisible = nowMin >= startHour * 60 && nowMin <= endHour * 60;

  const allDayByDay = days.map((day) =>
    events.filter((event) => isAllDay(event) && eventCoversDay(event, day)),
  );
  const hasAllDay = allDayByDay.some((list) => list.length > 0);

  // Open on the morning (or now) rather than midnight.
  useEffect(() => {
    if (!scrollRef.current) return;
    const target = nowVisible ? nowMin : 8 * 60;
    scrollRef.current.scrollTop = ((target - startHour * 60) / 60) * HOUR_HEIGHT - HOUR_HEIGHT;
  }, [nowVisible, nowMin, startHour]);

  return (
    <div data-slot="calendar-time-grid" className="flex flex-col overflow-hidden rounded-lg border">
      {/* Header: gutter spacer + day headers */}
      <div className="flex border-b">
        <div className="w-14 shrink-0" />
        {days.map((day) => (
          <DayColumnHeader key={day.toISOString()} day={day} />
        ))}
      </div>

      {/* All-day lane (only when something occupies it) */}
      {hasAllDay ? (
        <div className="flex border-b bg-muted/20">
          <div className="flex w-14 shrink-0 items-center justify-end pr-2 text-[0.65rem] text-muted-foreground">
            all-day
          </div>
          {days.map((day, i) => (
            <div key={day.toISOString()} className="flex flex-1 flex-col gap-0.5 border-l p-0.5">
              {(allDayByDay[i] ?? []).map((event) => (
                <EventBlock
                  key={event.id}
                  event={event}
                  onClick={onEventClick}
                  className="block w-full truncate"
                >
                  {event.title || "Untitled"}
                </EventBlock>
              ))}
            </div>
          ))}
        </div>
      ) : null}

      {/* Scrollable time area */}
      <div ref={scrollRef} className="overflow-y-auto" style={{ maxHeight: 560 }}>
        <div className="flex" style={{ height: totalHeight }}>
          {/* Hour gutter */}
          <div className="w-14 shrink-0">
            {hours.map((h) => (
              <div key={h} style={{ height: HOUR_HEIGHT }} className="relative text-right">
                <span className="-top-2 absolute right-2 text-[0.7rem] text-muted-foreground">
                  {h === startHour ? "" : `${String(h).padStart(2, "0")}:00`}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day) => {
            const segments = layoutDay(events, day, hourRange);
            const showNow = nowVisible && isSameDay(day, now);
            return (
              <div key={day.toISOString()} className="relative flex-1 border-l">
                {/* Hour gridlines */}
                {hours.map((h) => (
                  <div
                    key={h}
                    style={{ height: HOUR_HEIGHT }}
                    className="border-border/60 border-b"
                  />
                ))}
                {/* Timed events */}
                {segments.map(({ event, startMin, endMin, lane, lanes }) => {
                  const top = ((startMin - startHour * 60) / 60) * HOUR_HEIGHT;
                  const height = Math.max(16, ((endMin - startMin) / 60) * HOUR_HEIGHT - 2);
                  return (
                    <EventBlock
                      key={event.id}
                      event={event}
                      onClick={onEventClick}
                      style={{
                        position: "absolute",
                        top,
                        height,
                        left: `calc(${(lane / lanes) * 100}% + 2px)`,
                        width: `calc(${100 / lanes}% - 4px)`,
                      }}
                      className="absolute shadow-sm"
                    >
                      <span className="font-medium">{event.title || "Untitled"}</span>
                      <span className="block opacity-80">{formatTime(event.start)}</span>
                    </EventBlock>
                  );
                })}
                {/* Now indicator */}
                {showNow ? (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute right-0 left-0 z-10 border-destructive border-t-2"
                    style={{ top: ((nowMin - startHour * 60) / 60) * HOUR_HEIGHT }}
                  >
                    <span className="-left-1 -top-1 absolute h-2 w-2 rounded-full bg-destructive" />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------

export interface CalendarViewProps {
  readonly date: Date;
  readonly events: readonly CalendarEvent[];
  readonly weekStartsOn?: 0 | 1;
  readonly onEventClick?: (event: CalendarEvent) => void;
}

export function MonthView({
  date,
  events,
  weekStartsOn = 1,
  onEventClick,
  maxPerDay = 3,
}: CalendarViewProps & { readonly maxPerDay?: number }): ReactNode {
  const cells = monthMatrix(date, weekStartsOn);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
  const weekdayOrder = Array.from({ length: 7 }, (_, i) => (weekStartsOn + i) % 7);
  const today = new Date();

  return (
    <table data-slot="calendar-month" className="w-full table-fixed border-collapse text-sm">
      <thead>
        <tr>
          {weekdayOrder.map((wd) => (
            <th
              key={wd}
              scope="col"
              aria-label={WEEKDAY_LONG[wd]}
              className="border p-1.5 text-center font-medium text-muted-foreground text-xs"
            >
              {WEEKDAY_SHORT[wd]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week) => (
          <tr key={week[0]?.getTime() ?? 0}>
            {week.map((day) => {
              const dayEvents = events
                .filter((event) => eventCoversDay(event, day))
                .sort((a, b) => a.start.getTime() - b.start.getTime());
              const outside = day.getMonth() !== date.getMonth();
              const isToday = isSameDay(day, today);
              const shown = dayEvents.slice(0, maxPerDay);
              const overflow = dayEvents.length - shown.length;
              return (
                <td
                  key={day.toISOString()}
                  aria-current={isToday ? "date" : undefined}
                  aria-label={`${MONTH_NAMES[day.getMonth()]} ${day.getDate()}, ${day.getFullYear()}`}
                  className={cn(
                    "h-28 border p-1 align-top",
                    outside ? "bg-muted/30 text-muted-foreground" : undefined,
                  )}
                >
                  <div className="mb-1 text-right">
                    <span
                      className={cn(
                        "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs",
                        isToday
                          ? "bg-primary font-semibold text-primary-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {day.getDate()}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {shown.map((event) => (
                      <EventBlock
                        key={event.id}
                        event={event}
                        onClick={onEventClick}
                        className={cn(
                          "block w-full truncate",
                          isAllDay(event) ? "font-medium" : undefined,
                        )}
                      >
                        {isAllDay(event)
                          ? event.title || "Untitled"
                          : `${formatTime(event.start)} ${event.title || "Untitled"}`}
                      </EventBlock>
                    ))}
                    {overflow > 0 ? (
                      <div className="px-1 text-muted-foreground text-xs">+{overflow} more</div>
                    ) : null}
                  </div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function WeekView({
  date,
  events,
  weekStartsOn = 1,
  onEventClick,
  hourRange = [0, 24],
}: CalendarViewProps & { readonly hourRange?: [number, number] }): ReactNode {
  return (
    <TimeGrid
      days={weekDates(date, weekStartsOn)}
      events={events}
      hourRange={hourRange}
      onEventClick={onEventClick}
    />
  );
}

export function DayView({
  date,
  events,
  onEventClick,
  hourRange = [0, 24],
}: CalendarViewProps & { readonly hourRange?: [number, number] }): ReactNode {
  return (
    <TimeGrid
      days={[startOfDay(date)]}
      events={events}
      hourRange={hourRange}
      onEventClick={onEventClick}
    />
  );
}

// ---------------------------------------------------------------------------
// Toolbar + view toggle
// ---------------------------------------------------------------------------

const VIEW_OPTIONS: ReadonlyArray<{ value: CalendarViewMode; label: string }> = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

export function CalendarViewToggle({
  view,
  onViewChange,
  className,
}: {
  view: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
  className?: string;
}): ReactNode {
  return (
    // biome-ignore lint/a11y/useSemanticElements: a labelled group of toggle buttons is a WAI-ARIA group, not a form fieldset
    <div
      data-slot="calendar-view-toggle"
      role="group"
      aria-label="Calendar view"
      className={cn("inline-flex items-center rounded-lg border bg-muted/40 p-0.5", className)}
    >
      {VIEW_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={view === option.value}
          onClick={() => onViewChange(option.value)}
          className={cn(
            "rounded-md px-2.5 py-1 font-medium text-sm transition-colors",
            view === option.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function CalendarToolbar({
  label,
  onToday,
  onPrev,
  onNext,
  view,
  onViewChange,
  className,
}: {
  label: string;
  onToday: () => void;
  onPrev: () => void;
  onNext: () => void;
  view?: CalendarViewMode;
  onViewChange?: (view: CalendarViewMode) => void;
  className?: string;
}): ReactNode {
  return (
    <div
      data-slot="calendar-toolbar"
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      <button
        type="button"
        onClick={onToday}
        className="h-8 rounded-md border px-3 font-medium text-sm hover:bg-accent"
      >
        Today
      </button>
      <div className="flex items-center">
        <button
          type="button"
          aria-label="Previous"
          onClick={onPrev}
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
        >
          <CaretLeftIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={onNext}
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
        >
          <CaretRightIcon className="h-4 w-4" />
        </button>
      </div>
      <h2 className="font-semibold text-base" aria-live="polite">
        {label}
      </h2>
      {view && onViewChange ? (
        <CalendarViewToggle view={view} onViewChange={onViewChange} className="ml-auto" />
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Composed EventCalendar
// ---------------------------------------------------------------------------

export interface EventCalendarProps {
  readonly events?: readonly CalendarEvent[];
  /** Controlled view. Omit (with `defaultView`) to run uncontrolled. */
  readonly view?: CalendarViewMode;
  readonly defaultView?: CalendarViewMode;
  readonly onViewChange?: (view: CalendarViewMode) => void;
  /** Controlled focused date. Omit (with `defaultDate`) to run uncontrolled. */
  readonly date?: Date;
  readonly defaultDate?: Date;
  readonly onDateChange?: (date: Date) => void;
  readonly onEventClick?: (event: CalendarEvent) => void;
  /** 0 = Sunday, 1 = Monday (default — matches most scheduling UIs). */
  readonly weekStartsOn?: 0 | 1;
  /** Visible hour band in the week/day time grid. */
  readonly hourRange?: [number, number];
  /** Hide the built-in toolbar (host renders its own controls). */
  readonly hideToolbar?: boolean;
  readonly className?: string;
}

export function EventCalendar({
  events = [],
  view: viewProp,
  defaultView = "month",
  onViewChange,
  date: dateProp,
  defaultDate,
  onDateChange,
  onEventClick,
  weekStartsOn = 1,
  hourRange = [0, 24],
  hideToolbar = false,
  className,
}: EventCalendarProps): ReactNode {
  const [viewState, setViewState] = useState<CalendarViewMode>(viewProp ?? defaultView);
  const [dateState, setDateState] = useState<Date>(() => defaultDate ?? new Date());
  const view = viewProp ?? viewState;
  const date = dateProp ?? dateState;

  function changeView(next: CalendarViewMode) {
    if (viewProp === undefined) setViewState(next);
    onViewChange?.(next);
  }
  function changeDate(next: Date) {
    if (dateProp === undefined) setDateState(next);
    onDateChange?.(next);
  }

  const step = (direction: 1 | -1) => {
    if (view === "month") changeDate(addMonths(date, direction));
    else if (view === "week") changeDate(addDays(date, 7 * direction));
    else changeDate(addDays(date, direction));
  };

  const shared = { date, events, weekStartsOn, onEventClick } as const;

  return (
    <section
      data-slot="event-calendar"
      aria-label="Calendar"
      className={cn("flex flex-col gap-3", className)}
    >
      {hideToolbar ? null : (
        <CalendarToolbar
          label={viewLabel(view, date, weekStartsOn)}
          onToday={() => changeDate(new Date())}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          view={view}
          onViewChange={changeView}
        />
      )}
      {view === "month" ? (
        <MonthView {...shared} />
      ) : view === "week" ? (
        <WeekView {...shared} hourRange={hourRange} />
      ) : (
        <DayView {...shared} hourRange={hourRange} />
      )}
    </section>
  );
}
