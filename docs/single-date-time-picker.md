# SingleDateTimePicker

Live page: `/docs/single-date-time-picker` · Demos:
`components/demos/single-slots.tsx`, `single-minute.tsx`, `single-anchor.tsx`

## What it demonstrates

One date + one time → `Instant | null`. Three modes:

- **`precision='slots'`** (default): 30-min slot column.
- **`precision='minute'`**: hour/minute selects for exact entry; combined
  with `config.window.min` in the past for "actual return time" use cases.
- **`rangeAnchor`**: fixed trip start — the value becomes a **trip end**;
  days/slots clamp after the anchor, min-duration applies, verdict =
  `validateRange(anchor, value)` (edit-trip building block).

Defaults to the `singleInstantConfig` preset: trip rules zeroed; only window
+ blocks gate the instant.

## Primary sample

```tsx
<SingleDateTimePicker
  timeZone='America/New_York'
  value={value}                       // Instant | null
  onChange={(next, { verdict }) => setValue(next)}
  blocks={blocks}
  rangeAnchor={tripStartMs}           // optional: value = trip END
  config={{ minRentalMinutes: 7 * 60 }}
  label='New return'
/>
```

## Key props

`timeZone`* · `value`* · `onChange(value, {verdict})`* · `blocks` ·
`precision: 'slots'|'minute'` · `rangeAnchor` · `config` · `label` ·
`placeholder` · `disabled`/`disabledReason` · `onIssues` · `onOpenChange` ·
`mobileBreakpointPx` · `className`

## Gotchas

- Without `rangeAnchor` validation is `validateInstant` (window + blocks
  only); with it, `TOO_SHORT` etc. return.
- Minute precision still gates *days* through the engine — exact-minute
  entry can't land inside a block.
