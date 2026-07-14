import type { Metadata } from 'next'

import { Callout } from '@/components/site/callout'
import { CodeBlock } from '@/components/site/code-block'
import { DocPage } from '@/components/site/doc-page'

export const metadata: Metadata = { title: 'Performance & bundle size' }

const SERVER_ONLY = `// Server-side validation costs 7.9 KB gz and pulls ZERO React:
import { createAvailabilityEngine } from 'availability-datetime-picker/core'`

const MEMO = `// The engine rebuilds whenever \`blocks\` or \`config\` change IDENTITY.
// Stable references = zero wasted work:
const blocks = useMemo(() => mapApiBlocks(data), [data])
const config = useMemo(() => ({ minRentalMinutes: 1440 }), [])

<BookingDateTimePicker blocks={blocks} config={config} … />`

export default function Page() {
  return (
    <DocPage slug='performance'>
      <p>
        All numbers below are <strong>measured</strong>, not estimated — from
        the packed v0.1.0 artifact this site installs, and from benchmarks
        run against it (Node 24, Apple Silicon). Re-measure after package
        changes; the commands live in{' '}
        <code>docs/TEST-LOG.md</code>&apos;s methodology rows.
      </p>

      <h2>What ships (the packed artifact)</h2>
      <table>
        <thead>
          <tr><th>Artifact</th><th>Raw</th><th>Gzip</th><th>Notes</th></tr>
        </thead>
        <tbody>
          <tr><td>npm tarball (everything)</td><td>48.3 KB</td><td>—</td><td>79 files, <code>dist/</code> only</td></tr>
          <tr><td>All JavaScript (components + hooks + engine)</td><td>96.8 KB</td><td><strong>21.6 KB</strong></td><td>upper bound — ESM, tree-shakeable per import</td></tr>
          <tr><td><code>/core</code> subpath alone (engine, no React)</td><td>29.6 KB</td><td><strong>7.7 KB</strong></td><td>what a server/route handler pays</td></tr>
          <tr><td><code>styles.css</code></td><td>13.7 KB</td><td><strong>3.3 KB</strong></td><td>one sheet, all components, zero runtime CSS-in-JS</td></tr>
          <tr><td>TypeScript declarations</td><td>41.2 KB</td><td>—</td><td>never shipped to browsers</td></tr>
        </tbody>
      </table>

      <h2>Dependency impact</h2>
      <p>
        Five runtime dependencies. Disk size in <code>node_modules</code> is
        <em> not</em> what your users download — all five are ESM and
        tree-shaken; the 21.6 KB gz figure above is the package&apos;s own
        code, and your bundler adds only the parts of these deps the
        components actually import:
      </p>
      <table>
        <thead>
          <tr><th>Dependency</th><th>node_modules</th><th>Why it exists</th><th>Loaded when</th></tr>
        </thead>
        <tbody>
          <tr><td><code>react-day-picker</code></td><td>~5.0 MB (mostly locale data your bundler drops)</td><td>calendar grid, zone-aware day cells</td><td>any styled picker</td></tr>
          <tr><td><code>@radix-ui/react-popover</code></td><td>~112 KB</td><td>desktop shell + slot-hint tap popover</td><td>any styled picker</td></tr>
          <tr><td><code>@radix-ui/react-tooltip</code></td><td>~152 KB</td><td>slot-hint hover tooltip</td><td>date+time pickers</td></tr>
          <tr><td><code>vaul</code></td><td>~196 KB</td><td>mobile bottom-sheet drawer</td><td>any styled picker</td></tr>
          <tr><td><code>@date-fns/tz</code></td><td>~200 KB</td><td>IANA zone math (no bundled tz database — uses the browser&apos;s <code>Intl</code>)</td><td>everything, incl. /core</td></tr>
        </tbody>
      </table>
      <p>
        Using only the <strong>headless hooks</strong> pulls the engine +
        hook code and none of the four UI dependencies. Using only{' '}
        <strong><code>/core</code></strong> pulls <code>@date-fns/tz</code>{' '}
        and nothing else:
      </p>
      <CodeBlock code={SERVER_ONLY} lang='ts' title='server-cost.ts' />

      <h2>Whole-app reality check</h2>
      <p>
        This entire 18-page docs site — every component mounted across its
        demos, Next.js 16 runtime included — builds to{' '}
        <strong>~318 KB gz of total client JavaScript</strong> (1,020 KB
        raw), shared across routes via chunking. A single product page
        embedding one picker pays a small fraction of that.
      </p>

      <h2>Engine benchmarks (measured)</h2>
      <table>
        <thead>
          <tr><th>Operation</th><th>Cost</th><th>Context</th></tr>
        </thead>
        <tbody>
          <tr><td><code>createAvailabilityEngine</code> with 100 blocks</td><td><strong>~0.016 ms</strong></td><td>parse + merge, averaged over 1,000 builds</td></tr>
          <tr><td><code>dayInfo(day)</code></td><td>~0.002 ms/call</td><td>365 calls in 0.7 ms — a whole year classifies in under a millisecond</td></tr>
          <tr><td><code>pickupSlots(day)</code> (48 slots)</td><td>~0.08 ms/call</td><td>one open slot column</td></tr>
          <tr><td><code>validateRange(pickup, ret)</code></td><td>~0.0006 ms/call</td><td>10,000 validations in 5.9 ms — validate on every keystroke if you like</td></tr>
        </tbody>
      </table>
      <p>
        Block parsing/merging is <code>O(n log n)</code> in block count;
        day classification and slot enumeration scan the merged intervals.
        Even hundreds of blocks are far below any human-perceptible
        threshold.
      </p>

      <h2>Render-path characteristics</h2>
      <ul>
        <li>
          <strong>One memoized engine per picker</strong>, rebuilt only when{' '}
          <code>blocks</code>/<code>config</code> change identity — keep them
          referentially stable:
        </li>
      </ul>
      <CodeBlock code={MEMO} title='memoize.tsx' />
      <ul>
        <li>
          <strong>Nothing runs while closed.</strong> No timers, no
          subscriptions, no background work — cost is confined to open
          pickers and prop changes.
        </li>
        <li>
          <strong>Calendar cells derive from the engine per render</strong>{' '}
          of the open popover only; the trigger fields render O(1).
        </li>
        <li>
          <strong>SSR-friendly:</strong> components render their triggers on
          the server (popovers/drawers mount closed); <code>/core</code> has
          no <code>&apos;use client&apos;</code>, so server validation adds
          zero client JS.
        </li>
        <li>
          <strong>CSS is static:</strong> one 3.3 KB gz sheet; theming is
          CSS-custom-property indirection — retheming triggers zero JS.
        </li>
      </ul>

      <h2>What to watch in your integration</h2>
      <ul>
        <li>
          Recreating <code>blocks</code>/<code>config</code> objects inline
          on every render — correct but wasteful (engine rebuild per
          keystroke of unrelated state).
        </li>
        <li>
          Very large block arrays (thousands): parsing stays fast, but
          consider merging server-side (<code>mergeBlocks</code>) and
          sending only the window the calendar can reach
          (<code>maxAdvanceDays</code>).
        </li>
        <li>
          The ESM-only build means no accidental double-shipping of CJS+ESM
          copies — one module graph.
        </li>
      </ul>

      <Callout type='tip' title='Methodology'>
        <p>
          Sizes: <code>wc -c</code> / <code>gzip -9</code> over the installed
          tarball&apos;s <code>dist/</code>. Benchmarks:{' '}
          <code>performance.now()</code> loops via Node against{' '}
          <code>availability-datetime-picker/core</code>. App total: gzip
          over <code>.next/static/chunks</code> after{' '}
          <code>next build</code>. All logged in{' '}
          <code>docs/TEST-LOG.md</code>.
        </p>
      </Callout>
    </DocPage>
  )
}
