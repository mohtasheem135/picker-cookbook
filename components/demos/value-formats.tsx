'use client'

import { useMemo, useState } from 'react'
import {
  SingleDatePicker,
  SingleDateTimePicker,
} from 'availability-datetime-picker'

import { StateInspector } from '@/components/site/state-inspector'
import { demoBlocks } from '@/lib/demo-data'

const ZONE = 'Asia/Kolkata'

/**
 * valueFormat: the pickers speak YOUR app's wire format. Here the datetime
 * picker emits ISO-8601 strings and the date picker emits epoch SECONDS —
 * no conversion code on the consumer side. Engine math stays epoch ms
 * internally either way.
 */
export function ValueFormats() {
  const blocks = useMemo(demoBlocks, [])
  const [iso, setIso] = useState<string | null>(null)
  const [seconds, setSeconds] = useState<number | null>(null)

  return (
    <div>
      <div className='demo-row'>
        <div className='demo-col'>
          <SingleDateTimePicker
            timeZone={ZONE}
            valueFormat='iso'
            value={iso}
            onChange={next => setIso(next)}
            blocks={blocks}
            label='Emits ISO-8601'
          />
        </div>
        <div className='demo-col'>
          <SingleDatePicker
            timeZone={ZONE}
            valueFormat='epoch-seconds'
            value={seconds}
            onChange={next => setSeconds(next)}
            label='Emits epoch seconds'
          />
        </div>
      </div>
      <StateInspector
        data={{
          'onChange (iso)': iso === null ? 'null' : `'${iso}'`,
          'onChange (epoch-seconds)':
            seconds === null ? 'null' : `${seconds}  (day start in ${ZONE})`,
        }}
      />
    </div>
  )
}
