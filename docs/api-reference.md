# API reference

Live page: `/docs/api-reference`

## Entry points

- `availability-datetime-picker` — components + hooks + engine re-exports
- `availability-datetime-picker/core` — engine only, server-safe
- `availability-datetime-picker/styles.css` — the one stylesheet

## Components

`BookingDateTimePicker` (BookingValue) · `SingleDateTimePicker`
(Instant|null) · `SingleDatePicker` (DayKey|null) · `DateOnlyRangePicker`
(DayRangeValue) · `SuggestionBanner`

## Hooks

`useBookingPicker` (+ `dayKeyFromCalendarDate`) · `useSinglePicker` ·
`useSingleDateSelect` · `useDateRangeSelect`

## Engine

```ts
const engine = createAvailabilityEngine(blocks, config)
engine.config / .blocks / .issues / .todayKey / .windowMin / .horizon
engine.dayInfo(day) / .isDaySelectable / .isPickupDayDisabled / .isReturnDayDisabled
engine.pickupSlots(day) / .returnSlots(day, pickup)
engine.maxCheckout(pickup) / .minValidReturn(pickup)
engine.validateRange(pickup, ret) / .validateInstant(instant)   // Verdict
engine.defaultRange(minutes?) / .suggestNearestWindow(desired)
```

## Functions

`parseRawBlocks` · `suggestNearestWindow` · `dateOnlyConfig` /
`singleInstantConfig` · wire-format codecs `encodeInstant` /
`decodeInstant` / `encodeDay` / `decodeDay` (behind the components'
`valueFormat` prop) · zoned-day helpers (`dayStart`, `endOfDay`,
`instantToDayKey`, `localDateToDayKey`, `dayKeyToLocalDate`, `addDaysToKey`,
`wallTimeToInstant`, `wallTimeParts`, `formatDayLabel`, `formatTimeLabel`,
`formatDayTimeLabel`, `formatZoneAbbreviation`).

`/core`-only: `mergeBlocks`, `ENGINE_DEFAULTS`, `nextDayStart`,
`enumerateDaySlots`, `roundUpToSlotGrid`.

## Types

`Instant` (number, epoch ms) · `DayKey` (`'yyyy-MM-dd'`) · `RawBlockInput
{ id, startMs, endMs, kind, label? }` · `AvailabilityBlock` · `BlockKind` ·
`BlockParseIssue { id, problem, raw }` · `EngineConfig` · `SelectionWindow
{ min?, max? }` · `DayStatus` (5) · `DayInfo { day, status, blocks,
freeWindows }` · `Slot { instant, label, disabled, reason? }` ·
`SlotDisabledReason` (6) · `Verdict` · `Violation` / `ViolationCode` (7) ·
`BookingWindow { pickup, ret }` · `BookingValue` · `DayValue` /
`DayRangeValue` · `InstantValueFormat` / `DayValueFormat` ·
`FormattedInstant<F>` / `FormattedDay<F>` · `BookingValueOf<F>` /
`DayRangeValueOf<F>`

## Package facts

ESM-only · React 18/19 peers · `sideEffects: ["*.css"]` · types for both
entries · Node ≥ 18 · `/core` has no React ('use client' guard at build).
