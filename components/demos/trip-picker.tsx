'use client'

import { useMemo, useState } from 'react'
import {
  BookingDateTimePicker,
  type BookingValue,
} from 'availability-datetime-picker'

import { StateInspector } from '@/components/site/state-inspector'
import { demoBlocks, fmtInstant } from '@/lib/demo-data'

const ZONE = 'America/New_York' // the car's zone — display only

export function TripPicker() {
  const blocks = useMemo(demoBlocks, [])
  const [value, setValue] = useState<BookingValue>({ pickup: null, ret: null })
  const [status, setStatus] = useState('waiting for a complete range…')

  return (
    <div style={{ maxWidth: 460 }}>
      <BookingDateTimePicker
        blocks={blocks}
        timeZone={ZONE}
        value={value}
        onChange={(next, { complete, verdict }) => {
          setValue(next)
          setStatus(
            !complete
              ? 'incomplete — keep picking'
              : verdict?.ok !== false
                ? 'complete & valid → safe to persist'
                : 'complete but invalid — do not persist',
          )
        }}
        config={{ minRentalMinutes: 24 * 60, leadTimeMinutes: 120 }}
        labels={{ pickup: 'Pickup', return: 'Return' }}
      />
      <StateInspector
        data={{
          pickup: fmtInstant(value.pickup, ZONE),
          return: fmtInstant(value.ret, ZONE),
          status,
        }}
      />
    </div>
  )
}
