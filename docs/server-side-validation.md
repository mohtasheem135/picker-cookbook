# Server-side validation

Live page: `/docs/server-side-validation` · Demo:
`components/demos/validate-quote.tsx` + `app/api/quote/route.ts`

## What it demonstrates

The `/core` subpath (zero React, zero `'use client'` — enforced by a
package build guard) re-running the exact UI rules in a Next Route Handler.
The demo POSTs raw epoch numbers, bypassing the picker; a range inside a
block comes back 422 with structured violations.

## The Route Handler

```ts
import { createAvailabilityEngine } from 'availability-datetime-picker/core'

export async function POST(req: Request) {
  const { pickup, ret } = await req.json()
  const engine = createAvailabilityEngine(await loadBlocks(), {
    timeZone: 'America/New_York',
    minRentalMinutes: 24 * 60,
  })
  const verdict = engine.validateRange(pickup, ret)
  if (!verdict.ok)
    return Response.json({ ok: false, violations: verdict.violations }, { status: 422 })
  return Response.json({ ok: true })
}
```

## ViolationCode reference

`OVERLAPS_BLOCKS` (violation.blocks lists every offender) · `TOO_SHORT` ·
`START_IN_PAST` · `LEAD_TIME` · `INVERTED` · `BEYOND_MAX_ADVANCE` ·
`OUTSIDE_WINDOW`. Single instants: `engine.validateInstant(instant)`, same
codes.

## Deep links

Validate before hydrating: `verdict.ok` → hydrate as-is; invalid → start
empty + offer `engine.suggestNearestWindow(desired)`.

## Gotchas

- Build the server engine from the **same blocks + config** as the client,
  or the two sides disagree — the exact bug this architecture prevents.
