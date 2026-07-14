# SingleDatePicker

Live page: `/docs/single-date-picker` · Demo:
`components/demos/maintenance-date.tsx`

## What it demonstrates

One date, no time → `DayKey | null` string. Runs the `dateOnlyConfig`
preset (trip rules zeroed; window + blocks gate selection). The demo is a
past-only maintenance-date field: `window.min` 90 days back,
`window.max = endOfDay(todayKey, zone)`.

## Primary sample

```tsx
const selectionWindow = {
  min: now - 90 * DAY,
  max: endOfDay(instantToDayKey(now, ZONE), ZONE), // today is the last pickable day
}

<SingleDatePicker
  timeZone='Asia/Kolkata'
  value={day}                 // 'yyyy-MM-dd' | null
  onChange={setDay}
  window={selectionWindow}
  label='Date of maintenance'
  error={formError}           // red line under the trigger
/>
```

## Key props

`timeZone`* · `value`* · `onChange`* ·
`valueFormat: 'day-key' (default)|'epoch-ms'|'epoch-seconds'|'iso'` (instant
formats encode the day's START in `timeZone`) · `window {min?, max?}` ·
`blocks` · `now` · `label` · `placeholder` · `error` ·
`showFooter` (default true — selected-date + Clear bar) ·
`disabled`/`disabledReason` · `mobileBreakpointPx` · `className`

```tsx
<SingleDatePicker valueFormat='epoch-seconds' value={seconds}
  onChange={setSeconds} showFooter={false} … />
```

## Why the value is a string

`new Date('2026-07-15')` is UTC midnight → renders as 7/14 in New York.
Strings survive every serialization boundary. Convert only at boundaries:
`dayStart` / `endOfDay` / `dayKeyToLocalDate`.

## Gotchas

- A valid pick commits **and closes** the picker (one decision).
- Past days are disabled by default — open them with a past `window.min`.
