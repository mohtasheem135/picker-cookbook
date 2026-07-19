# Using with AI agents

Live page: `/docs/for-agents`. Fetch `/llms-full.txt` for every page in one
file, or `/llms.txt` for the index.

A condensed, implementation-ready guide to `availability-datetime-picker` —
everything a coding agent needs to add availability-aware date/time pickers to
a React app without reading the whole site.

## What it is

Three layers over one availability truth:

- **Core engine** (`availability-datetime-picker/core`) — a pure, React-free
  booking engine. All interval math is UTC epoch milliseconds.
- **Headless hooks** — the state machines the styled components run on.
- **Styled components** — drop-in pickers with a bundled stylesheet.

## Install

```bash
npm install availability-datetime-picker
```

- Peer deps: `react` and `react-dom` 18 or 19.
- ESM only. Import the stylesheet once at your app root:

```ts
import 'availability-datetime-picker/styles.css'
```

## Pick a component

| You need | Component | Value shape |
| --- | --- | --- |
| Trip range with pickup + return times | `DateTimeRangePicker` | `{ pickup, ret }` (epoch ms) |
| One date + one time | `SingleDateTimePicker` | `Instant \| null` (epoch ms) |
| One date, no time | `SingleDatePicker` | `DayKey \| null` (`'yyyy-MM-dd'`) |
| A date range, no time | `DateOnlyRangePicker` | `{ from, to }` (DayKeys) |
| Recover from an invalid range | `SuggestionBanner` | offers the nearest valid window |

## Values — the one rule that prevents bugs

- **Instant = UTC epoch milliseconds** — every date+time value.
- **DayKey = `'yyyy-MM-dd'` string** — every date-only value. Never round-trip a
  DayKey through a `Date` (that reintroduces the zone bug it avoids).
- **`valueFormat`** changes the wire format of `value`/`onChange`:
  - date+time: `'epoch-ms'` (default), `'epoch-seconds'`, `'iso'`
  - date-only: `'day-key'` (default), `'epoch-ms'`, `'epoch-seconds'`, `'iso'`

  The engine always computes over epoch ms internally regardless of format.

## Config — engine knobs

Pass through the `config` prop — `Partial<Omit<EngineConfig, 'timeZone'>>` — on
the **date+time** components only. Date-only pickers use the `dateOnlyConfig`
preset (trip rules zeroed) and are bounded with `window` instead.

| Knob | Default | Meaning |
| --- | --- | --- |
| `minRentalMinutes` | 420 | shortest trip (7 h); shorter returns are disabled "Trip too short" |
| `leadTimeMinutes` | 60 | earliest pickup = now + this many minutes |
| `turnaroundMinutes` | 0 | gap required next to blocks, on both sides (0 = back-to-back OK) |
| `slotIntervalMinutes` | 30 | time-grid tick size (`:00` / `:30`) |
| `maxAdvanceDays` | 365 | booking horizon from now |

`SingleDateTimePicker` zeroes `minRentalMinutes` and `leadTimeMinutes` via its
`singleInstantConfig` preset — its effective defaults for those two are `0`.

## Gotchas

- **`timeZone` is display-only** — it shapes day boundaries and labels, never
  conversion. It's optional; omit it to use the runtime/browser zone.
- **Blocks are half-open `[startMs, endMs)`** — `end` is the instant
  availability resumes. `RawBlockInput` = `{ id, startMs, endMs, kind, label? }`
  (epoch ms). Blocked days stay clickable; their slot list explains why.
- **Anti-wipe** — a click that would create an invalid range is a no-op;
  editing one endpoint re-clamps the other instead of clearing the selection.
- **`/core` is server-safe** (no React, no `'use client'`) — re-validate ranges
  on the server with the same engine that gated the UI.

## Copy-paste

### DateTimeRangePicker (trip range)

```tsx
'use client'
import { useState } from 'react'
import { DateTimeRangePicker, type BookingValue } from 'availability-datetime-picker'

const [value, setValue] = useState<BookingValue>({ pickup: null, ret: null })

<DateTimeRangePicker
  timeZone='America/New_York'   // optional; omit to use the browser's zone
  blocks={blocks}                // RawBlockInput[]; [] if none
  value={value}
  onChange={(next, { complete, verdict }) => {
    setValue(next)
    if (complete && verdict?.ok) persist(next)
  }}
  config={{ minRentalMinutes: 120 }}  // optional engine overrides
/>
```

### SingleDateTimePicker (one date + time)

```tsx
const [value, setValue] = useState<number | null>(null) // epoch ms

<SingleDateTimePicker
  timeZone='America/New_York'
  value={value}
  onChange={(next) => setValue(next)}
  blocks={blocks}
  precision='slots'            // or 'minute' for exact-minute entry
/>
```

### SingleDatePicker (one date, no time)

```tsx
const [day, setDay] = useState<string | null>(null) // 'yyyy-MM-dd'

<SingleDatePicker timeZone='America/New_York' value={day} onChange={setDay} />
```

### DateOnlyRangePicker (date range, no time)

```tsx
const [range, setRange] = useState({ from: null, to: null }) // DayKeys

<DateOnlyRangePicker
  timeZone='America/New_York'
  value={range}
  onChange={(next, { complete }) => setRange(next)}
/>
```

### Server-side validation (`/core`)

```ts
import { createAvailabilityEngine } from 'availability-datetime-picker/core'

const engine = createAvailabilityEngine(blocks, {
  timeZone: 'America/New_York',
  minRentalMinutes: 120,
})
const verdict = engine.validateRange(pickupMs, returnMs)
if (!verdict.ok) reject(verdict.violations)
```

## Where to read more

- Component pages: `/docs/date-time-range-picker`, `/docs/single-date-time-picker`,
  `/docs/single-date-picker`, `/docs/date-only-range-picker`.
- Concepts: `/docs/core-concepts`, `/docs/blocks-and-availability`,
  `/docs/engine-config`, `/docs/timezones`, `/docs/day-states-and-anti-wipe`.
- `/docs/headless-hooks`, `/docs/server-side-validation`, `/docs/theming`.
- Try every prop live: `/docs/playground`.
