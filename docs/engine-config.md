# Engine config

Live page: `/docs/engine-config` · Demo:
`components/demos/config-playground.tsx` (all knobs live)

## EngineConfig reference

| Field | Default | Effect |
| ----- | ------- | ------ |
| `timeZone`* | — | IANA display zone (boundaries + labels only) |
| `now` | `Date.now()` | injectable clock (tests, SSR) |
| `minRentalMinutes` | 420 (7 h) | shorter ranges fail `TOO_SHORT`; return slots disable `min-duration`; pickups disable if no valid trip fits before the next block |
| `slotIntervalMinutes` | 30 | selectable wall-clock grid; suggestions search on it |
| `leadTimeMinutes` | 60 | earliest pickup = now + this (`lead-time` / `LEAD_TIME`) |
| `turnaroundMinutes` | 0 | gap required next to blocks, both sides (0 = back-to-back OK) |
| `maxAdvanceDays` | 365 | booking horizon (`BEYOND_MAX_ADVANCE`) |
| `window` | — | `{ min?, max? }` — each side **replaces** its now-derived bound (`outside-window` / `OUTSIDE_WINDOW`) |

Styled components take it as `config` (minus `timeZone`, its own prop);
hooks and `createAvailabilityEngine` take it whole.

## Selection windows

- `min` replaces `now + leadTimeMinutes` → a past `min` allows the past.
- `max` replaces `now + maxAdvanceDays` → `max = endOfDay(todayKey, zone)`
  disables the future.

## Presets (from `/core`)

`dateOnlyConfig({ timeZone, window })` and
`singleInstantConfig({ timeZone, window })` zero the trip rules so only
window + blocks gate selection. `ENGINE_DEFAULTS` is exported for display.

## Gotchas

- **Memoize the config object** — identity change rebuilds the engine.
- Long-mounted pickers: `now` is captured at engine creation; re-key or pass
  `now` if a picker lives for hours.
