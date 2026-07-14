import type { Metadata } from 'next'

import { HeadlessBooking } from '@/components/demos/headless-booking'
import { Callout } from '@/components/site/callout'
import { CodeBlock } from '@/components/site/code-block'
import { DemoFrame } from '@/components/site/demo-frame'
import { DocPage } from '@/components/site/doc-page'
import { PropsTable } from '@/components/site/props-table'
import { readDemoSource } from '@/lib/source'

export const metadata: Metadata = { title: 'Headless hooks' }

const OTHER_HOOKS = `import {
  useSinglePicker,       // one Instant; precision 'slots' | 'minute'; rangeAnchor
  useSingleDateSelect,   // one DayKey string
  useDateRangeSelect,    // { from, to } DayKey range with meta.complete
} from 'availability-datetime-picker'

// All three follow the same shape as useBookingPicker: controlled or
// uncontrolled value, an \`engine\` you can query directly, selectDay /
// clear, isDayDisabled / dayStatus for your calendar, onBlockedAttempt.
const single = useSinglePicker({ blocks, config: { timeZone }, precision: 'minute' })
const date = useSingleDateSelect({ timeZone, window })
const range = useDateRangeSelect({ timeZone, blocks, onChange: (v, m) => m.complete && apply(v) })`

export default function Page() {
  return (
    <DocPage slug='headless-hooks'>
      <p>
        The styled components are thin skins over four hooks — the hooks{' '}
        <em>are</em> the state machines. When the stock look doesn&apos;t
        fit, take the hook and keep every guarantee: the anti-wipe contract,
        day classification, slot reasons, verdicts, and suggestions come from
        the hook, not the skin.
      </p>

      <h2>A custom booking UI in ~100 lines</h2>
      <p>
        No package components below — a hand-rolled day grid and slot chips
        wired to <code>useBookingPicker</code>:
      </p>
      <DemoFrame hint='pick a day, then a slot; then try a struck-through day'>
        <HeadlessBooking />
      </DemoFrame>
      <CodeBlock
        code={readDemoSource('headless-booking.tsx')}
        title='components/demos/headless-booking.tsx'
      />

      <h2>useBookingPicker</h2>
      <PropsTable
        title='Options'
        rows={[
          { name: 'blocks', type: 'RawBlockInput[]', description: 'Availability input.', required: true },
          { name: 'config', type: 'EngineConfig', description: 'Full engine config including timeZone. Memoize it.', required: true },
          { name: 'value', type: 'BookingValue', description: 'Controlled value; omit to let the hook own state.' },
          { name: 'defaultValue', type: 'BookingValue', description: 'Uncontrolled initial value.' },
          { name: 'onChange', type: '(value, { complete, verdict }) => void', description: 'Selection edits.' },
          { name: 'onBlockedAttempt', type: '(info: DayInfo) => void', description: 'User tapped a day that cannot serve the active field.' },
        ]}
      />
      <PropsTable
        title='Returns'
        rows={[
          { name: 'engine', type: 'AvailabilityEngine', description: 'Direct engine access — dayInfo, pickupSlots, validateRange, maxCheckout…' },
          { name: 'value / phase / editing', type: "BookingValue / 'pick-start' | 'pick-end' | 'complete' / 'pickup' | 'return'", description: 'Where the flow stands and which endpoint edits next.' },
          { name: 'verdict', type: 'Verdict | null', description: 'Null until complete; then { ok } or { ok: false, violations }.' },
          { name: 'suggestion', type: 'BookingWindow | null', description: 'Nearest valid alternative when the value is invalid.' },
          { name: 'selectDay', type: '(date: Date) => void', description: 'Day click — routes to pickup or return per the phase; blocked days no-op + report.' },
          { name: 'setPickupTime / setReturnTime', type: '(instant: Instant) => void', description: 'Slot picks.' },
          { name: 'setEditing', type: "(field: 'pickup' | 'return') => void", description: 'Re-target which endpoint a day click edits.' },
          { name: 'applySuggestion / clear', type: '() => void', description: 'Commit the suggestion / reset the value.' },
          { name: 'isDayDisabled / dayStatus / dayKeyOf', type: '(date: Date) => boolean / DayStatus / DayKey', description: 'Everything a custom calendar needs per day cell.' },
          { name: 'slotsForActiveField', type: '(date: Date) => Slot[]', description: 'Slot list for the endpoint being edited — each with { disabled, reason }.' },
        ]}
      />

      <h2>The other three hooks</h2>
      <CodeBlock code={OTHER_HOOKS} lang='ts' title='other-hooks.ts' />

      <h2>Gotchas</h2>
      <ul>
        <li>
          <strong>Memoize <code>blocks</code> and <code>config</code></strong> —
          the engine rebuilds on identity change. New literals every render =
          engine churn (correct, but wasteful).
        </li>
        <li>
          <code>selectDay</code> takes the calendar cell&apos;s{' '}
          <code>Date</code>; build cells from day keys with{' '}
          <code>dayKeyToLocalDate</code> and read them back with{' '}
          <code>dayKeyOf</code> — never do zone math on the cells.
        </li>
        <li>
          Keep blocked days <em>clickable</em> in your UI (don&apos;t set the
          HTML <code>disabled</code> attribute) — the click is how{' '}
          <code>onBlockedAttempt</code> explains the reason. See{' '}
          <a href='/docs/day-states-and-anti-wipe'>anti-wipe</a>.
        </li>
      </ul>

      <Callout type='tip' title='Or query the engine directly'>
        <p>
          The hooks expose <code>engine</code>; the{' '}
          <a href='/docs/api-reference'>full engine API</a> (slots, dayInfo,
          validateRange, defaultRange, suggestNearestWindow) is available
          without React at all via{' '}
          <code>availability-datetime-picker/core</code>.
        </p>
      </Callout>
    </DocPage>
  )
}
