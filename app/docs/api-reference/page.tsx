import type { Metadata } from 'next'

import { Callout } from '@/components/site/callout'
import { CodeBlock } from '@/components/site/code-block'
import { DocPage } from '@/components/site/doc-page'

export const metadata: Metadata = { title: 'API reference' }

const ENTRIES = `import { … } from 'availability-datetime-picker'        // components + hooks + engine
import { … } from 'availability-datetime-picker/core'   // engine only — server-safe, zero React
import 'availability-datetime-picker/styles.css'         // the one stylesheet`

const ENGINE_API = `const engine = createAvailabilityEngine(blocks, config)

engine.config / engine.blocks / engine.issues   // resolved config, parsed blocks, parse rejects
engine.todayKey / engine.windowMin / engine.horizon

// Day classification
engine.dayInfo(day)                    // DayInfo: status, blocks, freeWindows
engine.isDaySelectable(day)
engine.isPickupDayDisabled(day)
engine.isReturnDayDisabled(day, pickup)

// Slot enumeration
engine.pickupSlots(day)                // Slot[]: { instant, label, disabled, reason }
engine.returnSlots(day, pickup)

// Bounds & duration
engine.maxCheckout(pickup)             // latest reachable return
engine.minValidReturn(pickup)          // earliest valid return (or null)

// Validation
engine.validateRange(pickup, ret)      // Verdict
engine.validateInstant(instant)        // Verdict

// Defaults & recovery
engine.defaultRange(durationMinutes?)  // earliest valid BookingWindow (default 2880 = 2 days)
engine.suggestNearestWindow(desired)   // nearest valid BookingWindow | null`

export default function Page() {
  return (
    <DocPage slug='api-reference'>
      <h2>Entry points</h2>
      <CodeBlock code={ENTRIES} lang='ts' title='imports' />

      <h2>Components (root entry)</h2>
      <table>
        <thead><tr><th>Export</th><th>Value type</th><th>Demo</th></tr></thead>
        <tbody>
          <tr><td><code>BookingDateTimePicker</code></td><td><code>{'BookingValue { pickup, ret }'}</code></td><td><a href='/docs/booking-date-time-picker'>booking-date-time-picker</a></td></tr>
          <tr><td><code>SingleDateTimePicker</code></td><td><code>Instant | null</code></td><td><a href='/docs/single-date-time-picker'>single-date-time-picker</a></td></tr>
          <tr><td><code>SingleDatePicker</code></td><td><code>DayKey | null</code></td><td><a href='/docs/single-date-picker'>single-date-picker</a></td></tr>
          <tr><td><code>DateOnlyRangePicker</code></td><td><code>{'DayRangeValue { from, to }'}</code></td><td><a href='/docs/date-only-range-picker'>date-only-range-picker</a></td></tr>
          <tr><td><code>SuggestionBanner</code></td><td>—</td><td><a href='/docs/suggestion-banner'>suggestion-banner</a></td></tr>
        </tbody>
      </table>

      <h2>Hooks (root entry)</h2>
      <table>
        <thead><tr><th>Export</th><th>Drives</th><th>Demo</th></tr></thead>
        <tbody>
          <tr><td><code>useBookingPicker</code></td><td>pickup/return trip state machine (+ <code>dayKeyFromCalendarDate</code>)</td><td rowSpan={4}><a href='/docs/headless-hooks'>headless-hooks</a></td></tr>
          <tr><td><code>useSinglePicker</code></td><td>single instant, slots/minute precision, rangeAnchor</td></tr>
          <tr><td><code>useSingleDateSelect</code></td><td>single DayKey</td></tr>
          <tr><td><code>useDateRangeSelect</code></td><td>DayKey range with meta.complete</td></tr>
        </tbody>
      </table>

      <h2>The engine (root and /core)</h2>
      <CodeBlock code={ENGINE_API} lang='ts' title='engine.ts' />

      <h2>Functions</h2>
      <table>
        <thead><tr><th>Export</th><th>Purpose</th><th>Docs</th></tr></thead>
        <tbody>
          <tr><td><code>createAvailabilityEngine(blocks, config)</code></td><td>build the one source of truth</td><td><a href='/docs/engine-config'>engine-config</a></td></tr>
          <tr><td><code>parseRawBlocks(raw)</code></td><td>sanitize untrusted block input → blocks + issues</td><td rowSpan={2}><a href='/docs/blocks-and-availability'>blocks</a></td></tr>
          <tr><td><code>mergeBlocks(blocks)</code> <em>(/core only)</em></td><td>merge overlapping/adjacent intervals, sources retained</td></tr>
          <tr><td><code>suggestNearestWindow</code></td><td>nearest valid window (also a method on the engine)</td><td><a href='/docs/suggestion-banner'>suggestion-banner</a></td></tr>
          <tr><td><code>dateOnlyConfig / singleInstantConfig</code></td><td>presets that zero the trip rules</td><td><a href='/docs/engine-config'>engine-config</a></td></tr>
          <tr><td><code>encodeInstant / decodeInstant / encodeDay / decodeDay</code></td><td>wire-format codecs behind the components&apos; <code>valueFormat</code> prop</td><td><a href='/docs/single-date-time-picker'>single-date-time-picker</a></td></tr>
          <tr><td><code>dayStart / endOfDay / nextDayStart*</code></td><td>DayKey + zone → boundary Instant</td><td rowSpan={4}><a href='/docs/timezones'>timezones</a></td></tr>
          <tr><td><code>instantToDayKey / localDateToDayKey / dayKeyToLocalDate / addDaysToKey</code></td><td>instant ↔ DayKey ↔ Date conversions</td></tr>
          <tr><td><code>formatDayLabel / formatTimeLabel / formatDayTimeLabel / formatZoneAbbreviation</code></td><td>zone-aware labels</td></tr>
          <tr><td><code>wallTimeToInstant / wallTimeParts / enumerateDaySlots* / roundUpToSlotGrid*</code></td><td>wall-clock ↔ instant, slot grid</td></tr>
        </tbody>
      </table>
      <p style={{ fontSize: 13.5 }}>
        * <code>/core</code>-only exports: <code>mergeBlocks</code>,{' '}
        <code>ENGINE_DEFAULTS</code>, <code>nextDayStart</code>,{' '}
        <code>enumerateDaySlots</code>, <code>roundUpToSlotGrid</code>. The
        root entry re-exports everything else.
      </p>

      <h2>Types</h2>
      <table>
        <thead><tr><th>Type</th><th>Shape</th></tr></thead>
        <tbody>
          <tr><td><code>Instant</code></td><td><code>number</code> — UTC epoch milliseconds</td></tr>
          <tr><td><code>DayKey</code></td><td><code>string</code> — <code>&apos;yyyy-MM-dd&apos;</code> in the display zone</td></tr>
          <tr><td><code>RawBlockInput</code></td><td><code>{'{ id, startMs, endMs, kind, label? }'}</code></td></tr>
          <tr><td><code>AvailabilityBlock</code></td><td>validated block: <code>{'{ id, start, end, kind, label? }'}</code></td></tr>
          <tr><td><code>BlockKind</code></td><td><code>&apos;booking&apos; | &apos;host&apos; | &apos;maintenance&apos; | &apos;snooze&apos; | &apos;external&apos; | &apos;unknown&apos;</code></td></tr>
          <tr><td><code>BlockParseIssue</code></td><td><code>{"{ id, problem: 'inverted' | 'non-finite' | 'missing-field', raw }"}</code></td></tr>
          <tr><td><code>EngineConfig</code></td><td>see <a href='/docs/engine-config'>engine-config</a></td></tr>
          <tr><td><code>SelectionWindow</code></td><td><code>{'{ min?: Instant; max?: Instant }'}</code> — each side replaces a now-derived bound</td></tr>
          <tr><td><code>DayStatus</code></td><td><code>&apos;past&apos; | &apos;available&apos; | &apos;partial&apos; | &apos;checkout-only&apos; | &apos;blocked&apos;</code></td></tr>
          <tr><td><code>DayInfo</code></td><td><code>{'{ day, status, blocks, freeWindows }'}</code></td></tr>
          <tr><td><code>Slot</code></td><td><code>{'{ instant, label, disabled, reason? }'}</code></td></tr>
          <tr><td><code>SlotDisabledReason</code></td><td><code>&apos;past&apos; | &apos;lead-time&apos; | &apos;blocked&apos; | &apos;min-duration&apos; | &apos;beyond-clamp&apos; | &apos;outside-window&apos;</code></td></tr>
          <tr><td><code>Verdict</code></td><td><code>{'{ ok: true } | { ok: false; violations: Violation[] }'}</code></td></tr>
          <tr><td><code>Violation / ViolationCode</code></td><td>see <a href='/docs/server-side-validation'>server-side-validation</a></td></tr>
          <tr><td><code>BookingWindow</code></td><td><code>{'{ pickup: Instant; ret: Instant }'}</code></td></tr>
          <tr><td><code>BookingValue</code></td><td><code>{'{ pickup: Instant | null; ret: Instant | null }'}</code></td></tr>
          <tr><td><code>DayValue / DayRangeValue</code></td><td><code>DayKey | null</code> / <code>{'{ from, to }'}</code></td></tr>
          <tr><td><code>InstantValueFormat / DayValueFormat</code></td><td><code>&apos;epoch-ms&apos; | &apos;epoch-seconds&apos; | &apos;iso&apos;</code> / same + <code>&apos;day-key&apos;</code> — the <code>valueFormat</code> options</td></tr>
          <tr><td><code>FormattedInstant&lt;F&gt; / FormattedDay&lt;F&gt;</code></td><td>the value&apos;s TS type in a given wire format</td></tr>
          <tr><td><code>BookingValueOf&lt;F&gt; / DayRangeValueOf&lt;F&gt;</code></td><td>the composite values in a given wire format</td></tr>
        </tbody>
      </table>

      <Callout type='info' title='Package facts'>
        <p>
          ESM-only · React 18/19 peer · <code>sideEffects</code> limited to
          CSS · types ship for both entries · Node ≥ 18. The{' '}
          <code>/core</code> subpath contains no React and no{' '}
          <code>&apos;use client&apos;</code>, enforced by a build guard.
        </p>
      </Callout>
    </DocPage>
  )
}
