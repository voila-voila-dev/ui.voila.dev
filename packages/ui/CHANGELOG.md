# @voila/ui

## 0.3.1

### Patch Changes

- `EventCalendar`: `CalendarEvent` gains an optional `meta` (string lines) rendered under each event's title, for showing configured card fields on calendar events.

## 0.3.0

### Minor Changes

- Add `EventCalendar` (`@voila/ui/event-calendar`) — a Google-Calendar-style scheduling surface with Month, Week and Day views, range (`start`/`end`) and all-day events, side-by-side overlap layout, a "now" indicator, and a Today/prev/next toolbar with a Day/Week/Month toggle. Distinct from the existing `@voila/ui/calendar` date picker.

  Fix `Tabs` active-state styling: Base UI marks the selected tab with `data-active` (not `data-selected`), so the current tab now gets its background/shadow instead of looking identical to the others.
