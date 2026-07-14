# Installation

Live page: `/docs/installation` · Demo: `components/demos/first-picker.tsx`

## What it demonstrates

Installing the package, loading the stylesheet once, and rendering a first
controlled picker.

## Steps

1. `npm install availability-datetime-picker` — peers: react/react-dom 18
   or 19. **ESM-only** (no CommonJS build).
2. Import the stylesheet once at the app entry:
   `import 'availability-datetime-picker/styles.css'` — ~10 KB, fully
   `bdp-`-namespaced, collision-proof; no CSS framework needed.
3. Render a controlled component.

## Primary sample

```tsx
'use client'
import { useState } from 'react'
import { SingleDatePicker, type DayValue } from 'availability-datetime-picker'

export function FirstPicker() {
  // Date-only values are DayKey strings ('yyyy-MM-dd'), never Date objects.
  const [day, setDay] = useState<DayValue>(null)
  return (
    <SingleDatePicker
      timeZone='Asia/Kolkata'
      value={day}
      onChange={setDay}
      label='Service date'
    />
  )
}
```

## Gotchas

- Every picker is controlled: hold the value in state, echo `onChange` back.
- Forgetting the stylesheet import is the #1 "unstyled popover" cause.
