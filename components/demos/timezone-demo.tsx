'use client'

import { useMemo, useState } from 'react'
import {
  SingleDateTimePicker,
  type Instant,
} from 'availability-datetime-picker'

import { StateInspector } from '@/components/site/state-inspector'
import { demoBlocks, fmtInstant } from '@/lib/demo-data'

const ZONES = ['America/New_York', 'Asia/Kolkata', 'Pacific/Kiritimati']

/**
 * ONE value, three zones. All three pickers are bound to the same Instant.
 * Pick a time in any of them: the other two re-label the same number in
 * their own zone. The value in the inspector never becomes three values —
 * timeZone is display-only.
 */
export function TimezoneDemo() {
  const blocks = useMemo(demoBlocks, [])
  const [value, setValue] = useState<Instant | null>(null)

  return (
    <div>
      <div className='demo-row'>
        {ZONES.map(zone => (
          <div key={zone} className='demo-col'>
            <SingleDateTimePicker
              timeZone={zone}
              value={value}
              onChange={next => setValue(next)}
              blocks={blocks}
              label={zone}
              placeholder='Pick in this zone'
            />
          </div>
        ))}
      </div>
      <StateInspector
        data={{
          'the ONE value (ms)': value === null ? 'null' : String(value),
          '…in New York': fmtInstant(value, 'America/New_York'),
          '…in Kolkata': fmtInstant(value, 'Asia/Kolkata'),
          '…in Kiritimati (UTC+14)': fmtInstant(value, 'Pacific/Kiritimati'),
        }}
      />
    </div>
  )
}
