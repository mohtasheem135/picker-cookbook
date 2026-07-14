'use client'

import { useMemo, useState } from 'react'
import {
  SingleDatePicker,
  endOfDay,
  instantToDayKey,
  type DayValue,
} from 'availability-datetime-picker'

import { StateInspector } from '@/components/site/state-inspector'
import { DAY, demoNow } from '@/lib/demo-data'

const ZONE = 'Asia/Kolkata'

/**
 * "When did the maintenance happen?" — past dates only. The selection
 * window's max is the end of today, so tomorrow onward is disabled; min
 * reaches 90 days back, so past days (normally unselectable) are valid.
 */
export function MaintenanceDate() {
  const selectionWindow = useMemo(() => {
    const now = demoNow()
    return {
      min: now - 90 * DAY,
      max: endOfDay(instantToDayKey(now, ZONE), ZONE),
    }
  }, [])
  const [day, setDay] = useState<DayValue>(null)

  return (
    <div style={{ maxWidth: 300 }}>
      <SingleDatePicker
        timeZone={ZONE}
        value={day}
        onChange={setDay}
        window={selectionWindow}
        label='Date of maintenance'
        placeholder='Select date'
      />
      <StateInspector data={{ value: day === null ? 'null' : `'${day}'` }} />
    </div>
  )
}
