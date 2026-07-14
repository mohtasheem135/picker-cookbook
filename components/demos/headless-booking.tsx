'use client'

import { useMemo, useState } from 'react'
import {
  addDaysToKey,
  dayKeyToLocalDate,
  useBookingPicker,
  type DayInfo,
} from 'availability-datetime-picker'

import { StateInspector } from '@/components/site/state-inspector'
import { demoBlocks, fmtInstant } from '@/lib/demo-data'

const ZONE = 'America/New_York'

/**
 * A completely custom UI on useBookingPicker — no package components, just
 * the state machine: day grid from dayStatus/isDayDisabled, slot chips from
 * slotsForActiveField, phase machine driving the flow, onBlockedAttempt
 * explaining blocked taps.
 */
export function HeadlessBooking() {
  const blocks = useMemo(demoBlocks, [])
  const config = useMemo(() => ({ timeZone: ZONE }), [])
  const [blocked, setBlocked] = useState<DayInfo | null>(null)

  const picker = useBookingPicker({
    blocks,
    config,
    onBlockedAttempt: setBlocked,
  })
  const { value, phase, editing, verdict, engine } = picker

  const days = useMemo(
    () => Array.from({ length: 21 }, (_, i) => addDaysToKey(engine.todayKey, i)),
    [engine],
  )
  const [activeDay, setActiveDay] = useState<string | null>(null)
  const slots = activeDay
    ? picker.slotsForActiveField(dayKeyToLocalDate(activeDay))
    : []

  return (
    <div>
      <p style={{ fontSize: 13.5, fontWeight: 650, margin: '0 0 8px' }}>
        phase: <code>{phase}</code> · editing: <code>{editing}</code>
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 4,
          maxWidth: 480,
        }}
      >
        {days.map(day => {
          const date = dayKeyToLocalDate(day)
          const status = picker.dayStatus(date)
          const disabled = picker.isDayDisabled(date)
          return (
            <button
              key={day}
              type='button'
              onClick={() => {
                setBlocked(null)
                setActiveDay(day)
                picker.selectDay(date) // blocked days no-op + report why
              }}
              style={{
                font: 'inherit',
                fontSize: 12,
                padding: '8px 2px',
                borderRadius: 8,
                cursor: 'pointer',
                border: '1px solid var(--line)',
                color: '#1c1917', // cells keep light tints in dark mode too
                opacity: disabled ? 0.45 : 1,
                textDecoration: status === 'blocked' ? 'line-through' : 'none',
                background:
                  status === 'available'
                    ? '#e9f7ef'
                    : status === 'blocked'
                      ? '#fee8e8'
                      : '#fdf3e3',
              }}
              title={status}
            >
              {day.slice(8)}
            </button>
          )
        })}
      </div>

      {blocked && (
        <p className='demo-note'>
          ⛔ {blocked.day} can&apos;t serve {editing}:{' '}
          {blocked.blocks[0]?.label ?? blocked.status} — and your selection
          survived.
        </p>
      )}

      {slots.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
          {slots.slice(0, 16).map(slot => (
            <button
              key={slot.instant}
              type='button'
              disabled={slot.disabled}
              title={slot.reason}
              onClick={() =>
                editing === 'pickup'
                  ? picker.setPickupTime(slot.instant)
                  : picker.setReturnTime(slot.instant)
              }
              style={{
                font: 'inherit',
                fontSize: 12,
                padding: '4px 10px',
                borderRadius: 999,
                border: '1px solid var(--line-strong)',
                color: 'var(--ink)',
                background: slot.disabled ? 'var(--panel)' : 'var(--card)',
                cursor: slot.disabled ? 'not-allowed' : 'pointer',
                opacity: slot.disabled ? 0.5 : 1,
              }}
            >
              {slot.label}
            </button>
          ))}
        </div>
      )}

      <StateInspector
        data={{
          pickup: fmtInstant(value.pickup, ZONE),
          return: fmtInstant(value.ret, ZONE),
          verdict:
            verdict === null ? '— (incomplete)' : verdict.ok ? 'ok' : verdict.violations[0]!.message,
        }}
      />
    </div>
  )
}
