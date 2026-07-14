import type { Metadata } from 'next'

import { DayStatesDemo } from '@/components/demos/day-states-demo'
import { Callout } from '@/components/site/callout'
import { CodeBlock } from '@/components/site/code-block'
import { DemoFrame } from '@/components/site/demo-frame'
import { DocPage } from '@/components/site/doc-page'
import { readDemoSource } from '@/lib/source'

export const metadata: Metadata = { title: 'Day states & anti-wipe' }

const BLOCKED_ATTEMPT = `// The hooks surface blocked attempts so you can explain instead of ignore:
useBookingPicker({
  blocks,
  config: { timeZone },
  value,
  onChange,
  onBlockedAttempt: (info: DayInfo) => {
    // info.status: why the day can't serve the active field
    // info.blocks: the actual blocks touching it (label, kind)
    // info.freeWindows: what IS free that day
    toast(\`\${info.day} unavailable: \${info.blocks[0]?.label ?? info.status}\`)
  },
})`

export default function Page() {
  return (
    <DocPage slug='day-states-and-anti-wipe'>
      <p>
        The package&apos;s founding idea: <strong>an invalid selection must
        be unselectable, not caught-and-wiped after the fact</strong>. This
        page shows the machinery that guarantees it — day classification,
        slot disabling reasons, and the blocked-attempt path.
      </p>

      <h2>The five day statuses</h2>
      <table>
        <thead>
          <tr><th>Status</th><th>Meaning</th><th>Calendar treatment</th></tr>
        </thead>
        <tbody>
          <tr><td><code>past</code></td><td>Before today (or the window min).</td><td>Muted, unselectable.</td></tr>
          <tr><td><code>available</code></td><td>Fully free.</td><td>Normal, selectable.</td></tr>
          <tr><td><code>partial</code></td><td>Some hours blocked — a trip can start or end in the free windows.</td><td>Selectable; blocked slots disabled inside.</td></tr>
          <tr><td><code>checkout-only</code></td><td>A trip can end here but not start (a block begins too soon for the minimum duration).</td><td>Selectable for return only.</td></tr>
          <tr><td><code>blocked</code></td><td>Fully unavailable.</td><td>Struck through — but still clickable.</td></tr>
        </tbody>
      </table>

      <h2>Live: calendar and raw classification, side by side</h2>
      <p>
        The grid under the picker prints{' '}
        <code>engine.dayInfo(day).status</code> for the next 28 days — the
        exact data the calendar renders from. Then try the anti-wipe proof:
        click a struck-through (blocked) day in the picker. A reason hint
        appears, and the <code>onChange fired</code> counter in the inspector
        does not move — the state machine turned the click into an
        explanation, not a selection.
      </p>
      <DemoFrame hint='click a blocked day — reason appears, onChange counter stays put'>
        <DayStatesDemo />
      </DemoFrame>
      <CodeBlock
        code={readDemoSource('day-states-demo.tsx')}
        title='components/demos/day-states-demo.tsx'
      />

      <h2>The six slot-disabled reasons</h2>
      <table>
        <thead>
          <tr><th>Reason</th><th>A slot is disabled because…</th><th>Default hint text</th></tr>
        </thead>
        <tbody>
          <tr><td><code>past</code></td><td>the instant already happened.</td><td>Already passed</td></tr>
          <tr><td><code>lead-time</code></td><td>it is earlier than <code>now + leadTimeMinutes</code>.</td><td>Too soon</td></tr>
          <tr><td><code>blocked</code></td><td>it falls inside a block (or its turnaround gap).</td><td>Unavailable</td></tr>
          <tr><td><code>min-duration</code></td><td>no valid trip of <code>minRentalMinutes</code> fits from/to it.</td><td>Trip too short</td></tr>
          <tr><td><code>beyond-clamp</code></td><td>it is past the last reachable return for the chosen pickup.</td><td>Conflicts with the next booking</td></tr>
          <tr><td><code>outside-window</code></td><td>it violates an explicit <code>window.min/max</code> bound.</td><td>Outside the allowed period</td></tr>
        </tbody>
      </table>
      <p>
        Every <code>Slot</code> carries <code>{'{ disabled, reason }'}</code>,
        so a custom UI built on the <a href='/docs/headless-hooks'>headless
        hooks</a> can explain itself exactly like the styled components do.
        In the styled pickers the hint text appears in the ⓘ tooltip
        (customize with <code>slotHintLabels</code>, hide with{' '}
        <code>showSlotHints=&#123;false&#125;</code>; defaults exported as{' '}
        <code>SLOT_REASON_LABELS</code>).
      </p>
      <Callout type='info' title='“It said Trip too short before — now it says Unavailable”'>
        <p>
          Different rules, different lists — both correct. On a{' '}
          <strong>pickup</strong> list, times inside a blocked period are{' '}
          <code>blocked</code> (&quot;Unavailable&quot;), and times whose
          remaining free window can&apos;t fit a minimum trip are{' '}
          <code>min-duration</code> (&quot;Trip too short&quot;). On a{' '}
          <strong>return</strong> list, times before{' '}
          <code>pickup + minRentalMinutes</code> are{' '}
          <code>min-duration</code> too. The same wall-clock time can carry a
          different reason depending on which endpoint you&apos;re picking —
          hover the ⓘ to see which rule fired.
        </p>
      </Callout>
      <p>
        On the calendar, partially booked days carry a small{' '}
        <strong>amber dot</strong> in the corner (token{' '}
        <code>--bdp-warning</code>) — free hours remain, and the slot list
        explains the blocked ones.
      </p>

      <h2>The anti-wipe contract, precisely</h2>
      <ol>
        <li>
          <strong>Prevention first:</strong> days and slots that would create
          an invalid range are disabled before the user can pick them.
        </li>
        <li>
          <strong>Re-clamp, don&apos;t clear:</strong> editing pickup with a
          return already chosen re-clamps the return to the nearest valid
          instant instead of wiping it.
        </li>
        <li>
          <strong>Blocked clicks explain:</strong> a click on an unavailable
          day is a no-op that fires <code>onBlockedAttempt(DayInfo)</code> —
          reason surfaced, selection untouched.
        </li>
        <li>
          <strong>Deep links are the exception:</strong> a value injected
          from outside (URL, saved draft) <em>can</em> be invalid — that is
          what <code>verdict</code> and{' '}
          <a href='/docs/suggestion-banner'>SuggestionBanner</a> are for.
        </li>
      </ol>
      <CodeBlock code={BLOCKED_ATTEMPT} title='on-blocked-attempt.tsx' />

      <Callout type='tip' title='“My selection vanished”'>
        <p>
          It can&apos;t — the machine never wipes. If a value changed
          unexpectedly, check your controlled-value echo: are you feeding{' '}
          <code>onChange</code> back into <code>value</code> unmodified? See{' '}
          <a href='/docs/limitations-and-troubleshooting'>troubleshooting</a>.
        </p>
      </Callout>
    </DocPage>
  )
}
