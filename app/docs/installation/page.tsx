import type { Metadata } from 'next'

import { FirstPicker } from '@/components/demos/first-picker'
import { Callout } from '@/components/site/callout'
import { CodeBlock } from '@/components/site/code-block'
import { DemoFrame } from '@/components/site/demo-frame'
import { DocPage } from '@/components/site/doc-page'
import { readDemoSource } from '@/lib/source'

export const metadata: Metadata = { title: 'Installation' }

const INSTALL = `npm install availability-datetime-picker`

const STYLES_IMPORT = `// app/layout.tsx (Next.js) — or your app entry (Vite: main.tsx)
import 'availability-datetime-picker/styles.css'`

export default function Page() {
  return (
    <DocPage slug='installation'>
      <h2>1. Install the package</h2>
      <p>
        The package needs <code>react</code> and <code>react-dom</code> 18 or
        19 as peer dependencies — everything else (calendar, popover, drawer,
        timezone math) is bundled.
      </p>
      <CodeBlock code={INSTALL} lang='bash' title='terminal' />
      <Callout type='warn' title='ESM only'>
        <p>
          The package ships as ESM with no CommonJS build. Every modern
          bundler (Next.js, Vite, Remix, webpack 5) handles this out of the
          box; a legacy <code>require()</code> pipeline will not.
        </p>
      </Callout>

      <h2>2. Load the stylesheet once</h2>
      <p>
        All components share one prebuilt, namespaced stylesheet. Import it a
        single time at the top of your app — it is ~10&nbsp;KB minified, uses
        only <code>bdp-</code>-prefixed classes, and cannot collide with your
        own CSS (Tailwind or otherwise). Your app needs no CSS framework.
      </p>
      <CodeBlock code={STYLES_IMPORT} lang='tsx' title='app/layout.tsx' />

      <h2>3. Render your first picker</h2>
      <p>
        The simplest component is <code>SingleDatePicker</code>: one date, no
        time. Two things to notice before anything else:
      </p>
      <ol>
        <li>
          Every picker is a <strong>controlled component</strong> — you hold
          the value in state and pass it back in.
        </li>
        <li>
          Date-only values are <code>DayKey</code> strings like{' '}
          <code>&apos;2026-07-15&apos;</code>, never <code>Date</code> objects
          — a string is unambiguous in every time zone.
        </li>
      </ol>

      <DemoFrame hint='click the field to open the calendar'>
        <FirstPicker />
      </DemoFrame>

      <CodeBlock
        code={readDemoSource('first-picker.tsx')}
        title='components/demos/first-picker.tsx'
      />

      <h2>Where to go next</h2>
      <ul>
        <li>
          <a href='/docs/core-concepts'>Core concepts</a> — five facts about
          values, zones, and blocks that prevent almost every bug.
        </li>
        <li>
          <a href='/docs/date-time-range-picker'>DateTimeRangePicker</a> —
          the full pickup/return booking flow.
        </li>
      </ul>
    </DocPage>
  )
}
