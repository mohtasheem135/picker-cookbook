/**
 * Server-side re-validation with the React-free /core subpath. Never trust
 * a range that arrives over the wire — the same engine that gated the UI
 * re-checks it here before you quote or charge.
 */
import { createAvailabilityEngine } from 'availability-datetime-picker/core'

import { demoBlocks } from '@/lib/demo-data'

export async function POST(req: Request) {
  const { pickup, ret } = (await req.json()) as {
    pickup: number
    ret: number
  }

  // Real apps load blocks from the database here.
  const engine = createAvailabilityEngine(demoBlocks(), {
    timeZone: 'America/New_York',
    minRentalMinutes: 24 * 60,
  })

  const verdict = engine.validateRange(pickup, ret)
  if (!verdict.ok) {
    return Response.json(
      { ok: false, violations: verdict.violations },
      { status: 422 },
    )
  }
  return Response.json({ ok: true, quotedAt: Date.now() })
}
