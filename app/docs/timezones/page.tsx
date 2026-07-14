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

      <h2>What if I don&apos;t pass timeZone at all?</h2>
      <p>
        In TypeScript you can&apos;t — it&apos;s a required prop and the
        compiler stops you. In plain JavaScript nothing crashes, and that is
        exactly the danger: <strong>the engine silently falls back to
        whatever zone the runtime happens to be in</strong> (verified: an
        engine built with no zone on a machine set to Asia/Calcutta derives
        its days in Asia/Calcutta). Concretely:
      </p>
      <ul>
        <li>
          <strong>Client-only app:</strong> every user sees days drawn in{' '}
          <em>their own</em> device zone. Two users looking at the same car
          see different day boundaries — a &quot;free Saturday&quot; in Delhi
          is partly Friday in New York.
        </li>
        <li>
          <strong>SSR (Next.js):</strong> worse — the server renders in the
          server&apos;s zone (often UTC), the client re-renders in the
          user&apos;s zone. Day states shift between the two renders:
          hydration-mismatch warnings, days flickering from available to
          blocked, the classic off-by-one-day bug.
        </li>
        <li>
          <strong>Server validation:</strong> a route handler validating in
          the server&apos;s zone while the UI picked in the user&apos;s zone
          can disagree near midnight — the exact drift the one-engine design
          exists to prevent.
        </li>
      </ul>
      <Callout type='warn' title='Rule of thumb'>
        <p>
          Always pass an explicit IANA zone, and make it the{' '}
          <strong>resource&apos;s</strong> zone, sourced from your data (the
          car&apos;s garage, the property&apos;s address) — never from{' '}
          <code>Intl.DateTimeFormat().resolvedOptions().timeZone</code> on
          the server, and only from the viewer&apos;s device when the thing
          being scheduled genuinely lives where the viewer is.
        </p>
      </Callout>

      <h2>Real-life scenarios, in plain words</h2>
      <table>
        <thead>
          <tr><th>Scenario</th><th>What you pass</th><th>What the user sees</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Car parked in New York, traveler booking from India</td>
            <td><code>timeZone=&apos;America/New_York&apos;</code> (the car&apos;s zone)</td>
            <td>Calendar days and &quot;10:00 AM&quot; mean New York time — when the traveler lands, the pickup time is right. Because their device differs, the trigger shows an &quot;EDT&quot; tag (<code>showZoneAbbreviation=&apos;auto&apos;</code>) and the footer states the zone in full.</td>
          </tr>
          <tr>
            <td>Host reviews the same booking from London</td>
            <td>same — the car&apos;s zone</td>
            <td>Identical dates and times as the traveler saw. The stored value is one UTC number, so nobody ever &quot;converts&quot; anything.</td>
          </tr>
          <tr>
            <td>Doctor&apos;s appointment at a clinic; patients book online</td>
            <td>the clinic&apos;s zone</td>
            <td>Slots are clinic wall-clock times — 9:00 AM is when the door opens, wherever the patient browses from.</td>
          </tr>
          <tr>
            <td>&quot;Date of maintenance&quot; form field (date, no time)</td>
            <td>any consistent zone (the resource&apos;s)</td>
            <td>The value is a <code>DayKey</code> string like <code>&apos;2026-07-17&apos;</code> — a string cannot shift a day in anyone&apos;s zone, so it survives storage, APIs, and CSV exports untouched.</td>
          </tr>
          <tr>
            <td>User picks 11:30 PM near midnight, server validates</td>
            <td>the same explicit zone on both sides</td>
            <td>UI and server derive identical day boundaries — no &quot;valid on the client, rejected by the server&quot; edge at midnight.</td>
          </tr>
          <tr>
            <td>Booking horizon spans a DST change (spring forward)</td>
            <td>a DST-observing zone, e.g. <code>America/New_York</code></td>
            <td>On the transition day the 2:00–2:59 AM slots simply don&apos;t exist (that hour doesn&apos;t happen); in fall the repeated hour appears once. Stored instants stay unambiguous either way.</td>
          </tr>
          <tr>
            <td>Forgot to pass a zone (plain JS)</td>
            <td>— (runtime fallback)</td>
            <td>Every machine draws its own calendar: server ≠ client ≠ other users. Hydration warnings and off-by-one days. Don&apos;t ship this.</td>
          </tr>
        </tbody>
      </table>

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
