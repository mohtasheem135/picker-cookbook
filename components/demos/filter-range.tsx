'use client'

import { useMemo, useState } from 'react'
import {
  DateOnlyRangePicker,
  type DayRangeValue,
} from 'availability-datetime-picker'

import { StateInspector } from '@/components/site/state-inspector'
import { demoBlocks } from '@/lib/demo-data'

const ZONE = 'Asia/Kolkata'

export function FilterRange() {
  const blocks = useMemo(demoBlocks, [])
  const [range, setRange] = useState<DayRangeValue>({ from: null, to: null })
  const [applied, setApplied] = useState('—')

  return (
    <div style={{ maxWidth: 460 }}>
      <DateOnlyRangePicker
        timeZone={ZONE}
        value={range}
        onChange={(next, { complete }) => {
          setRange(next)
          // Apply the filter only once both ends are picked.
          if (complete) setApplied(`${next.from} → ${next.to}`)
        }}
        blocks={blocks}
        labels={{ from: 'Check-in', to: 'Check-out' }}
      />
      <StateInspector
        data={{
          from: range.from === null ? 'null' : `'${range.from}'`,
          to: range.to === null ? 'null' : `'${range.to}'`,
          'applied filter': applied,
        }}
      />
    </div>
  )
}
