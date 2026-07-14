import type { Metadata } from 'next'

import { MaintenanceDate } from '@/components/demos/maintenance-date'
import { Callout } from '@/components/site/callout'
import { CodeBlock } from '@/components/site/code-block'
import { DemoFrame } from '@/components/site/demo-frame'
import { DocPage } from '@/components/site/doc-page'
import { PropsTable } from '@/components/site/props-table'
import { readDemoSource } from '@/lib/source'

export const metadata: Metadata = { title: 'SingleDatePicker' }

const FORM_ERROR = `<SingleDatePicker
  timeZone={zone}
  value={day}
  onChange={setDay}
  label='Date of maintenance'
  // Form-level validation renders as a red line under the trigger:
  error={submitted && day === null ? 'Pick the maintenance date' : undefined}
/>`

const WHY_STRINGS = `// A DayKey survives every serialization boundary unchanged:
JSON.stringify({ serviceDate: '2026-07-15' })   // exactly what you stored

// A Date object does not — it drags a time + zone along:
new Date('2026-07-15')            // 2026-07-15T00:00:00.000Z (UTC midnight)
  .toLocaleDateString('en-US', { timeZone: 'America/New_York' })
// "7/14/2026" ← off by one for everyone west of UTC

// Convert at boundaries only, with the package helpers:
import { dayStart, dayKeyToLocalDate } from 'availability-datetime-picker'
dayStart('2026-07-15', 'Asia/Kolkata')  // Instant of local midnight
dayKeyToLocalDate('2026-07-15')          // Date at *runtime-local* midnight (UI only)`

export default function Page() {
  return (
    <DocPage slug='single-date-picker'>
      <p>
        One date, no time — service dates, maintenance dates, date-of-birth
        style form fields. The value is a{' '}
        <code>DayKey | null</code> (<code>&apos;yyyy-MM-dd&apos;</code>{' '}
        string). Under the hood it runs the same availability engine with the{' '}
        <code>dateOnlyConfig</code> preset: trip rules zeroed, so only the{' '}
        <code>window</code> and <code>blocks</code> gate selection.
      </p>

      <DemoFrame hint='past-only: tomorrow onward is disabled by window.max'>
        <MaintenanceDate />
      </DemoFrame>

      <h2>How to use it</h2>
      <ol>
        <li>
          <strong>Hold a <code>DayValue</code> in state</strong> —{' '}
          <code>DayKey | null</code>. Store the string as-is; never round-trip
          it through a <code>Date</code>.
        </li>
        <li>
          <strong>Bound selection with <code>window</code></strong>. Each
          side replaces a now-derived bound: <code>min</code> in the past
          makes past days selectable (they are disabled by default);{' '}
          <code>max = endOfDay(todayKey, zone)</code> disables the future.
          The demo above allows the last 90 days through today.
        </li>
        <li>
          <strong>Selection closes the picker</strong> — a single-date pick
          is one decision, so a valid click commits and closes.
        </li>
      </ol>

      <h2>Code</h2>
      <CodeBlock
        code={readDemoSource('maintenance-date.tsx')}
        title='components/demos/maintenance-date.tsx'
      />

      <h2>Why the value is a string</h2>
      <CodeBlock code={WHY_STRINGS} lang='ts' title='why-strings.ts' />

      <h2>Props</h2>
      <PropsTable
        rows={[
          { name: 'timeZone', type: 'string', description: 'IANA display zone — decides where days begin/end.', required: true },
          { name: 'value', type: 'DayKey | null', description: "'yyyy-MM-dd' string. Controlled.", required: true },
          { name: 'onChange', type: '(value: DayKey | null) => void', description: 'Fires on pick (and clear).', required: true },
          { name: 'window', type: '{ min?: Instant; max?: Instant }', description: 'Selectable bounds; each side replaces its now-derived default.' },
          { name: 'blocks', type: 'RawBlockInput[]', default: '[]', description: 'Days fully covered by blocks become unselectable (with a reason).' },
          { name: 'now', type: 'Instant', default: 'Date.now()', description: 'Injectable clock — useful in tests and SSR snapshots.' },
          { name: 'label', type: 'string', default: "'Date'", description: 'Trigger label.' },
          { name: 'placeholder', type: 'string', default: "'Select date'", description: 'Empty-state text.' },
          { name: 'error', type: 'string', description: 'Form-level error line under the trigger (red).' },
          { name: 'disabled / disabledReason', type: 'boolean / string', description: 'Grey out + explain.' },
          { name: 'mobileBreakpointPx', type: 'number', default: '768', description: 'Drawer below this width.' },
          { name: 'className', type: 'string', description: 'Extra classes on the trigger wrapper.' },
        ]}
      />

      <h2>Variation — form validation</h2>
      <CodeBlock code={FORM_ERROR} title='with-form-error.tsx' />

      <Callout type='warn' title='The classic off-by-one bug'>
        <p>
          If a day ever &quot;shifts&quot; in your app, you converted a{' '}
          <code>DayKey</code> through a <code>Date</code> in the wrong zone.
          Keep day keys as strings end-to-end; convert only at boundaries
          with <code>dayStart</code> / <code>endOfDay</code> — see{' '}
          <a href='/docs/core-concepts'>core concepts</a>.
        </p>
      </Callout>
    </DocPage>
  )
}
