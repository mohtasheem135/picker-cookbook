import type { Metadata } from 'next'

import { SingleAnchor } from '@/components/demos/single-anchor'
import { SingleMinute } from '@/components/demos/single-minute'
import { SingleSlots } from '@/components/demos/single-slots'
import { Callout } from '@/components/site/callout'
import { CodeBlock } from '@/components/site/code-block'
import { DemoFrame } from '@/components/site/demo-frame'
import { DocPage } from '@/components/site/doc-page'
import { PropsTable } from '@/components/site/props-table'
import { readDemoSource } from '@/lib/source'

export const metadata: Metadata = { title: 'SingleDateTimePicker' }

export default function Page() {
  return (
    <DocPage slug='single-date-time-picker'>
      <p>
        One date + one time, emitting a single <code>Instant | null</code>.
        Two precisions share the component: <code>&apos;slots&apos;</code>{' '}
        (default — a 30-minute slot column, same grid as the booking picker)
        and <code>&apos;minute&apos;</code> (hour/minute selects for exact
        entry, e.g. &quot;what time was it actually returned&quot;). By
        default it uses the <code>singleInstantConfig</code> preset: no
        minimum-duration or lead-time rules — only the window and blocks gate
        the instant.
      </p>

      <h2>Precision: slots</h2>
      <DemoFrame hint='same demo blocks as the booking page — blocked days explain themselves'>
        <SingleSlots />
      </DemoFrame>
      <CodeBlock
        code={readDemoSource('single-slots.tsx')}
        title='components/demos/single-slots.tsx'
      />

      <h2>Precision: minute — with a past-open window</h2>
      <p>
        Recording something that already happened means past instants must be
        valid. Setting <code>config.window.min</code> into the past replaces
        the now-derived lower bound (<a href='/docs/engine-config'>how
        windows work</a>):
      </p>
      <DemoFrame hint='past dates are selectable here — try yesterday'>
        <SingleMinute />
      </DemoFrame>
      <CodeBlock
        code={readDemoSource('single-minute.tsx')}
        title='components/demos/single-minute.tsx'
      />

      <h2>rangeAnchor — pick a new trip end</h2>
      <p>
        With <code>rangeAnchor</code> (a fixed trip start), the value becomes
        a <strong>trip end</strong>: days and slots clamp to the availability
        window after the anchor, minimum duration applies, and the verdict is
        full-trip validity (<code>validateRange(anchor, value)</code>). This
        is the &quot;edit trip / extend trip&quot; building block.
      </p>
      <DemoFrame hint='the trip start is fixed 2 days out; you are picking the end'>
        <SingleAnchor />
      </DemoFrame>
      <CodeBlock
        code={readDemoSource('single-anchor.tsx')}
        title='components/demos/single-anchor.tsx'
      />

      <h2>Props</h2>
      <PropsTable
        rows={[
          { name: 'timeZone', type: 'string', description: 'IANA display zone.', required: true },
          { name: 'value', type: 'Instant | null', description: 'UTC epoch ms. Controlled.', required: true },
          { name: 'onChange', type: '(value, { verdict }) => void', description: 'verdict is null when value is null; with rangeAnchor it validates the whole trip.', required: true },
          { name: 'blocks', type: 'RawBlockInput[]', default: '[]', description: 'Unavailable periods.' },
          { name: 'precision', type: "'slots' | 'minute'", default: "'slots'", description: '30-min slot column vs exact hour/minute selects.' },
          { name: 'rangeAnchor', type: 'Instant', description: 'Fixed trip start — value becomes the trip END.' },
          { name: 'config', type: "Partial<Omit<EngineConfig, 'timeZone'>>", description: 'Merged over the singleInstantConfig preset (trip rules zeroed).' },
          { name: 'label', type: 'string', default: "'Date & time'", description: 'Trigger label.' },
          { name: 'placeholder', type: 'string', default: "'Add date & time'", description: 'Empty-state text.' },
          { name: 'disabled / disabledReason', type: 'boolean / string', description: 'Grey out + explain.' },
          { name: 'onIssues', type: '(issues: BlockParseIssue[]) => void', description: 'Malformed block reports.' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Open/close callback.' },
          { name: 'mobileBreakpointPx', type: 'number', default: '768', description: 'Drawer below this width.' },
          { name: 'className', type: 'string', description: 'Extra classes on the trigger wrapper.' },
        ]}
      />

      <h2>Gotchas</h2>
      <ul>
        <li>
          Without <code>rangeAnchor</code>, validation is{' '}
          <code>validateInstant</code>: window + blocks only. With it, the
          minimum-duration rule returns (<code>TOO_SHORT</code> before{' '}
          <code>anchor + minRentalMinutes</code>).
        </li>
        <li>
          In <code>&apos;minute&apos;</code> precision the calendar still
          gates <em>days</em> through the engine — exact-minute entry cannot
          land inside a block either.
        </li>
      </ul>

      <Callout type='tip' title='Which single-value picker?'>
        <p>
          Need a time? This component. Date only?{' '}
          <a href='/docs/single-date-picker'>SingleDatePicker</a> — its value
          is a zone-unambiguous <code>DayKey</code> string, not an instant.
        </p>
      </Callout>
    </DocPage>
  )
}
