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

## What if timeZone isn't passed?

TypeScript requires it. Plain JS doesn't crash — the engine **silently
falls back to the runtime's zone** (verified). Consequences: client-only
apps show each user different day boundaries; SSR renders server-zone days
then re-renders client-zone days (hydration mismatches, off-by-one
flicker); server validation can disagree with the UI near midnight. Always
pass the resource's IANA zone explicitly from your data.

## Real-life scenarios (plain words)

- Car in New York, booked from India → pass the car's zone; times mean New
  York wall clock; viewer gets an "EDT" tag since their device differs;
  stored value is one UTC number.
- Host in London reviews the same trip → sees identical times (same zone
  prop, same number).
- Clinic appointments → clinic's zone: 9:00 AM is when the door opens,
  wherever the patient browses from.
- Date-only fields → `DayKey` strings can't shift in anyone's zone.
- Near-midnight picks → same explicit zone on client and server = same day
  boundaries, no valid-here/rejected-there edge.
- DST spring-forward day → the 2 AM hour's slots don't exist; fall-back's
  repeated hour appears once; instants stay unambiguous.
- No zone passed (plain JS) → every machine draws its own calendar; don't
  ship this.

## The off-by-one-day bug

`new Date('2026-07-15')` is UTC midnight → 7/14 in New York. Keep day keys
as strings; convert only at boundaries with the helpers.
