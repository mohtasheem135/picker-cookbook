import type { Metadata } from 'next'

import { Callout } from '@/components/site/callout'
import { CodeBlock } from '@/components/site/code-block'
import { DocPage } from '@/components/site/doc-page'

export const metadata: Metadata = { title: 'Core concepts' }

const INSTANT_SNIPPET = `import type { Instant } from 'availability-datetime-picker'

// An Instant is a plain number: UTC epoch milliseconds.
const pickup: Instant = 1786714200000

// The SAME instant, displayed in two zones — the value never changes:
new Date(pickup).toLocaleString('en-US', { timeZone: 'America/New_York' })
// "8/14/2026, 10:10:00 AM"
new Date(pickup).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
// "8/14/2026, 7:40:00 PM"`

const BLOCK_SNIPPET = `import type { RawBlockInput } from 'availability-datetime-picker'

// Half-open [start, end): endMs is the FIRST instant the resource is free
// again. A trip may end at the exact instant a block starts, and start at
// the exact instant one ends (unless turnaroundMinutes > 0).
const blocks: RawBlockInput[] = [
  {
    id: 'trip-482',
    startMs: Date.UTC(2026, 7, 20, 10, 0), // blocked from Aug 20 10:00 UTC…
    endMs: Date.UTC(2026, 7, 22, 10, 0),   // …free again AT Aug 22 10:00 UTC
    kind: 'booking',                        // 'booking' | 'host' | 'maintenance' | 'snooze' | 'external' | 'unknown'
    label: 'Booked by another guest',       // shown when the user taps the blocked day
  },
]`

const DAYKEY_SNIPPET = `import type { DayKey } from 'availability-datetime-picker'

// Date-only values are strings — zone-unambiguous by construction.
const serviceDate: DayKey = '2026-07-15'

// Convert only at app boundaries, with the provided helpers:
import { dayStart, endOfDay, instantToDayKey } from 'availability-datetime-picker'
dayStart('2026-07-15', 'Asia/Kolkata')   // Instant: Jul 15 00:00 IST
endOfDay('2026-07-15', 'Asia/Kolkata')   // Instant: Jul 15 23:59:59.999 IST
instantToDayKey(1752561000000, 'Asia/Kolkata') // '2026-07-15'`

export default function Page() {
  return (
    <DocPage slug='core-concepts'>
      <p>
        Every component, hook, and engine function in this package derives
        from five facts. Read them once — every other page links back here.
      </p>

      <h2>1. All math is UTC epoch milliseconds</h2>
      <p>
        Date-time values are <code>Instant</code>s — plain numbers holding
        UTC epoch milliseconds. Interval arithmetic, validation, and slot
        enumeration all happen on these numbers. There is no{' '}
        <code>Date</code>-object math anywhere in the engine, which is why
        the same test suite passes under <code>TZ=UTC</code> and{' '}
        <code>TZ=Pacific/Kiritimati</code> (UTC+14).
      </p>
      <CodeBlock code={INSTANT_SNIPPET} lang='ts' title='instants.ts' />

      <h2>2. timeZone is display-only</h2>
      <p>
        The <code>timeZone</code> prop (an IANA name like{' '}
        <code>&apos;Asia/Kolkata&apos;</code>) decides where calendar days
        begin and end and how labels read. It <strong>never converts a
        value</strong>. Pass the zone of the <em>resource</em> (the car, the
        property) — the user books in the resource&apos;s local time, and the
        stored instants stay portable UTC. Proven live on the{' '}
        <a href='/docs/timezones'>time zones page</a>.
      </p>

      <h2>3. Blocks are half-open [start, end)</h2>
      <p>
        A block&apos;s <code>endMs</code> is the exact instant the resource
        becomes free again — not the last blocked moment. This makes
        back-to-back trips exact: no off-by-one-slot gaps, no double-booked
        boundary instant.
      </p>
      <CodeBlock code={BLOCK_SNIPPET} lang='ts' title='blocks.ts' />
      <Callout type='warn' title='Your mapping layer owns this contract'>
        <p>
          If your backend means &quot;blocked through the end day&quot;,
          extend <code>endMs</code> to the end of that day when you map the
          API payload. The engine stays half-open; it does not guess.
        </p>
      </Callout>

      <h2>4. Date-only values are DayKey strings</h2>
      <p>
        <code>SingleDatePicker</code> and <code>DateOnlyRangePicker</code>{' '}
        emit <code>&apos;yyyy-MM-dd&apos;</code> strings. A{' '}
        <code>Date</code> object always carries a time and a zone; serialized
        naively it shifts a day for half the planet. A string cannot.
      </p>
      <CodeBlock code={DAYKEY_SNIPPET} lang='ts' title='day-keys.ts' />

      <h2>5. Invalid selections are unselectable — never wiped</h2>
      <p>
        The design idea borrowed from Turo/Airbnb: blocked periods, minimum
        duration, lead time, and the booking horizon are enforced{' '}
        <em>while picking</em>. Days that cannot serve the current field are
        visually distinct but <strong>stay clickable</strong> — a tap
        explains <em>why</em> the day is unavailable and is guaranteed by the
        state machine to produce no selection. Editing one endpoint re-clamps
        the other instead of clearing it. See{' '}
        <a href='/docs/day-states-and-anti-wipe'>day states &amp; anti-wipe</a>{' '}
        for the full legend, live.
      </p>

      <Callout type='tip' title='One engine, no disagreements'>
        <p>
          Calendar day states, slot lists, the CTA verdict, and deep-link
          validation all derive from the same pure engine (
          <code>createAvailabilityEngine</code>). No two surfaces can
          disagree about availability — including your server, via the{' '}
          <a href='/docs/server-side-validation'>/core subpath</a>.
        </p>
      </Callout>
    </DocPage>
  )
}
