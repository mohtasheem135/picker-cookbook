import type { Metadata } from 'next'

import { Playground } from '@/components/demos/playground'
import { Callout } from '@/components/site/callout'
import { CodeBlock } from '@/components/site/code-block'
import { DemoFrame } from '@/components/site/demo-frame'
import { DocPage } from '@/components/site/doc-page'
import { readDemoSource } from '@/lib/source'

export const metadata: Metadata = { title: 'Playground' }

export default function Page() {
  return (
    <DocPage slug='playground'>
      <p>
        A live sandbox for all four styled components. Pick a component, then
        flip its real props — <code>valueFormat</code>, <code>timeZone</code>,{' '}
        <code>precision</code>, <code>showFooter</code>, <code>disabled</code>,
        and whether demo <code>blocks</code> are applied. Three things update in
        lockstep: the running picker, the exact code that renders it, and{' '}
        <strong>precisely what <code>onChange</code> hands back</strong> in the
        format you chose.
      </p>

      <DemoFrame hint='every control maps to a real prop — nothing here is a demo-only mode'>
        <Playground />
      </DemoFrame>

      <h2>What exactly is returned?</h2>
      <p>
        That is what the <code>valueFormat</code> control answers. Every
        component is generic over its wire format, so <code>value</code> and{' '}
        <code>onChange</code> speak whatever you pick — the engine still computes
        over UTC epoch milliseconds internally:
      </p>
      <ul>
        <li>
          <code>&apos;day-key&apos;</code> (date-only default) — a{' '}
          <code>&apos;yyyy-MM-dd&apos;</code> string, zone-independent.
        </li>
        <li>
          <code>&apos;epoch-ms&apos;</code> (date+time default) — a{' '}
          <code>number</code> of milliseconds since the Unix epoch.
        </li>
        <li>
          <code>&apos;epoch-seconds&apos;</code> — a <code>number</code> of
          seconds (÷1000 of epoch-ms).
        </li>
        <li>
          <code>&apos;iso&apos;</code> — an ISO-8601 <code>string</code>.
        </li>
      </ul>
      <p>
        The &quot;What onChange returned&quot; panel under the picker shows the
        raw value, its <code>typeof</code>, and a human-readable decoding, so
        you can see the type change the moment you switch formats. Date-only
        instant formats encode the day&apos;s <em>start</em> in the selected
        zone.
      </p>

      <h2>Code</h2>
      <p>
        The playground itself is one client component. It holds a value per
        picker in state and passes the selected <code>valueFormat</code>{' '}
        straight through — the same three-line controlled pattern you would
        write in your own app:
      </p>
      <CodeBlock
        code={readDemoSource('playground.tsx')}
        title='components/demos/playground.tsx'
      />

      <Callout type='tip' title='Reading the generated snippet'>
        <p>
          The <code>your-app.tsx</code> block above the return panel is
          generated from the current controls — copy it as a starting point.
          It omits props left at their defaults (a missing{' '}
          <code>showFooter</code> means <code>true</code>), which is exactly how
          you would write it.
        </p>
      </Callout>

      <Callout type='warn' title='Switching format clears the value'>
        <p>
          A value held in one wire format is not valid in another, so the
          playground resets the selection to <code>null</code> when you change{' '}
          <code>valueFormat</code>. In a real app you pick one format up front
          and keep it.
        </p>
      </Callout>
    </DocPage>
  )
}
