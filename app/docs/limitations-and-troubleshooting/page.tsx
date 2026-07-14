import type { Metadata } from 'next'

import { Callout } from '@/components/site/callout'
import { DocPage } from '@/components/site/doc-page'

export const metadata: Metadata = { title: 'Limitations & troubleshooting' }

export default function Page() {
  return (
    <DocPage slug='limitations-and-troubleshooting'>
      <h2>Deliberate exclusions</h2>
      <p>
        These are documented design boundaries, not bugs — each keeps the
        package small and its guarantees checkable:
      </p>
      <ol>
        <li>
          <strong>Half-open block semantics are your contract.</strong> The
          engine assumes <code>[start, end)</code> and cannot detect a
          backend that means inclusive-end. Fix in your mapping layer.
        </li>
        <li>
          <strong>No per-resource settings source.</strong> There is no
          config server — wire your own resource settings into{' '}
          <code>EngineConfig</code>.
        </li>
        <li>
          <strong>No live availability push.</strong> Blocks are whatever you
          passed last; refetch on open (<a href='/docs/recipes'>recipe</a>)
          or on your own schedule.
        </li>
        <li>
          <strong>One display zone per instance.</strong> A picker renders
          one zone; pickup-in-one-city, return-in-another needs two
          instances and your own glue.
        </li>
        <li>
          <strong>Theming is <code>:root</code>-level.</strong> The portal
          means per-instance theming isn&apos;t supported (
          <a href='/docs/theming'>why</a>).
        </li>
        <li>
          <strong>No time-only micro-popover and no roving arrow-key slot
          navigation.</strong> Slot lists are standard focusable buttons.
        </li>
        <li>
          <strong>Mobile calendar pages month-by-month</strong> — no infinite
          scroll.
        </li>
        <li>
          <strong>ESM-only.</strong> No CommonJS build; legacy{' '}
          <code>require()</code> pipelines are out of scope.
        </li>
      </ol>

      <h2>Troubleshooting</h2>
      <table>
        <thead>
          <tr><th>Symptom</th><th>Cause</th><th>Fix</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>A day renders off by one</td>
            <td>A <code>DayKey</code> went through <code>new Date(&apos;yyyy-MM-dd&apos;)</code> (UTC midnight) and was displayed in a western zone.</td>
            <td>Keep day keys as strings; convert at boundaries with <code>dayStart</code>/<code>endOfDay</code>. <a href='/docs/timezones'>Details</a>.</td>
          </tr>
          <tr>
            <td>All slots disabled today</td>
            <td>Lead time: earliest pickup is <code>now + leadTimeMinutes</code> (default 60).</td>
            <td>For non-booking surfaces pass <code>leadTimeMinutes: 0</code> (or use the presets).</td>
          </tr>
          <tr>
            <td>Pickup slot disabled with &quot;Trip too short&quot;</td>
            <td>No return of <code>minRentalMinutes</code> fits before the next block — overlap prevention working.</td>
            <td>Expected; lower <code>minRentalMinutes</code> if the product allows shorter trips.</td>
          </tr>
          <tr>
            <td>Selection &quot;vanished&quot;</td>
            <td>The machine never wipes — your controlled-value echo is dropping it.</td>
            <td>Feed <code>onChange</code>&apos;s value back into <code>value</code> unmodified. <a href='/docs/day-states-and-anti-wipe'>Contract</a>.</td>
          </tr>
          <tr>
            <td>Popover unstyled / grey buttons</td>
            <td>The stylesheet was never imported.</td>
            <td><code>import &apos;availability-datetime-picker/styles.css&apos;</code> once at the app entry.</td>
          </tr>
          <tr>
            <td>Theme override ignored</td>
            <td><code>--bdp-*</code> set on a wrapper; the portal never sees it.</td>
            <td>Set tokens on <code>:root</code>. <a href='/docs/theming'>Details</a>.</td>
          </tr>
          <tr>
            <td><code>onIssues</code> firing</td>
            <td>Malformed block input; the engine kept valid blocks and reported the rest.</td>
            <td>Fix the producer; treat reports as data bugs. <a href='/docs/blocks-and-availability'>Details</a>.</td>
          </tr>
          <tr>
            <td>Hydration mismatch warnings</td>
            <td>Blocks or <code>now</code> computed differently on server and client render.</td>
            <td>Derive demo/SSR data from a stable clock (or pass <code>config.now</code>).</td>
          </tr>
          <tr>
            <td><code>ERR_REQUIRE_ESM</code> at import</td>
            <td>A CommonJS pipeline tried to <code>require()</code> the package.</td>
            <td>Use a bundler/runtime with ESM support (limitation 8).</td>
          </tr>
        </tbody>
      </table>

      <Callout type='tip' title='Engine behavior questions'>
        <p>
          The package&apos;s engine test matrix is executable documentation —
          in the package repo, <code>npm test</code> runs it, and{' '}
          <code>npm run test:tz</code> proves zone independence by running the
          same suite under <code>TZ=UTC</code> and{' '}
          <code>TZ=Pacific/Kiritimati</code>.
        </p>
      </Callout>
    </DocPage>
  )
}
