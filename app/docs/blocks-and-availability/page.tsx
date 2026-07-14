import type { Metadata } from 'next'

import { BlocksDemo } from '@/components/demos/blocks-demo'
import { Callout } from '@/components/site/callout'
import { CodeBlock } from '@/components/site/code-block'
import { DemoFrame } from '@/components/site/demo-frame'
import { DocPage } from '@/components/site/doc-page'
import { PropsTable } from '@/components/site/props-table'
import { readDemoSource } from '@/lib/source'

export const metadata: Metadata = { title: 'Blocks & availability' }

const MAPPING = `import type { BlockKind, RawBlockInput } from 'availability-datetime-picker'

// Map YOUR API payload to RawBlockInput in one adapter — this is the only
// place unit conversion and end-semantics decisions belong.
function toBlocks(apiRows: ApiUnavailability[]): RawBlockInput[] {
  return apiRows.map(row => ({
    id: row.uuid,
    startMs: row.start_epoch_s * 1000,        // your API's seconds → ms, once
    endMs: (row.end_epoch_s + 1) * 1000,       // API means inclusive-end? make it half-open HERE
    kind: (row.source as BlockKind) ?? 'unknown',
    label: row.reason ?? undefined,            // shown when the user taps the day
  }))
}`

const PARSE_SERVER = `// parseRawBlocks / mergeBlocks are also exported from '/core' for
// server-side hygiene checks on untrusted payloads:
import { mergeBlocks, parseRawBlocks } from 'availability-datetime-picker/core'

const { blocks, issues } = parseRawBlocks(untrustedInput)
if (issues.length) log.warn('dropped malformed blocks', issues)
const intervals = mergeBlocks(blocks) // overlapping/adjacent → merged, sources retained`

export default function Page() {
  return (
    <DocPage slug='blocks-and-availability'>
      <p>
        Blocks are the availability input to everything: day states, slot
        lists, verdicts, and suggestions all derive from one{' '}
        <code>RawBlockInput[]</code>. This page covers the input shape, the
        half-open boundary rule, turnaround gaps, and what happens to
        malformed input.
      </p>

      <h2>The input shape</h2>
      <PropsTable
        title='RawBlockInput'
        rows={[
          { name: 'id', type: 'string', description: 'Stable identifier — used in parse-issue reports and reason display.', required: true },
          { name: 'startMs', type: 'number', description: 'UTC epoch ms — first blocked instant.', required: true },
          { name: 'endMs', type: 'number', description: 'UTC epoch ms — first FREE instant (half-open).', required: true },
          { name: 'kind', type: "'booking' | 'host' | 'maintenance' | 'snooze' | 'external' | 'unknown'", description: 'Why the period is blocked; drives the reason copy.', required: true },
          { name: 'label', type: 'string', description: 'Human-readable reason, e.g. “Booked by another guest”.' },
        ]}
      />
      <CodeBlock code={MAPPING} lang='ts' title='blocks-adapter.ts' />

      <h2>Half-open boundaries + turnaround, live</h2>
      <p>
        The demo&apos;s calendar has a booked trip ending at exactly
        10:00&nbsp;AM. Open the picker on that day: with{' '}
        <code>turnaroundMinutes: 0</code> the 10:00&nbsp;AM slot is{' '}
        <strong>selectable</strong> — <code>[start, end)</code> means the
        resource is free at the end instant, so back-to-back trips are exact.
        Switch the turnaround to 60 or 120 and the boundary slots disable to
        leave a cleaning gap.
      </p>
      <DemoFrame hint='open the picker on the day the trip ends, then change the turnaround'>
        <BlocksDemo />
      </DemoFrame>
      <CodeBlock
        code={readDemoSource('blocks-demo.tsx')}
        title='components/demos/blocks-demo.tsx'
      />

      <h2>Malformed input never throws</h2>
      <p>
        The blocks array above deliberately includes an inverted entry
        (<code>endMs</code> before <code>startMs</code>). The engine&apos;s
        parser (<code>parseRawBlocks</code>) drops it, keeps the valid
        blocks, and reports the rejects — surfaced through the{' '}
        <code>onIssues</code> prop in the inspector. Problems reported:{' '}
        <code>&apos;inverted&apos;</code>,{' '}
        <code>&apos;non-finite&apos;</code>,{' '}
        <code>&apos;missing-field&apos;</code>.
      </p>
      <CodeBlock code={PARSE_SERVER} lang='ts' title='server-hygiene.ts' />

      <Callout type='warn' title='The end-semantics contract is yours'>
        <p>
          The engine assumes half-open everywhere and cannot detect a backend
          that means &quot;blocked through the end day&quot;. Fix it in your
          adapter (extend <code>endMs</code>), never by fudging block data
          downstream. See <a href='/docs/core-concepts'>core concepts</a>.
        </p>
      </Callout>

      <h2>Related</h2>
      <ul>
        <li>
          <a href='/docs/engine-config'>Engine config</a> — turnaround, lead
          time, and the other knobs the demo touched.
        </li>
        <li>
          <a href='/docs/day-states-and-anti-wipe'>Day states</a> — how
          blocks become the five calendar day statuses.
        </li>
      </ul>
    </DocPage>
  )
}
