# DateTimeRangePicker

Live page: `/docs/date-time-range-picker` · Demos:
`components/demos/trip-picker.tsx`, `booking-search-bar.tsx`

## What it demonstrates

The flagship trip-range flow: pickup + return times on a 30-min grid,
availability enforced while picking. Desktop two-month popover; drawer under
768 px.

## How to use it

0. Flow: picking a pickup day preselects the first valid time and shows the
   pickup slot list to adjust; picking a return day does the same for
   return times. The slot panel always shows the endpoint that has a value
   when the auto-advanced edit target doesn't yet (fixed 2026-07-15 — it
   previously hid right after a day pick).
1. Hold a `BookingValue` (`{ pickup, ret }`, each `Instant | null`) in state.
2. Pass `blocks: RawBlockInput[]` (required — `[]` if none) and the
   resource's `timeZone`.
3. Persist in `onChange` only when `complete && verdict?.ok !== false`.
4. Tune rules per resource via `config` (minRentalMinutes, leadTimeMinutes,
   turnaroundMinutes, maxAdvanceDays, slotIntervalMinutes, window).

## Primary sample

```tsx
const [value, setValue] = useState<BookingValue>({ pickup: null, ret: null })

<DateTimeRangePicker
  blocks={blocks}
  timeZone='America/New_York'
  value={value}
  onChange={(next, { complete, verdict }) => {
    setValue(next)
    if (complete && verdict?.ok !== false) persist(next)
  }}
  config={{ minRentalMinutes: 24 * 60, leadTimeMinutes: 120 }}
/>
```

## Key props

`blocks`* · `timeZone`* · `value`* · `onChange(value, {complete, verdict})`*
· `valueFormat: 'epoch-ms' (default)|'epoch-seconds'|'iso'` (pickup/ret in
this wire format, typed via `DateTimeRangeValueOf<F>`) · `config` · `onIssues` ·
`onOpenChange` · `labels` · `trigger: 'fields'|'search-bar'` ·
`layout: 'row'|'column'` · `disabled`/`disabledReason` ·
`showZoneAbbreviation: 'auto'|'always'|'never'` ·
`showFooter` (default true — phase/duration + Clear/Done bar) ·
`showSlotHints` (default true — ⓘ hint on disabled slots) ·
`slotHintLabels` (override hint text per `SlotDisabledReason`; defaults
exported as `SLOT_REASON_LABELS`) ·
`mobileBreakpointPx` (768) · `tabletBreakpointPx` (1024) · `className`

## Variations

- `trigger='search-bar'` — inline segments for a search-hero pill.
- Pre-fill with `engine.defaultRange(minutes)` from `/core`.
- `onOpenChange={open => open && refetchBlocks()}` — fresh availability.

## Gotchas

- Trigger clicks while open **re-target** the edited endpoint, never close.
- Editing pickup re-clamps an invalidated return instead of clearing it.
- Memoize `config` — new identity per render rebuilds the engine.
