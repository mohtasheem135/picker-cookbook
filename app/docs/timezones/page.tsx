import type { Metadata } from 'next'

import { TimezoneDemo } from '@/components/demos/timezone-demo'
import { Callout } from '@/components/site/callout'
import { CodeBlock } from '@/components/site/code-block'
import { DemoFrame } from '@/components/site/demo-frame'
import { DocPage } from '@/components/site/doc-page'
import { readDemoSource } from '@/lib/source'

export const metadata: Metadata = { title: 'Time zones' }

const HELPERS = `import {
  dayStart, endOfDay,            // DayKey + zone → Instant at day boundary
  instantToDayKey,               // Instant + zone → 'yyyy-MM-dd'
  addDaysToKey,                  // 'yyyy-MM-dd' ± n days (pure string math)
  formatDayLabel, formatTimeLabel, formatDayTimeLabel,   // zone-aware labels
  formatZoneAbbreviation,        // 'America/Chicago' → 'CDT'
  wallTimeToInstant, wallTimeParts,  // wall-clock ↔ instant, in a zone
} from 'availability-datetime-picker'

// Everything takes the zone as an argument — nothing reads the runtime's
// local zone. That is why the engine passes its test suite unmodified
// under TZ=UTC and TZ=Pacific/Kiritimati (UTC+14).`

const WHICH_ZONE = `// Pass the RESOURCE's zone, not the viewer's: the user books the car in
// the car's local time. 10:00 AM means 10:00 AM where the car is parked.
<BookingDateTimePicker timeZone={car.timeZone} … />

// showZoneAbbreviation='auto' (default) tags times with CDT/PST/etc. only
// when the viewer's device zone differs from the resource's zone.`

export default function Page() {
  return (
    <DocPage slug='timezones'>
      <p>
        The single most bug-prone area of any date picker, resolved by one
        rule: <strong><code>timeZone</code> shapes display, never values</strong>.
        Values are UTC epoch milliseconds; the zone decides where calendar
        days begin and end and how labels read.
      </p>

      <h2>One value, three zones — live proof</h2>
      <p>
        All three pickers below are bound to the <em>same</em> state
        variable. Pick a time in any of them and watch the inspector: the
        millisecond value is one number, while each picker labels it in its
        own zone. Kiritimati (UTC+14, no DST) is the stress case — it can be{' '}
        <em>tomorrow</em> there while you pick.
      </p>
      <DemoFrame hint='pick in one column; the other two re-label the same instant'>
        <TimezoneDemo />
      </DemoFrame>
      <CodeBlock
        code={readDemoSource('timezone-demo.tsx')}
        title='components/demos/timezone-demo.tsx'
      />

      <h2>Whose zone do I pass?</h2>
      <CodeBlock code={WHICH_ZONE} title='whose-zone.tsx' />

      <h2>The zone-aware helpers</h2>
      <p>
        Whenever you need to cross between instants, day keys, and labels, use
        the exported helpers rather than <code>Date</code> math:
      </p>
      <CodeBlock code={HELPERS} lang='ts' title='helpers.ts' />

      <h2>DST and odd offsets</h2>
      <ul>
        <li>
          Slot lists are generated on the <em>wall clock</em> of the display
          zone: on a spring-forward day the 2:00–3:00&nbsp;AM slots simply
          don&apos;t exist; on fall-back days the repeated hour appears once.
          The underlying instants stay unambiguous.
        </li>
        <li>
          Day boundaries are computed per-zone (<code>dayStart</code>/
          <code>endOfDay</code>), so a &quot;day&quot; is always the
          resource&apos;s local day — including half-hour zones like{' '}
          <code>Asia/Kolkata</code> and extreme ones like{' '}
          <code>Pacific/Kiritimati</code>.
        </li>
      </ul>

      <Callout type='warn' title='The off-by-one-day symptom'>
        <p>
          A day &quot;shifting&quot; in your UI means a <code>DayKey</code>{' '}
          was converted through a <code>Date</code> in the wrong zone —
          usually <code>new Date(&apos;2026-07-15&apos;)</code> (which is UTC
          midnight) rendered in a western zone. Keep day keys as strings;
          convert at boundaries with the helpers above.
        </p>
      </Callout>
    </DocPage>
  )
}
