# Headless hooks

Live page: `/docs/headless-hooks` · Demo:
`components/demos/headless-booking.tsx` (custom UI, ~100 lines, zero package
components)

## What it demonstrates

The four hooks ARE the state machines — the styled components are skins.
Custom UIs keep every guarantee: anti-wipe, day classification, slot
reasons, verdicts, suggestions.

## useBookingPicker

Options: `blocks`*, `config: EngineConfig`* (memoize!), `value` /
`defaultValue` (controlled/uncontrolled), `onChange(value, {complete,
verdict})`, `onBlockedAttempt(DayInfo)`.

Returns: `engine` · `value` · `phase ('pick-start'|'pick-end'|'complete')` ·
`editing ('pickup'|'return')` · `verdict` · `suggestion` ·
`selectDay(date)` · `setPickupTime/setReturnTime(instant)` ·
`setEditing(field)` · `applySuggestion()` · `clear()` ·
`isDayDisabled/dayStatus/dayKeyOf(date)` · `slotsForActiveField(date)`.

## The other three

```ts
useSinglePicker({ blocks, config, precision, rangeAnchor, … })  // one Instant
useSingleDateSelect({ timeZone, blocks, window, now, … })        // one DayKey
useDateRangeSelect({ timeZone, blocks, window, now, … })         // { from, to } + meta.complete
```

Same shape throughout: controlled/uncontrolled value, direct `engine`
access, `selectDay`/`clear`, `isDayDisabled`/`dayStatus`,
`onBlockedAttempt`.

## Gotchas

- Memoize `blocks` and `config` — identity change rebuilds the engine.
- Build day cells from keys with `dayKeyToLocalDate`; read back with
  `dayKeyOf` (`dayKeyFromCalendarDate`) — no zone math on cells.
- Keep blocked days clickable in custom UIs so `onBlockedAttempt` explains.
