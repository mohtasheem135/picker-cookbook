import type { Metadata } from 'next'

import { ConfigPlayground } from '@/components/demos/config-playground'
import { Callout } from '@/components/site/callout'
import { CodeBlock } from '@/components/site/code-block'
import { DemoFrame } from '@/components/site/demo-frame'
import { DocPage } from '@/components/site/doc-page'
import { PropsTable } from '@/components/site/props-table'
import { readDemoSource } from '@/lib/source'

export const metadata: Metadata = { title: 'Engine config' }

const WINDOW_SNIPPET = `// window.min / window.max REPLACE the now-derived bounds:
//   min replaces  now + leadTimeMinutes   (so a past min = past allowed)
//   max replaces  now + maxAdvanceDays    (so max = end of today disables the future)

// Past-only date field:
<SingleDatePicker window={{ max: endOfDay(todayKey, zone) }} … />

// Extend-only return picker (nothing before the current return):
<SingleDateTimePicker config={{ window: { min: currentReturnMs } }} … />`

const PRESETS = `import { dateOnlyConfig, singleInstantConfig } from 'availability-datetime-picker/core'

// Both presets zero the trip rules (minRental / leadTime / turnaround) so
// only the window and blocks gate selection. The styled non-booking
// components apply them for you; reach for them directly with the hooks.
dateOnlyConfig({ timeZone, window })            // date-only surfaces
singleInstantConfig({ timeZone, window })       // single-instant surfaces`

export default function Page() {
  return (
    <DocPage slug='engine-config'>
      <p>
        One <code>EngineConfig</code> object tunes every rule the engine
        enforces. The styled components accept it as <code>config</code>{' '}
        (minus <code>timeZone</code>, which is its own prop); the hooks and{' '}
        <code>createAvailabilityEngine</code> take it whole.
      </p>

      <h2>The knobs, live</h2>
      <DemoFrame hint='change a knob, reopen the picker, watch days and slots re-derive'>
        <ConfigPlayground />
      </DemoFrame>
      <CodeBlock
        code={readDemoSource('config-playground.tsx')}
        title='components/demos/config-playground.tsx'
      />

      <h2>Reference</h2>
      <PropsTable
        title='EngineConfig'
        rows={[
          { name: 'timeZone', type: 'string', description: 'IANA display zone (day boundaries + labels — never conversion).', required: true },
          { name: 'now', type: 'Instant', default: 'Date.now()', description: 'Injectable clock — deterministic tests and SSR snapshots.' },
          { name: 'minRentalMinutes', type: 'number', default: '420 (7 h)', description: 'Shortest allowed trip. Shorter ranges fail TOO_SHORT; return slots under it disable with min-duration; pickup slots disable up front if no valid trip fits before the next block.' },
          { name: 'slotIntervalMinutes', type: 'number', default: '30', description: 'Selectable tick size — pickup/return land on this wall-clock grid; suggestions search on it.' },
          { name: 'leadTimeMinutes', type: 'number', default: '60', description: 'Earliest pickup = now + this. Earlier slots disable with lead-time; earlier ranges fail LEAD_TIME.' },
          { name: 'turnaroundMinutes', type: 'number', default: '0', description: 'Gap required between a trip and any block, both sides. 0 = back-to-back allowed (half-open exactness).' },
          { name: 'maxAdvanceDays', type: 'number', default: '365', description: 'Booking horizon from now. Later days disable; later ranges fail BEYOND_MAX_ADVANCE.' },
          { name: 'window', type: '{ min?: Instant; max?: Instant }', description: 'Explicit selectable window — each side REPLACES its now-derived bound. Violations report outside-window / OUTSIDE_WINDOW.' },
        ]}
      />

      <Callout type='tip' title='Override, don’t re-hardcode'>
        <p>
          Pass a <code>config</code> override per resource instead of copying
          these numbers around. <code>ENGINE_DEFAULTS</code> is exported from{' '}
          <code>/core</code> if you need to display the defaults.
        </p>
      </Callout>

      <h2>Selection windows</h2>
      <p>
        <code>window</code> is how non-booking modes express &quot;past
        allowed&quot; or &quot;future disabled&quot; — each provided side
        replaces the corresponding now-derived bound entirely:
      </p>
      <CodeBlock code={WINDOW_SNIPPET} title='windows.tsx' />

      <h2>Presets</h2>
      <CodeBlock code={PRESETS} lang='ts' title='presets.ts' />

      <h2>Gotchas</h2>
      <ul>
        <li>
          <strong>Memoize the config object.</strong> The engine rebuilds
          when <code>config</code> changes identity — a fresh object literal
          every render defeats the memo. Module constant or{' '}
          <code>useMemo</code>.
        </li>
        <li>
          The booking components default <code>now</code> at engine creation
          — if a picker stays mounted for hours, re-mount or re-key it (or
          pass <code>now</code>) so &quot;today&quot; doesn&apos;t go stale.
        </li>
      </ul>
    </DocPage>
  )
}
