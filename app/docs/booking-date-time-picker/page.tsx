import type { Metadata } from 'next'

import { BookingSearchBar } from '@/components/demos/booking-search-bar'
import { TripPicker } from '@/components/demos/trip-picker'
import { Callout } from '@/components/site/callout'
import { CodeBlock } from '@/components/site/code-block'
import { DemoFrame } from '@/components/site/demo-frame'
import { DocPage } from '@/components/site/doc-page'
import { PropsTable } from '@/components/site/props-table'
import { readDemoSource } from '@/lib/source'

export const metadata: Metadata = { title: 'BookingDateTimePicker' }

const DEFAULT_RANGE = `import { createAvailabilityEngine } from 'availability-datetime-picker/core'

// Pre-fill a sensible default trip (2 days) instead of starting empty:
const engine = createAvailabilityEngine(blocks, { timeZone })
const initial = engine.defaultRange(2 * 24 * 60) // BookingWindow | null
const [value, setValue] = useState<BookingValue>(
  initial ?? { pickup: null, ret: null },
)`

const REFRESH_ON_OPEN = `<BookingDateTimePicker
  // Availability can change while the page is open — refetch when the
  // picker opens so the user always books against fresh blocks.
  onOpenChange={open => { if (open) refetchBlocks() }}
  onIssues={issues => reportToMonitoring(issues)}
  blocks={blocks}
  timeZone={timeZone}
  value={value}
  onChange={handleChange}
/>`

export default function Page() {
  return (
    <DocPage slug='booking-date-time-picker'>
      <p>
        The flagship component: a trip range with pickup and return times on
        a 30-minute grid, availability-aware end to end. Desktop gets a
        two-month popover with a slot column; under 768&nbsp;px it becomes a
        bottom-sheet drawer automatically.
      </p>

      <DemoFrame hint='a booked trip, a maintenance morning, and a host block are seeded in the calendar'>
        <TripPicker />
      </DemoFrame>

      <h2>How to use it</h2>
      <ol>
        <li>
          <strong>Hold the value in state.</strong> The value is a{' '}
          <code>BookingValue</code>: <code>{'{ pickup, ret }'}</code>, each an{' '}
          <code>Instant | null</code> (UTC epoch ms). The picker is fully
          controlled — it renders what you pass and reports edits through{' '}
          <code>onChange</code>.
        </li>
        <li>
          <strong>Pass the availability.</strong> <code>blocks</code> is an
          array of <code>RawBlockInput</code> (
          <a href='/docs/blocks-and-availability'>details</a>). Pass{' '}
          <code>[]</code> when there are none — the prop is required on this
          component so you never <em>forget</em> availability.
        </li>
        <li>
          <strong>Pass the resource&apos;s zone.</strong>{' '}
          <code>timeZone</code> shapes day boundaries and labels only; your
          values stay UTC epochs (<a href='/docs/timezones'>proof</a>).
        </li>
        <li>
          <strong>Persist on complete-and-valid.</strong>{' '}
          <code>onChange</code> gives you{' '}
          <code>{'meta: { complete, verdict }'}</code>. Persist when{' '}
          <code>complete && verdict?.ok !== false</code>; while picking is in
          progress, just echo the value back into state.
        </li>
        <li>
          <strong>Tune the rules per resource</strong> via{' '}
          <code>config</code> — minimum duration, lead time, turnaround,
          horizon (<a href='/docs/engine-config'>all knobs, live</a>). The
          demo above requires a 24-hour minimum trip and 2 hours of lead
          time.
        </li>
      </ol>

      <h2>Code</h2>
      <p>This is the exact source running in the demo above:</p>
      <CodeBlock
        code={readDemoSource('trip-picker.tsx')}
        title='components/demos/trip-picker.tsx'
      />

      <h2>Props</h2>
      <PropsTable
        rows={[
          { name: 'blocks', type: 'RawBlockInput[]', description: 'Unavailable periods, half-open [startMs, endMs). Pass [] for none.', required: true },
          { name: 'timeZone', type: 'string', description: "IANA zone of the resource's location. Display-only.", required: true },
          { name: 'value', type: 'BookingValue', description: '{ pickup, ret } — Instant | null each. Controlled.', required: true },
          { name: 'onChange', type: '(value, { complete, verdict }) => void', description: 'Fires on every selection edit. verdict is null until the range is complete.', required: true },
          { name: 'config', type: "Partial<Omit<EngineConfig, 'timeZone'>>", description: 'Engine overrides: minRentalMinutes, leadTimeMinutes, turnaroundMinutes, maxAdvanceDays, slotIntervalMinutes, window, now.' },
          { name: 'onIssues', type: '(issues: BlockParseIssue[]) => void', description: 'Malformed block reports — wire to error monitoring.' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Fires on open/close — refetch availability on open.' },
          { name: 'labels', type: '{ pickup?, return? }', description: 'Trigger field labels.', default: "'Pickup' / 'Return'" },
          { name: 'trigger', type: "'fields' | 'search-bar'", default: "'fields'", description: "Bordered field rows, or inline segments for a search pill." },
          { name: 'layout', type: "'row' | 'column'", default: "'row'", description: 'Trigger arrangement: one row with two columns, or stacked.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Grey the trigger and block opening.' },
          { name: 'disabledReason', type: 'string', description: 'Why — shown as tooltip + muted line under the trigger.' },
          { name: 'showZoneAbbreviation', type: "'auto' | 'always' | 'never'", default: "'auto'", description: "Zone tag (CDT, PST…) in trigger fields; 'auto' shows it only when the viewer's zone differs." },
          { name: 'mobileBreakpointPx', type: 'number', default: '768', description: 'Bottom-sheet drawer below this width.' },
          { name: 'tabletBreakpointPx', type: 'number', default: '1024', description: 'One calendar month (instead of two) below this width.' },
          { name: 'className', type: 'string', description: 'Extra classes on the trigger wrapper.' },
        ]}
      />

      <h2>Variations</h2>

      <h3>Search-bar trigger</h3>
      <p>
        For a search hero, <code>trigger=&apos;search-bar&apos;</code> renders
        inline segments meant to sit inside your own white pill:
      </p>
      <DemoFrame>
        <BookingSearchBar />
      </DemoFrame>
      <CodeBlock
        code={readDemoSource('booking-search-bar.tsx')}
        title='components/demos/booking-search-bar.tsx'
      />

      <h3>Pre-filled default range</h3>
      <p>
        Ask the engine for the earliest valid trip of a given length instead
        of starting empty:
      </p>
      <CodeBlock code={DEFAULT_RANGE} title='default-range.tsx' />

      <h3>Fresh availability on open</h3>
      <CodeBlock code={REFRESH_ON_OPEN} title='refresh-on-open.tsx' />

      <h2>Gotchas</h2>
      <ul>
        <li>
          <strong>Trigger clicks while open re-target, never close.</strong>{' '}
          Clicking Pickup/Return with the picker open switches which endpoint
          is being edited. Close happens via Done, Esc, or a true outside
          click.
        </li>
        <li>
          <strong>Editing pickup never wipes return.</strong> If the current
          return becomes invalid for a new pickup, the picker re-clamps it to
          the minimum valid return instead of clearing it — the{' '}
          <a href='/docs/day-states-and-anti-wipe'>anti-wipe contract</a>.
        </li>
        <li>
          <strong>Keep <code>config</code> referentially stable</strong>{' '}
          (module constant or <code>useMemo</code>) — a new object every
          render rebuilds the engine every render.
        </li>
      </ul>

      <Callout type='tip' title='Related'>
        <p>
          <a href='/docs/suggestion-banner'>SuggestionBanner</a> appears
          automatically inside this picker when a value turns invalid;{' '}
          <a href='/docs/server-side-validation'>server-side validation</a>{' '}
          re-checks the final range before you charge a card.
        </p>
      </Callout>
    </DocPage>
  )
}
