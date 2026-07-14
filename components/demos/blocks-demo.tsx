'use client'

import { useMemo, useState } from 'react'
import {
  SingleDateTimePicker,
  type BlockParseIssue,
  type Instant,
  type RawBlockInput,
} from 'availability-datetime-picker'

import { StateInspector } from '@/components/site/state-inspector'
import { DAY, HOUR, demoNow, fmtInstant } from '@/lib/demo-data'

const ZONE = 'America/New_York'

/**
 * Half-open boundaries + turnaround + parse issues, in one demo.
 *
 * The calendar has one booked trip ending at 10:00 AM three days out. With
 * turnaround 0, the 10:00 AM slot on that day is SELECTABLE — [start, end)
 * means the resource is free at the exact end instant. Add turnaround and
 * the boundary slots disable. The blocks array also smuggles in one
 * malformed entry (endMs before startMs) to show onIssues reporting.
 */
export function BlocksDemo() {
  const [turnaround, setTurnaround] = useState(0)
  const [issues, setIssues] = useState<BlockParseIssue[]>([])
  const [value, setValue] = useState<Instant | null>(null)

  const blockEnd = useMemo(() => demoNow() + 3 * DAY + 10 * HOUR, [])
  const blocks = useMemo<RawBlockInput[]>(
    () => [
      {
        id: 'trip-9',
        startMs: blockEnd - 2 * DAY,
        endMs: blockEnd, // free again AT 10:00 AM sharp
        kind: 'booking',
        label: 'Booked by another guest',
      },
      {
        id: 'broken-1', // inverted on purpose: end before start
        startMs: blockEnd + 5 * DAY,
        endMs: blockEnd + 4 * DAY,
        kind: 'external',
      },
    ],
    [blockEnd],
  )
  const config = useMemo(
    () => ({ turnaroundMinutes: turnaround }),
    [turnaround],
  )

  return (
    <div style={{ maxWidth: 420 }}>
      <div className='demo-controls'>
        <label>
          turnaroundMinutes
          <select
            value={turnaround}
            onChange={e => setTurnaround(Number(e.target.value))}
          >
            <option value={0}>0 — back-to-back allowed</option>
            <option value={60}>60 — 1 h cleaning gap</option>
            <option value={120}>120 — 2 h cleaning gap</option>
          </select>
        </label>
      </div>
      <SingleDateTimePicker
        timeZone={ZONE}
        value={value}
        onChange={next => setValue(next)}
        blocks={blocks}
        config={config}
        onIssues={setIssues}
        label='Pickup time'
        placeholder='Try the day the trip ends'
      />
      <StateInspector
        data={{
          'block ends at': fmtInstant(blockEnd, ZONE),
          'selected value': fmtInstant(value, ZONE),
          'parse issues': issues.length
            ? issues
                .map(i => `${i.id ?? '(no id)'} — ${i.problem}`)
                .join('; ')
            : 'none reported yet (open the picker)',
        }}
      />
    </div>
  )
}
