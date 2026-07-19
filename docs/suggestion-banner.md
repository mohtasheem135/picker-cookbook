# SuggestionBanner

Live page: `/docs/suggestion-banner` · Demo:
`components/demos/suggestion-demo.tsx`

## What it demonstrates

Recovery instead of a dead error: when a desired range is invalid (deep link
into a booked window, availability changed), compute the nearest valid
window and offer it as a one-tap fix.

## Flow

1. `engine.validateRange(pickup, ret)` → `{ ok: false, violations }`.
2. `engine.suggestNearestWindow(desired)` → `BookingWindow | null`
   (grid-searches the slot grid, preserving the desired duration).
3. Render `SuggestionBanner`; commit in `onApply`.

## Primary sample

```tsx
const engine = createAvailabilityEngine(blocks, { timeZone: ZONE })
const suggestion = engine.suggestNearestWindow(desired)

{suggestion && (
  <SuggestionBanner
    suggestion={suggestion}
    timeZone={ZONE}
    onApply={() => setValue(suggestion)}
  />
)}
```

## Props

`suggestion: BookingWindow`* · `timeZone`* · `onApply: () => void`* ·
`message` (default "These dates aren't available.") · `className`

## Notes

- Inside `DateTimeRangePicker` the banner is automatic;
  `useBookingPicker` exposes `suggestion` + `applySuggestion` for custom UIs.
- `suggestNearestWindow` returns `null` when nothing fits within the
  horizon — render a plain unavailable state then.
