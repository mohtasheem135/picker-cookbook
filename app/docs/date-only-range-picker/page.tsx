import type { Metadata } from 'next'

import { FilterRange } from '@/components/demos/filter-range'
import { Callout } from '@/components/site/callout'
import { CodeBlock } from '@/components/site/code-block'
import { DemoFrame } from '@/components/site/demo-frame'
import { DocPage } from '@/components/site/doc-page'
import { PropsTable } from '@/components/site/props-table'
import { readDemoSource } from '@/lib/source'

export const metadata: Metadata = { title: 'DateOnlyRangePicker' }

const BOUNDARY_MATH = `import { dayStart, endOfDay } from 'availability-datetime-picker'

// Interpret a DayRangeValue as whole days at the boundary — in the
// resource's zone, exactly once, in your adapter:
function rangeToInstants(range: { from: string; to: string }, zone: string) {
  return {
    fromMs: dayStart(range.from, zone),   // 00:00:00.000 on the from-day
    toMs: endOfDay(range.to, zone),       // 23:59:59.999 on the to-day
  }
}`

export default function Page() {
  return (
    <DocPage slug='date-only-range-picker'>
      <p>
        A date range without times — list filters, report ranges,
        lodging-style check-in/check-out. The value is a{' '}
        <code>DayRangeValue</code>: <code>{'{ from, to }'}</code>, both{' '}
        <code>DayKey | null</code> strings. Like{' '}
        <a href='/docs/single-date-picker'>SingleDatePicker</a> it runs the{' '}
        <code>dateOnlyConfig</code> preset — window + blocks only.
      </p>

      <DemoFrame hint='pick a start, then an end — the “applied filter” only updates when complete'>
        <FilterRange />
      </DemoFrame>

      <h2>How to use it</h2>
      <ol>
        <li>
          <strong>Hold <code>{'{ from, to }'}</code> in state.</strong> The
          picker fills <code>from</code> first, then <code>to</code>;
          clicking a day before the current <code>from</code> restarts the
          range there.
        </li>
        <li>
          <strong>Act on <code>meta.complete</code>.</strong>{' '}
          <code>onChange</code> fires on every edit; apply your filter or
          query only when <code>complete</code> is <code>true</code> — the
          demo&apos;s &quot;applied filter&quot; row shows the difference
          between the live value and the applied one.
        </li>
        <li>
          <strong>Convert at the boundary, once.</strong> When an API wants
          instants, expand the day keys in your adapter:
        </li>
      </ol>
      <CodeBlock code={BOUNDARY_MATH} lang='ts' title='range-to-instants.ts' />

      <h2>Code</h2>
      <CodeBlock
        code={readDemoSource('filter-range.tsx')}
        title='components/demos/filter-range.tsx'
      />

      <h2>Props</h2>
      <PropsTable
        rows={[
          { name: 'timeZone', type: 'string', description: 'IANA display zone.', required: true },
          { name: 'value', type: '{ from: DayKey | null; to: DayKey | null }', description: 'Controlled range value.', required: true },
          { name: 'onChange', type: '(value, { complete }) => void', description: 'complete is true once both ends are set.', required: true },
          { name: 'window', type: '{ min?: Instant; max?: Instant }', description: 'Selectable bounds; each side replaces its now-derived default.' },
          { name: 'blocks', type: 'RawBlockInput[]', default: '[]', description: 'Fully-blocked days are unselectable and explain why on tap.' },
          { name: 'now', type: 'Instant', default: 'Date.now()', description: 'Injectable clock.' },
          { name: 'labels', type: '{ from?, to? }', default: "'From' / 'To'", description: 'Trigger field labels.' },
          { name: 'disabled / disabledReason', type: 'boolean / string', description: 'Grey out + explain.' },
          { name: 'mobileBreakpointPx', type: 'number', default: '768', description: 'Drawer below this width.' },
          { name: 'tabletBreakpointPx', type: 'number', default: '1024', description: 'One month instead of two below this width.' },
          { name: 'className', type: 'string', description: 'Extra classes on the trigger wrapper.' },
        ]}
      />

      <h2>Gotchas</h2>
      <ul>
        <li>
          This is a <strong>date</strong> range — if the product needs
          pickup/return <em>times</em>, use{' '}
          <a href='/docs/booking-date-time-picker'>BookingDateTimePicker</a>{' '}
          instead of bolting times onto this one.
        </li>
        <li>
          Nights math: for lodging, a range of <code>from</code>{' '}
          <code>2026-08-10</code> to <code>2026-08-12</code> is 2 nights —
          checkout day itself needs no availability, which mirrors the
          engine&apos;s half-open block semantics.
        </li>
      </ul>

      <Callout type='tip' title='Filters usually want the past'>
        <p>
          The default window disallows past days. For a history filter, pass{' '}
          <code>window=&#123;&#123; min: 0 &#125;&#125;</code> (or any early
          instant) to open the entire past.
        </p>
      </Callout>
    </DocPage>
  )
}
