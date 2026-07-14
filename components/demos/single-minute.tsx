'use client'

import { useMemo, useState } from 'react'
import {
  SingleDateTimePicker,
  type Instant,
} from 'availability-datetime-picker'

import { StateInspector } from '@/components/site/state-inspector'
import { DAY, demoNow, fmtInstant } from '@/lib/demo-data'

const ZONE = 'America/New_York'

/**
 * Exact-minute entry for "what time did it actually happen": the selection
 * window opens 30 days into the PAST (min replaces the lead-time bound), so
 * past instants are valid — impossible in booking mode.
 */
export function SingleMinute() {
  const windowConfig = useMemo(
    () => ({ window: { min: demoNow() - 30 * DAY } }),
    [],
  )
  const [value, setValue] = useState<Instant | null>(null)

  return (
    <div style={{ maxWidth: 340 }}>
      <SingleDateTimePicker
        timeZone={ZONE}
        precision='minute'
        value={value}
        onChange={next => setValue(next)}
        config={windowConfig}
        label='Actual return time'
        placeholder='Add exact time'
      />
      <StateInspector data={{ value: fmtInstant(value, ZONE) }} />
    </div>
  )
}
