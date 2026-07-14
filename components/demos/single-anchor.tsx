'use client'

import { useMemo, useState } from 'react'
import {
  SingleDateTimePicker,
  type Instant,
} from 'availability-datetime-picker'

import { StateInspector } from '@/components/site/state-inspector'
import { DAY, HOUR, demoBlocks, demoNow, fmtInstant } from '@/lib/demo-data'

const ZONE = 'America/New_York'

/**
 * Edit-trip mode: the trip START is fixed (rangeAnchor); the picker chooses
 * the trip END. Days and slots clamp to availability after the anchor, and
 * the verdict is FULL trip validity — validateRange(anchor, value).
 */
export function SingleAnchor() {
  const blocks = useMemo(demoBlocks, [])
  const anchor = useMemo(() => demoNow() + 2 * DAY + 10 * HOUR, [])
  const [value, setValue] = useState<Instant | null>(null)
  const [verdictText, setVerdictText] = useState('—')

  return (
    <div style={{ maxWidth: 340 }}>
      <SingleDateTimePicker
        timeZone={ZONE}
        value={value}
        onChange={(next, { verdict }) => {
          setValue(next)
          setVerdictText(
            verdict === null ? '—' : verdict.ok ? 'ok (whole trip valid)' : verdict.violations[0]!.message,
          )
        }}
        blocks={blocks}
        rangeAnchor={anchor}
        config={{ minRentalMinutes: 7 * 60 }}
        label='New return'
        placeholder='Pick new trip end'
      />
      <StateInspector
        data={{
          'trip start (fixed)': fmtInstant(anchor, ZONE),
          'trip end (picking)': fmtInstant(value, ZONE),
          verdict: verdictText,
        }}
      />
    </div>
  )
}
