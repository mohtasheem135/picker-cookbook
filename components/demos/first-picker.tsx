'use client'

import { useState } from 'react'
import { SingleDatePicker, type DayValue } from 'availability-datetime-picker'

import { StateInspector } from '@/components/site/state-inspector'

export function FirstPicker() {
  // Date-only values are DayKey strings ('yyyy-MM-dd'), never Date objects.
  const [day, setDay] = useState<DayValue>(null)

  return (
    <div>
      <SingleDatePicker
        timeZone='Asia/Kolkata'
        value={day}
        onChange={setDay}
        label='Service date'
        placeholder='Pick a date'
      />
      <StateInspector data={{ value: day === null ? 'null' : `'${day}'` }} />
    </div>
  )
}
