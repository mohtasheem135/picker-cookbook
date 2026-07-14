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

`past` ("Already passed") · `lead-time` ("Too soon") · `blocked`
("Unavailable") · `min-duration` ("Trip too short") · `beyond-clamp`
("Conflicts with the next booking") · `outside-window` ("Outside the
allowed period") — every `Slot` carries `{ disabled, reason }`; the quoted
default hint texts are exported as `SLOT_REASON_LABELS` and customizable
via `slotHintLabels` / hideable via `showSlotHints={false}`.

Note: "Unavailable" vs "Trip too short" on the same wall-clock time is not
a bug — `blocked` fires when the instant is inside a block; `min-duration`
fires when the minimum trip can't fit. Pickup and return lists can
legitimately show different reasons for the same time.

Partially booked days show an amber corner dot (`--bdp-warning`). This was
broken until 2026-07-15: the dot class referenced a nonexistent `bg-amber`
token, which Tailwind silently dropped — partial days rendered unmarked.

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
