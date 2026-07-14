# Core concepts

Live page: `/docs/core-concepts` (prose + snippets, no demo)

The five facts every other page builds on:

1. **All math is UTC epoch milliseconds.** Values are `Instant` numbers; no
   `Date`-object math exists in the engine — the same suite passes under
   `TZ=UTC` and `TZ=Pacific/Kiritimati`.
2. **`timeZone` is display-only.** An IANA name that decides where calendar
   days begin/end and how labels read. It never converts a value. Pass the
   *resource's* zone.
3. **Blocks are half-open `[start, end)`.** `endMs` is the first *free*
   instant — back-to-back trips are exact. If your backend means
   "blocked through the end day", extend `endMs` in your mapping layer; the
   engine does not guess.
4. **Date-only values are `DayKey` strings** (`'yyyy-MM-dd'`) — a string is
   zone-unambiguous; a serialized `Date` shifts a day for half the planet.
   Convert at boundaries only: `dayStart`, `endOfDay`, `instantToDayKey`.
5. **Invalid selections are unselectable, never wiped.** Rules are enforced
   while picking; blocked days stay clickable to explain themselves; editing
   one endpoint re-clamps the other instead of clearing it.

One pure engine (`createAvailabilityEngine`) feeds calendar day states, slot
lists, CTA verdicts, and deep-link validation — no two surfaces can
disagree, including your server via `/core`.

Key block shape (memorize this):

```ts
const blocks: RawBlockInput[] = [
  {
    id: 'trip-482',
    startMs: Date.UTC(2026, 7, 20, 10, 0), // epoch ms
    endMs: Date.UTC(2026, 7, 22, 10, 0),   // first FREE instant
    kind: 'booking',                        // 'booking'|'host'|'maintenance'|'snooze'|'external'|'unknown'
    label: 'Booked by another guest',
  },
]
```
