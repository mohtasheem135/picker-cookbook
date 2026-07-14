import fs from 'node:fs'
import path from 'node:path'

import type { Metadata } from 'next'

import { ValidateQuote } from '@/components/demos/validate-quote'
import { Callout } from '@/components/site/callout'
import { CodeBlock } from '@/components/site/code-block'
import { DemoFrame } from '@/components/site/demo-frame'
import { DocPage } from '@/components/site/doc-page'
import { readDemoSource } from '@/lib/source'

export const metadata: Metadata = { title: 'Server-side validation' }

const DEEP_LINK = `// URL-as-projection: hydrate a picker from a deep link, but let the
// verdict decide what renders — never trust the link.
const pickup = Number(searchParams.get('pickup'))
const ret = Number(searchParams.get('ret'))

const engine = createAvailabilityEngine(blocks, { timeZone })
const verdict = engine.validateRange(pickup, ret)

const initial: BookingValue = verdict.ok
  ? { pickup, ret }                       // valid → hydrate as-is
  : { pickup: null, ret: null }           // invalid → start empty + offer
const offer = verdict.ok ? null : engine.suggestNearestWindow({ pickup, ret })`

export default function Page() {
  const routeSource = fs.readFileSync(
    path.join(process.cwd(), 'app', 'api', 'quote', 'route.ts'),
    'utf8',
  )

  return (
    <DocPage slug='server-side-validation'>
      <p>
        The calendar can gate every click, but a request body can say
        anything. The <code>/core</code> subpath ships the engine with{' '}
        <strong>zero React and zero <code>&apos;use client&apos;</code>{' '}
        directives</strong>, so the exact rules that drove the UI re-run in a
        Route Handler, a server action, or any Node/edge process — one
        engine, no drift between what the UI allowed and what the server
        accepts.
      </p>

      <h2>Live: the server rejects what the UI would never allow</h2>
      <p>
        Both buttons bypass the picker entirely and POST raw epoch numbers to{' '}
        <code>/api/quote</code>. The second range lands inside the demo
        calendar&apos;s booked trip — the server answers 422 with structured{' '}
        <code>violations</code>:
      </p>
      <DemoFrame hint='this hits a real Route Handler in this app'>
        <ValidateQuote />
      </DemoFrame>

      <h2>The Route Handler</h2>
      <CodeBlock code={routeSource} lang='ts' title='app/api/quote/route.ts' />
      <p>And the client that calls it:</p>
      <CodeBlock
        code={readDemoSource('validate-quote.tsx')}
        title='components/demos/validate-quote.tsx'
      />

      <h2>Violation codes</h2>
      <table>
        <thead>
          <tr><th>Code</th><th>The range…</th></tr>
        </thead>
        <tbody>
          <tr><td><code>OVERLAPS_BLOCKS</code></td><td>intersects one or more blocks — <code>violation.blocks</code> lists every offender.</td></tr>
          <tr><td><code>TOO_SHORT</code></td><td>is shorter than <code>minRentalMinutes</code>.</td></tr>
          <tr><td><code>START_IN_PAST</code></td><td>starts before now.</td></tr>
          <tr><td><code>LEAD_TIME</code></td><td>starts before <code>now + leadTimeMinutes</code>.</td></tr>
          <tr><td><code>INVERTED</code></td><td>ends before it starts.</td></tr>
          <tr><td><code>BEYOND_MAX_ADVANCE</code></td><td>ends past the booking horizon.</td></tr>
          <tr><td><code>OUTSIDE_WINDOW</code></td><td>violates an explicit <code>window.min/max</code>.</td></tr>
        </tbody>
      </table>
      <p>
        Single instants (no range) validate with{' '}
        <code>engine.validateInstant(instant)</code> and use the same codes.
      </p>

      <h2>Deep links: validate before hydrating</h2>
      <CodeBlock code={DEEP_LINK} title='deep-link.tsx' />

      <Callout type='warn' title='Match the config on both sides'>
        <p>
          The server engine must be built with the <em>same</em> blocks and
          config as the client&apos;s (source both from the same API/DB).
          Different <code>minRentalMinutes</code> on the two sides means the
          UI and server disagree — the exact bug this architecture exists to
          prevent.
        </p>
      </Callout>

      <Callout type='info' title='RSC-safe by construction'>
        <p>
          Importing <code>availability-datetime-picker/core</code> in a
          server component or route pulls no client code: the package build
          runs a guard that fails if a <code>&apos;use client&apos;</code>{' '}
          directive ever leaks into <code>dist/core</code>.
        </p>
      </Callout>
    </DocPage>
  )
}
