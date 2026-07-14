'use client'

import { useMemo, useState } from 'react'
import {
  BookingDateTimePicker,
  addDaysToKey,
  createAvailabilityEngine,
  instantToDayKey,
  type BookingValue,
  type DayStatus,
} from 'availability-datetime-picker'

import { StateInspector } from '@/components/site/state-inspector'
import { demoBlocks, demoNow, fmtInstant } from '@/lib/demo-data'

const ZONE = 'America/New_York'

const STATUS_HINT: Record<DayStatus, string> = {
  past: 'already gone',
  available: 'fully free',
  partial: 'some hours blocked',
  'checkout-only': 'a trip can end here, not start',
  blocked: 'fully unavailable',
}

/**
 * The calendar (top) and the engine's raw day classification (bottom) are
 * the same source of truth: engine.dayInfo(day).status per day. Click a
 * blocked day in the picker — the reason surfaces, and the value below
 * provably does not change (the anti-wipe contract).
 */
export function DayStatesDemo() {
  const blocks = useMemo(demoBlocks, [])
  const engine = useMemo(
    () => createAvailabilityEngine(blocks, { timeZone: ZONE }),
    [blocks],
  )
  const days = useMemo(() => {
    const today = instantToDayKey(demoNow(), ZONE)
    return Array.from({ length: 28 }, (_, i) => {
      const day = addDaysToKey(today, i)
      return { day, status: engine.dayInfo(day).status }
    })
  }, [engine])

  const [value, setValue] = useState<BookingValue>({ pickup: null, ret: null })
  const [changeCount, setChangeCount] = useState(0)

  return (
    <div>
      <div style={{ maxWidth: 460 }}>
        <BookingDateTimePicker
          blocks={blocks}
          timeZone={ZONE}
          value={value}
          onChange={next => {
            setValue(next)
            setChangeCount(c => c + 1)
          }}
        />
      </div>
      <StateInspector
        data={{
          pickup: fmtInstant(value.pickup, ZONE),
          return: fmtInstant(value.ret, ZONE),
          'onChange fired': `${changeCount} time(s) — clicking a blocked day does NOT increment this`,
        }}
      />
      <p className='demo-note'>
        engine.dayInfo(day).status for the next 28 days — the exact data the
        calendar above renders from:
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 6,
          fontSize: 12.5,
          fontFamily: 'var(--mono)',
        }}
      >
        {days.map(({ day, status }) => (
          <div
            key={day}
            title={STATUS_HINT[status]}
            style={{
              padding: '4px 8px',
              borderRadius: 6,
              border: '1px solid var(--line)',
              color: '#1c1917', // chips keep light tints in dark mode too
              background:
                status === 'available'
                  ? '#e9f7ef'
                  : status === 'blocked'
                    ? '#fee8e8'
                    : status === 'past'
                      ? '#f5f3f0'
                      : '#fdf3e3',
            }}
          >
            {day.slice(5)} · {status}
          </div>
        ))}
      </div>
    </div>
  )
}
