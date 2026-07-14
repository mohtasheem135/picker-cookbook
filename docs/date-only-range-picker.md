# DateOnlyRangePicker

Live page: `/docs/date-only-range-picker` · Demo:
`components/demos/filter-range.tsx`

## What it demonstrates

A date range without times → `DayRangeValue { from, to }` (DayKey strings).
List filters, report ranges, lodging check-in/check-out. `dateOnlyConfig`
preset under the hood.

## Primary sample

```tsx
const [range, setRange] = useState<DayRangeValue>({ from: null, to: null })

<DateOnlyRangePicker
  timeZone='Asia/Kolkata'
  value={range}
  onChange={(next, { complete }) => {
    setRange(next)
    if (complete) applyFilter(next)   // act only when both ends are set
  }}
  blocks={blocks}
  labels={{ from: 'Check-in', to: 'Check-out' }}
/>
```

## Boundary math (adapter-side, once)

```ts
fromMs = dayStart(range.from, zone)  // 00:00:00.000 on the from-day
toMs   = endOfDay(range.to, zone)    // 23:59:59.999 on the to-day
```

## Key props

`timeZone`* · `value`* · `onChange(value, {complete})`* · `window` ·
`blocks` · `now` · `labels {from?, to?}` · `disabled`/`disabledReason` ·
`mobileBreakpointPx` (768) · `tabletBreakpointPx` (1024) · `className`

## Gotchas

- Picking a day before the current `from` restarts the range there.
- Need pickup/return *times*? Use `BookingDateTimePicker` instead.
- History filters: pass `window={{ min: 0 }}` to open the past.
