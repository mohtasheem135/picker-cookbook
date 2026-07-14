# Day states & anti-wipe

Live page: `/docs/day-states-and-anti-wipe` · Demo:
`components/demos/day-states-demo.tsx`

## What it demonstrates

The calendar and `engine.dayInfo(day).status` rendered side by side (same
source of truth), plus the anti-wipe proof: clicking a blocked day surfaces
a reason and the `onChange` counter does not move.

## The five day statuses (`DayStatus`)

| Status | Meaning |
| ------ | ------- |
| `past` | before today / window min |
| `available` | fully free |
| `partial` | some hours blocked; trips can start/end in free windows |
| `checkout-only` | a trip can end here, not start (block begins too soon for min duration) |
| `blocked` | fully unavailable — struck through but **still clickable** |

## The six slot reasons (`SlotDisabledReason`)

`past` · `lead-time` · `blocked` · `min-duration` · `beyond-clamp` ·
`outside-window` — every `Slot` carries `{ disabled, reason }`.

## The anti-wipe contract

1. Prevention first: invalid days/slots are disabled before they can be
   picked.
2. Re-clamp, don't clear: editing pickup re-clamps an invalidated return.
3. Blocked clicks explain: no-op + `onBlockedAttempt(DayInfo)` —
   `info.status`, `info.blocks` (label/kind), `info.freeWindows`.
4. Deep links are the exception: injected values *can* be invalid — that's
   what `verdict` + SuggestionBanner are for.

## Gotchas

- "My selection vanished" is always a controlled-value echo bug in the
  consumer — the machine never wipes.
- In custom UIs keep blocked days clickable (no HTML `disabled`) so
  `onBlockedAttempt` can explain.
