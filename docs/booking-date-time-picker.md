# BookingDateTimePicker

Live page: `/docs/booking-date-time-picker` · Demos:
`components/demos/trip-picker.tsx`, `booking-search-bar.tsx`

## What it demonstrates

The flagship trip-range flow: pickup + return times on a 30-min grid,
availability enforced while picking. Desktop two-month popover; drawer under
768 px.

## How to use it

1. Hold a `BookingValue` (`{ pickup, ret }`, each `Instant | null`) in state.
2. Pass `blocks: RawBlockInput[]` (required — `[]` if none) and the
   resource's `timeZone`.
3. Persist in `onChange` only when `complete && verdict?.ok !== false`.
4. Tune rules per resource via `config` (minRentalMinutes, leadTimeMinutes,
   turnaroundMinutes, maxAdvanceDays, slotIntervalMinutes, window).

## Primary sample

```tsx
const [value, setValue] = useState<BookingValue>({ pickup: null, ret: null })

<BookingDateTimePicker
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
· `config` · `onIssues` · `onOpenChange` · `labels` ·
`trigger: 'fields'|'search-bar'` · `layout: 'row'|'column'` ·
`disabled`/`disabledReason` · `showZoneAbbreviation: 'auto'|'always'|'never'`
· `mobileBreakpointPx` (768) · `tabletBreakpointPx` (1024) · `className`

## Variations

- `trigger='search-bar'` — inline segments for a search-hero pill.
- Pre-fill with `engine.defaultRange(minutes)` from `/core`.
- `onOpenChange={open => open && refetchBlocks()}` — fresh availability.

## Gotchas

- Trigger clicks while open **re-target** the edited endpoint, never close.
- Editing pickup re-clamps an invalidated return instead of clearing it.
- Memoize `config` — new identity per render rebuilds the engine.
