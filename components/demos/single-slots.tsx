'use client'

import { useMemo, useState } from 'react'
import {
  SingleDateTimePicker,
  type Instant,
} from 'availability-datetime-picker'

import { StateInspector } from '@/components/site/state-inspector'
import { demoBlocks, fmtInstant } from '@/lib/demo-data'

const ZONE = 'America/New_York'

export function SingleSlots() {
  const blocks = useMemo(demoBlocks, [])
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
            verdict === null ? '—' : verdict.ok ? 'ok' : verdict.violations[0]!.message,
          )
        }}
        blocks={blocks}
        label='Delivery time'
        placeholder='Add date & time'
      />
      <StateInspector
        data={{ value: fmtInstant(value, ZONE), verdict: verdictText }}
      />
    </div>
  )
}
