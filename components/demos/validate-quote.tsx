'use client'

import { useState } from 'react'

import { StateInspector } from '@/components/site/state-inspector'
import { DAY, HOUR, demoNow } from '@/lib/demo-data'

/**
 * Client side of the server-validation demo: both buttons POST a range to
 * /api/quote. The valid one passes; the "tampered" one lands inside the
 * booked trip and comes back 422 with structured violations — even though
 * no picker UI was involved.
 */
export function ValidateQuote() {
  const [result, setResult] = useState('press a button…')

  async function send(kind: 'valid' | 'tampered') {
    const t0 = demoNow()
    const range =
      kind === 'valid'
        ? { pickup: t0 + 2 * DAY + 10 * HOUR, ret: t0 + 4 * DAY + 10 * HOUR }
        : { pickup: t0 + 5 * DAY + 12 * HOUR, ret: t0 + 6 * DAY + 12 * HOUR }
    setResult('…')
    const res = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(range),
    })
    const body = await res.json()
    setResult(
      `HTTP ${res.status} — ` +
        (body.ok
          ? 'ok, quote issued'
          : body.violations
              .map((v: { code: string; message: string }) => `${v.code}: ${v.message}`)
              .join(' | ')),
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button type='button' className='demo-button' onClick={() => send('valid')}>
          POST a valid range
        </button>
        <button type='button' className='demo-button' onClick={() => send('tampered')}>
          POST a range inside a block
        </button>
      </div>
      <StateInspector data={{ 'server response': result }} />
    </div>
  )
}
