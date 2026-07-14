'use client'

import { useMemo, useState } from 'react'
import {
  BookingDateTimePicker,
  type BookingValue,
} from 'availability-datetime-picker'

import { StateInspector } from '@/components/site/state-inspector'
import { demoBlocks, fmtInstant } from '@/lib/demo-data'

const ZONE = 'America/New_York'

/**
 * Every EngineConfig knob, live. Change a value, reopen the picker, and
 * watch day states and slot lists re-derive — all four surfaces (calendar,
 * slots, CTA, validation) read the same engine, so they can never disagree.
 */
export function ConfigPlayground() {
  const blocks = useMemo(demoBlocks, [])
  const [minRentalMinutes, setMinRental] = useState(420)
  const [leadTimeMinutes, setLeadTime] = useState(60)
  const [slotIntervalMinutes, setSlotInterval] = useState(30)
  const [maxAdvanceDays, setMaxAdvance] = useState(365)
  const [value, setValue] = useState<BookingValue>({ pickup: null, ret: null })

  const config = useMemo(
    () => ({
      minRentalMinutes,
      leadTimeMinutes,
      slotIntervalMinutes,
      maxAdvanceDays,
    }),
    [minRentalMinutes, leadTimeMinutes, slotIntervalMinutes, maxAdvanceDays],
  )

  return (
    <div style={{ maxWidth: 480 }}>
      <div className='demo-controls'>
        <label>
          minRentalMinutes
          <input
            type='number'
            min={0}
            step={60}
            value={minRentalMinutes}
            onChange={e => setMinRental(Number(e.target.value))}
          />
        </label>
        <label>
          leadTimeMinutes
          <input
            type='number'
            min={0}
            step={30}
            value={leadTimeMinutes}
            onChange={e => setLeadTime(Number(e.target.value))}
          />
        </label>
        <label>
          slotIntervalMinutes
          <select
            value={slotIntervalMinutes}
            onChange={e => setSlotInterval(Number(e.target.value))}
          >
            <option value={15}>15</option>
            <option value={30}>30</option>
            <option value={60}>60</option>
          </select>
        </label>
        <label>
          maxAdvanceDays
          <input
            type='number'
            min={1}
            value={maxAdvanceDays}
            onChange={e => setMaxAdvance(Number(e.target.value))}
          />
        </label>
      </div>
      <BookingDateTimePicker
        blocks={blocks}
        timeZone={ZONE}
        value={value}
        onChange={next => setValue(next)}
        config={config}
      />
      <StateInspector
        data={{
          pickup: fmtInstant(value.pickup, ZONE),
          return: fmtInstant(value.ret, ZONE),
        }}
      />
      <p className='demo-note'>
        Try: set maxAdvanceDays to 7 (calendar goes dark after a week), lead
        time to 720 (today&apos;s early slots disable), or min rental to 2880
        (short return slots disable with &quot;Trip too short&quot;).
      </p>
    </div>
  )
}
