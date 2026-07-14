# Time zones

Live page: `/docs/timezones` · Demo: `components/demos/timezone-demo.tsx`

## What it demonstrates

One `Instant` bound to three pickers (`America/New_York`, `Asia/Kolkata`,
`Pacific/Kiritimati`). Picking in any column re-labels the same number in
the other two — the value never forks. `timeZone` shapes display, never
values.

## Whose zone?

Pass the **resource's** zone (the car's, the property's) — users book in
the resource's local time. `showZoneAbbreviation='auto'` tags times (CDT…)
only when the viewer's device zone differs.

## Helpers (all take the zone as an argument)

```ts
dayStart(dayKey, zone) / endOfDay(dayKey, zone) / nextDayStart(...)
instantToDayKey(ms, zone) / localDateToDayKey(date) / dayKeyToLocalDate(key)
addDaysToKey(key, n)                       // pure string math
formatDayLabel / formatTimeLabel / formatDayTimeLabel / formatZoneAbbreviation
wallTimeToInstant / wallTimeParts
```

Nothing reads the runtime's local zone — the engine suite passes unmodified
under `TZ=UTC` and `TZ=Pacific/Kiritimati` (UTC+14).

## DST & odd offsets

- Slot lists follow the display zone's wall clock: spring-forward slots
  simply don't exist; fall-back's repeated hour appears once.
- Day boundaries are per-zone — half-hour zones (Kolkata) and UTC+14
  (Kiritimati) both exact.

## The off-by-one-day bug

`new Date('2026-07-15')` is UTC midnight → 7/14 in New York. Keep day keys
as strings; convert only at boundaries with the helpers.
