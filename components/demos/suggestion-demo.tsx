'use client'

import { useMemo, useState } from 'react'
import {
  SuggestionBanner,
  createAvailabilityEngine,
  type BookingWindow,
} from 'availability-datetime-picker'

import { StateInspector } from '@/components/site/state-inspector'
import { DAY, HOUR, demoBlocks, demoNow, fmtInstant } from '@/lib/demo-data'

const ZONE = 'America/New_York'

/**
 * Standalone SuggestionBanner: a deep-linked range lands inside a block
 * (availability changed after the link was shared). Instead of a dead
 * error, offer the nearest valid window and apply it in one tap.
 */
export function SuggestionDemo() {
  const { desired, suggestion } = useMemo(() => {
    const blocks = demoBlocks()
    const engine = createAvailabilityEngine(blocks, { timeZone: ZONE })
    // This range overlaps the demo's booked trip on purpose.
    const desired: BookingWindow = {
      pickup: demoNow() + 5 * DAY + 12 * HOUR,
      ret: demoNow() + 6 * DAY + 12 * HOUR,
    }
    return { desired, suggestion: engine.suggestNearestWindow(desired) }
  }, [])

  const [value, setValue] = useState<BookingWindow | null>(null)

  return (
    <div style={{ maxWidth: 460 }}>
      {suggestion && value === null && (
        <SuggestionBanner
          suggestion={suggestion}
          timeZone={ZONE}
          onApply={() => setValue(suggestion)}
        />
      )}
      <StateInspector
        data={{
          'deep-linked range': `${fmtInstant(desired.pickup, ZONE)} → ${fmtInstant(desired.ret, ZONE)} (overlaps a block)`,
          'applied value':
            value === null
              ? 'null — waiting for "Use these dates"'
              : `${fmtInstant(value.pickup, ZONE)} → ${fmtInstant(value.ret, ZONE)}`,
        }}
      />
    </div>
  )
}
