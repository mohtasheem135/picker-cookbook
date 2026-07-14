# Blocks & availability

Live page: `/docs/blocks-and-availability` · Demo:
`components/demos/blocks-demo.tsx`

## What it demonstrates

The availability input to everything: `RawBlockInput` shape, half-open
boundary behavior at a real slot list, turnaround gaps, and malformed-input
reporting (`onIssues`) — one demo with a booked trip ending at exactly
10:00 AM plus a deliberately inverted block.

## RawBlockInput

| Field | Type | Notes |
| ----- | ---- | ----- |
| `id`* | string | stable; used in issue reports + reason display |
| `startMs`* | number | UTC epoch ms — first blocked instant |
| `endMs`* | number | UTC epoch ms — first **free** instant (half-open) |
| `kind`* | `'booking'\|'host'\|'maintenance'\|'snooze'\|'external'\|'unknown'` | drives reason copy |
| `label` | string | human-readable reason |

Map your API payload in **one adapter**: unit conversion (seconds→ms) and
end-semantics (inclusive→half-open) decisions belong there and nowhere else.

## Behaviors proven live

- `turnaroundMinutes: 0` → the slot at exactly `endMs` is **selectable**
  (back-to-back is exact). 60/120 → boundary slots disable.
- Inverted block (`endMs < startMs`) → engine keeps valid blocks, drops the
  bad one, reports `{ id, problem: 'inverted', raw }` via `onIssues`.
  Problems: `'inverted' | 'non-finite' | 'missing-field'`. Never throws.

## Server-side hygiene

```ts
import { mergeBlocks, parseRawBlocks } from 'availability-datetime-picker/core'
const { blocks, issues } = parseRawBlocks(untrusted)
const intervals = mergeBlocks(blocks) // overlapping/adjacent merged, sources kept
```

## Gotchas

- The half-open contract is yours to uphold at the mapping layer — the
  engine cannot detect inclusive-end backends.
