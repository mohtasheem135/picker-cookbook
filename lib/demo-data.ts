import type { RawBlockInput } from 'availability-datetime-picker'

export const MINUTE = 60_000
export const HOUR = 3_600_000
export const DAY = 86_400_000

/**
 * Stable "now" for demo data: the start of the current hour. Blocks derived
 * from it are identical between the server render and client hydration
 * (except across an hour boundary), which keeps demos deterministic enough
 * for SSR while still always sitting in the near future.
 */
export function demoNow(): number {
  return Math.floor(Date.now() / HOUR) * HOUR
}

/**
 * The standard availability calendar used by most demos: one booked trip
 * next week, a maintenance morning after it, and a longer host block later
 * in the month. Everything is relative to now, so the demos never go stale.
 */
export function demoBlocks(): RawBlockInput[] {
  const t0 = demoNow()
  return [
    {
      id: 'trip-482',
      startMs: t0 + 5 * DAY + 10 * HOUR,
      endMs: t0 + 7 * DAY + 10 * HOUR,
      kind: 'booking',
      label: 'Booked by another guest',
    },
    {
      id: 'maintenance-91',
      startMs: t0 + 12 * DAY,
      endMs: t0 + 12 * DAY + 8 * HOUR,
      kind: 'maintenance',
      label: 'Scheduled maintenance',
    },
    {
      id: 'host-hold-7',
      startMs: t0 + 20 * DAY,
      endMs: t0 + 23 * DAY,
      kind: 'host',
      label: 'Blocked by host',
    },
  ]
}

/** Human-readable instant for state inspectors: wall clock in a zone. */
export function fmtInstant(ms: number | null, timeZone: string): string {
  if (ms === null) return 'null'
  return (
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(ms) + ` (${ms})`
  )
}
