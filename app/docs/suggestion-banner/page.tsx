import type { Metadata } from 'next'

import { SuggestionDemo } from '@/components/demos/suggestion-demo'
import { Callout } from '@/components/site/callout'
import { CodeBlock } from '@/components/site/code-block'
import { DemoFrame } from '@/components/site/demo-frame'
import { DocPage } from '@/components/site/doc-page'
import { PropsTable } from '@/components/site/props-table'
import { readDemoSource } from '@/lib/source'

export const metadata: Metadata = { title: 'SuggestionBanner' }

const HOOK_INTEGRATION = `// Inside the booking flow the banner is automatic: useBookingPicker
// computes \`suggestion\` whenever the current value is invalid, and
// applySuggestion() commits it.
const { verdict, suggestion, applySuggestion } = useBookingPicker({
  blocks,
  config: { timeZone },
  value,
  onChange: handleChange,
})

{verdict !== null && !verdict.ok && suggestion && (
  <SuggestionBanner
    suggestion={suggestion}
    timeZone={timeZone}
    onApply={applySuggestion}
  />
)}`

export default function Page() {
  return (
    <DocPage slug='suggestion-banner'>
      <p>
        When a desired range is invalid — a deep link into a now-booked
        window, availability that changed under the user — a dead
        &quot;unavailable&quot; error loses the booking. The Turo-style
        answer: compute the <strong>nearest valid window</strong> with{' '}
        <code>suggestNearestWindow</code> and offer it as a one-tap fix.
        <code> SuggestionBanner</code> is that surface, exported standalone
        so it works outside the pickers too.
      </p>

      <DemoFrame hint='the deep-linked range below overlaps a booked trip — apply the fix'>
        <SuggestionDemo />
      </DemoFrame>

      <h2>How to use it</h2>
      <ol>
        <li>
          <strong>Detect the invalid value.</strong> Validate the desired
          window with <code>engine.validateRange(pickup, ret)</code> — from a
          URL param, a saved draft, or live state.
        </li>
        <li>
          <strong>Ask for the nearest alternative.</strong>{' '}
          <code>engine.suggestNearestWindow(desired)</code> grid-searches the
          slot grid around the desired window, preserving its duration, and
          returns a <code>BookingWindow | null</code>.
        </li>
        <li>
          <strong>Render the banner; commit on apply.</strong>{' '}
          <code>onApply</code> is yours — set state, update the URL, refire
          the quote.
        </li>
      </ol>

      <h2>Code</h2>
      <CodeBlock
        code={readDemoSource('suggestion-demo.tsx')}
        title='components/demos/suggestion-demo.tsx'
      />

      <h2>Props</h2>
      <PropsTable
        rows={[
          { name: 'suggestion', type: 'BookingWindow', description: '{ pickup, ret } — the alternative to offer.', required: true },
          { name: 'timeZone', type: 'string', description: 'Zone for the human-readable labels.', required: true },
          { name: 'onApply', type: '() => void', description: 'The user accepted — commit the suggestion.', required: true },
          { name: 'message', type: 'string', default: `"These dates aren't available."`, description: 'Leading sentence before “Next available:”.' },
          { name: 'className', type: 'string', description: 'Extra classes on the banner root.' },
        ]}
      />

      <h2>Inside the booking flow</h2>
      <p>
        You rarely wire this by hand in a booking UI —{' '}
        <code>BookingDateTimePicker</code> shows it automatically when the
        value is invalid, and the headless hook exposes the same pieces:
      </p>
      <CodeBlock code={HOOK_INTEGRATION} title='with-use-booking-picker.tsx' />

      <Callout type='info' title='When there is no suggestion'>
        <p>
          <code>suggestNearestWindow</code> returns <code>null</code> when
          nothing fits within the booking horizon (e.g. the calendar is
          fully blocked). Render your plain unavailable state in that case.
        </p>
      </Callout>
    </DocPage>
  )
}
