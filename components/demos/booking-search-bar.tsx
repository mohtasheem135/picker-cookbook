'use client'

import { useMemo, useState } from 'react'
import {
  DateTimeRangePicker,
  type BookingValue,
} from 'availability-datetime-picker'

import { demoBlocks } from '@/lib/demo-data'

/**
 * The 'search-bar' trigger: inline pill segments for a search hero, instead
 * of the default bordered field rows.
 */
export function BookingSearchBar() {
  const blocks = useMemo(demoBlocks, [])
  const [value, setValue] = useState<BookingValue>({ pickup: null, ret: null })

  return (
    <div
      style={{
        background: '#1b5eff',
        padding: '28px 24px',
        borderRadius: 14,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 999,
          padding: '6px 18px',
          maxWidth: 520,
          margin: '0 auto',
        }}
      >
        <DateTimeRangePicker
          blocks={blocks}
          timeZone='America/New_York'
          value={value}
          onChange={next => setValue(next)}
          trigger='search-bar'
        />
      </div>
    </div>
  )
}
