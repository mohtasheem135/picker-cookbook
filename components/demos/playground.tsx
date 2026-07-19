'use client'

import { useMemo, useState } from 'react'
import {
  DateTimeRangePicker,
  DateOnlyRangePicker,
  SingleDatePicker,
  SingleDateTimePicker,
  type DayValueFormat,
  type InstantValueFormat,
} from 'availability-datetime-picker'

import { CopyButton } from '@/components/site/copy-button'
import { InfoTip } from '@/components/site/info-tip'
import { StateInspector } from '@/components/site/state-inspector'
import { demoBlocks } from '@/lib/demo-data'

/** Plain-language meaning of each EngineConfig knob, shown in a tooltip. */
const KNOB_HELP: Record<keyof EngineKnobs, string> = {
  minRentalMinutes:
    'Minimum trip length. A return earlier than pickup + this many minutes is rejected, and those return slots are disabled as "Trip too short". Engine default 420 (7 hours).',
  leadTimeMinutes:
    'Advance notice before the earliest pickup. The first selectable pickup is now + this many minutes; earlier slots are disabled as "Too soon". Engine default 60.',
  turnaroundMinutes:
    'Cleaning/turnaround gap required between a trip and any block, on both sides. A trip must start at least this long after a block ends and end at least this long before the next block starts. Engine default 0 (back-to-back allowed).',
  slotIntervalMinutes:
    'Granularity of the time grid. Pickup and return times land on this tick size — 30 means :00 and :30. Engine default 30.',
  maxAdvanceDays:
    'Booking horizon. A trip must end within this many days of now; later calendar days are disabled. Engine default 365.',
}

/**
 * Interactive playground: pick a component, flip its real props (including
 * valueFormat), and watch three things update together — the live picker,
 * the exact code that renders it, and precisely what onChange hands back in
 * the chosen wire format. Nothing here is a special demo mode; every control
 * maps to a genuine prop on the shipped component.
 */

type Kind =
  | 'SingleDatePicker'
  | 'SingleDateTimePicker'
  | 'DateOnlyRangePicker'
  | 'DateTimeRangePicker'

const KINDS: Kind[] = [
  'SingleDatePicker',
  'SingleDateTimePicker',
  'DateOnlyRangePicker',
  'DateTimeRangePicker',
]

const ZONES = [
  'Asia/Kolkata',
  'America/New_York',
  'Europe/London',
  'Asia/Tokyo',
  'UTC',
]

const DAY_FORMATS: DayValueFormat[] = [
  'day-key',
  'epoch-ms',
  'epoch-seconds',
  'iso',
]
const INSTANT_FORMATS: InstantValueFormat[] = ['epoch-ms', 'epoch-seconds', 'iso']

/** date-only pickers speak DayValueFormat; date+time pickers speak InstantValueFormat. */
function isDateOnly(kind: Kind): boolean {
  return kind === 'SingleDatePicker' || kind === 'DateOnlyRangePicker'
}

/**
 * Only the date+time components take a `config` prop
 * (`Partial<Omit<EngineConfig, 'timeZone'>>`). Date-only pickers use the
 * `dateOnlyConfig` preset internally and are bounded with `window` instead.
 */
function takesConfig(kind: Kind): boolean {
  return kind === 'SingleDateTimePicker' || kind === 'DateTimeRangePicker'
}

interface EngineKnobs {
  minRentalMinutes: number
  leadTimeMinutes: number
  turnaroundMinutes: number
  slotIntervalMinutes: number
  maxAdvanceDays: number
}

/**
 * The values these knobs already have if you pass no `config`. They differ by
 * component: DateTimeRangePicker uses the full ENGINE_DEFAULTS (420/60/30/365),
 * while SingleDateTimePicker runs `singleInstantConfig`, which zeroes the trip
 * rules (minRental + lead time). Showing the right baseline is what makes the
 * "override only what differs" story honest.
 */
function configDefaults(kind: Kind): EngineKnobs {
  if (kind === 'SingleDateTimePicker') {
    return {
      minRentalMinutes: 0,
      leadTimeMinutes: 0,
      turnaroundMinutes: 0,
      slotIntervalMinutes: 30,
      maxAdvanceDays: 365,
    }
  }
  // DateTimeRangePicker → the raw ENGINE_DEFAULTS
  return {
    minRentalMinutes: 420,
    leadTimeMinutes: 60,
    turnaroundMinutes: 0,
    slotIntervalMinutes: 30,
    maxAdvanceDays: 365,
  }
}

/** Only the knobs the user actually changed from this component's baseline. */
function configOverridesFor(kind: Kind, knobs: EngineKnobs): Partial<EngineKnobs> {
  const base = configDefaults(kind)
  const out: Partial<EngineKnobs> = {}
  ;(Object.keys(knobs) as (keyof EngineKnobs)[]).forEach(k => {
    if (knobs[k] !== base[k]) out[k] = knobs[k]
  })
  return out
}

type Scalar = string | number | null

/** Render one returned scalar as "<raw>  →  <human meaning>" for the chosen format. */
function describe(raw: Scalar, format: string, zone: string): string {
  if (raw === null) return 'null'
  if (format === 'day-key') return `'${raw}'   (DayKey string, zone-independent)`
  if (format === 'iso') return `'${raw}'`
  // epoch-ms | epoch-seconds → a number
  const ms = format === 'epoch-seconds' ? Number(raw) * 1000 : Number(raw)
  const wall = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(ms)
  return `${raw}   →   ${wall} (${zone})`
}

/** typeof-style tag so the return panel says whether it's a string or a number. */
function typeTag(raw: Scalar): string {
  return raw === null ? 'null' : typeof raw
}

export function Playground() {
  const blocks = useMemo(demoBlocks, [])

  const [kind, setKind] = useState<Kind>('SingleDatePicker')
  const [zone, setZone] = useState('Asia/Kolkata')
  const [dayFormat, setDayFormat] = useState<DayValueFormat>('day-key')
  const [instantFormat, setInstantFormat] =
    useState<InstantValueFormat>('epoch-ms')
  const [label, setLabel] = useState('Service date')
  const [showFooter, setShowFooter] = useState(true)
  const [disabled, setDisabled] = useState(false)
  const [includeBlocks, setIncludeBlocks] = useState(true)
  const [precision, setPrecision] = useState<'slots' | 'minute'>('slots')
  // Engine config knobs. Seeded to the booking baseline; reset to the active
  // component's baseline whenever the component changes (see changeKind).
  const [knobs, setKnobs] = useState<EngineKnobs>(() =>
    configDefaults('DateTimeRangePicker'),
  )

  // One independent value per component, in its currently selected format.
  const [dayValue, setDayValue] = useState<Scalar>(null)
  const [instantValue, setInstantValue] = useState<Scalar>(null)
  const [rangeValue, setRangeValue] = useState<{ from: Scalar; to: Scalar }>({
    from: null,
    to: null,
  })
  const [bookingValue, setBookingValue] = useState<{
    pickup: Scalar
    ret: Scalar
  }>({ pickup: null, ret: null })
  const [rangeComplete, setRangeComplete] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingOk, setBookingOk] = useState<boolean | null>(null)

  const format = isDateOnly(kind) ? dayFormat : instantFormat
  const activeBlocks = includeBlocks ? blocks : []

  // Empty zone = "none": omit the timeZone prop entirely and let the picker
  // fall back to the runtime zone. Intl resolves the browser's zone here (this
  // runs client-side), which is exactly the zone the picker will use.
  const usingBrowserZone = zone === ''
  const resolvedZone = usingBrowserZone
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : zone

  // Switching format changes the wire type, so any held value is now stale —
  // clear it rather than feed a wrong-format value back into the picker.
  function changeDayFormat(next: DayValueFormat) {
    setDayFormat(next)
    setDayValue(null)
    setRangeValue({ from: null, to: null })
    setRangeComplete(false)
  }
  function changeInstantFormat(next: InstantValueFormat) {
    setInstantFormat(next)
    setInstantValue(null)
    setBookingValue({ pickup: null, ret: null })
    setBookingComplete(false)
    setBookingOk(null)
  }
  // Switching component changes which config baseline applies, so reset the
  // knobs to that component's defaults — otherwise "420" would read as an
  // override on SingleDateTimePicker (whose baseline is 0).
  function changeKind(next: Kind) {
    setKind(next)
    setKnobs(configDefaults(next))
  }

  const knobDefaults = configDefaults(kind)
  const configOverrides = takesConfig(kind)
    ? configOverridesFor(kind, knobs)
    : {}
  const hasConfig = Object.keys(configOverrides).length > 0
  const configProp = hasConfig ? configOverrides : undefined

  const code = generateCode({
    kind,
    zone,
    format,
    label,
    showFooter,
    disabled,
    includeBlocks,
    precision,
    configOverrides,
  })

  return (
    <div>
      <div className='demo-controls playground-controls'>
        <label>
          component
          <select value={kind} onChange={e => changeKind(e.target.value as Kind)}>
            {KINDS.map(k => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
        <label>
          timeZone
          <select value={zone} onChange={e => setZone(e.target.value)}>
            <option value=''>none → browser zone</option>
            {ZONES.map(z => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </label>
        <label>
          valueFormat
          {isDateOnly(kind) ? (
            <select
              value={dayFormat}
              onChange={e => changeDayFormat(e.target.value as DayValueFormat)}
            >
              {DAY_FORMATS.map(f => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          ) : (
            <select
              value={instantFormat}
              onChange={e =>
                changeInstantFormat(e.target.value as InstantValueFormat)
              }
            >
              {INSTANT_FORMATS.map(f => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          )}
        </label>
        {kind === 'SingleDateTimePicker' && (
          <label>
            precision
            <select
              value={precision}
              onChange={e =>
                setPrecision(e.target.value as 'slots' | 'minute')
              }
            >
              <option value='slots'>slots</option>
              <option value='minute'>minute</option>
            </select>
          </label>
        )}
        {(kind === 'SingleDatePicker' ||
          kind === 'SingleDateTimePicker') && (
          <label>
            label
            <input
              type='text'
              value={label}
              onChange={e => setLabel(e.target.value)}
            />
          </label>
        )}
        <label className='demo-check'>
          <input
            type='checkbox'
            checked={includeBlocks}
            onChange={e => setIncludeBlocks(e.target.checked)}
          />
          blocks (demo availability)
        </label>
        <label className='demo-check'>
          <input
            type='checkbox'
            checked={showFooter}
            onChange={e => setShowFooter(e.target.checked)}
          />
          showFooter
        </label>
        <label className='demo-check'>
          <input
            type='checkbox'
            checked={disabled}
            onChange={e => setDisabled(e.target.checked)}
          />
          disabled
        </label>
      </div>

      {takesConfig(kind) ? (
        <div
          className='demo-controls playground-controls'
          style={{ marginTop: 12 }}
        >
          <span
            style={{
              flexBasis: '100%',
              fontWeight: 700,
              color: 'var(--ink-soft)',
            }}
          >
            config (EngineConfig) — blank inputs sit at the default; change one
            and it appears in <code>config=&#123;&#123;…&#125;&#125;</code>
          </span>
          <label>
            <span className='knob-name'>
              minRentalMinutes
              <InfoTip label='minRentalMinutes' text={KNOB_HELP.minRentalMinutes} />
            </span>
            <small>default {knobDefaults.minRentalMinutes}</small>
            <input
              type='number'
              min={0}
              step={30}
              value={knobs.minRentalMinutes}
              onChange={e =>
                setKnobs({ ...knobs, minRentalMinutes: Number(e.target.value) })
              }
            />
          </label>
          <label>
            <span className='knob-name'>
              leadTimeMinutes
              <InfoTip label='leadTimeMinutes' text={KNOB_HELP.leadTimeMinutes} />
            </span>
            <small>default {knobDefaults.leadTimeMinutes}</small>
            <input
              type='number'
              min={0}
              step={30}
              value={knobs.leadTimeMinutes}
              onChange={e =>
                setKnobs({ ...knobs, leadTimeMinutes: Number(e.target.value) })
              }
            />
          </label>
          <label>
            <span className='knob-name'>
              turnaroundMinutes
              <InfoTip
                label='turnaroundMinutes'
                text={KNOB_HELP.turnaroundMinutes}
              />
            </span>
            <small>default {knobDefaults.turnaroundMinutes}</small>
            <input
              type='number'
              min={0}
              step={30}
              value={knobs.turnaroundMinutes}
              onChange={e =>
                setKnobs({ ...knobs, turnaroundMinutes: Number(e.target.value) })
              }
            />
          </label>
          <label>
            <span className='knob-name'>
              slotIntervalMinutes
              <InfoTip
                label='slotIntervalMinutes'
                text={KNOB_HELP.slotIntervalMinutes}
              />
            </span>
            <small>default {knobDefaults.slotIntervalMinutes}</small>
            <select
              value={knobs.slotIntervalMinutes}
              onChange={e =>
                setKnobs({
                  ...knobs,
                  slotIntervalMinutes: Number(e.target.value),
                })
              }
            >
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={60}>60</option>
            </select>
          </label>
          <label>
            <span className='knob-name'>
              maxAdvanceDays
              <InfoTip label='maxAdvanceDays' text={KNOB_HELP.maxAdvanceDays} />
            </span>
            <small>default {knobDefaults.maxAdvanceDays}</small>
            <input
              type='number'
              min={1}
              value={knobs.maxAdvanceDays}
              onChange={e =>
                setKnobs({ ...knobs, maxAdvanceDays: Number(e.target.value) })
              }
            />
          </label>
        </div>
      ) : (
        <p className='demo-note' style={{ marginTop: 12 }}>
          Date-only pickers don&apos;t take a <code>config</code> prop — they use
          the <code>dateOnlyConfig</code> preset (trip rules zeroed) and are
          bounded with <code>window</code> instead. Switch to a date+time
          component to set these engine knobs.
        </p>
      )}

      <div style={{ marginTop: 24 }}>
        {kind === 'SingleDatePicker' && (
          <SingleDatePicker
            timeZone={zone || undefined}
            valueFormat={dayFormat}
            value={dayValue}
            onChange={next => setDayValue(next)}
            blocks={activeBlocks}
            label={label}
            showFooter={showFooter}
            disabled={disabled}
          />
        )}
        {kind === 'SingleDateTimePicker' && (
          <SingleDateTimePicker
            timeZone={zone || undefined}
            valueFormat={instantFormat}
            value={instantValue}
            onChange={next => setInstantValue(next)}
            blocks={activeBlocks}
            precision={precision}
            config={configProp}
            label={label}
            showFooter={showFooter}
            disabled={disabled}
          />
        )}
        {kind === 'DateOnlyRangePicker' && (
          <DateOnlyRangePicker
            timeZone={zone || undefined}
            valueFormat={dayFormat}
            value={rangeValue}
            onChange={(next, meta) => {
              setRangeValue(next)
              setRangeComplete(meta.complete)
            }}
            blocks={activeBlocks}
            showFooter={showFooter}
            disabled={disabled}
          />
        )}
        {kind === 'DateTimeRangePicker' && (
          <DateTimeRangePicker
            timeZone={zone || undefined}
            valueFormat={instantFormat}
            value={bookingValue}
            onChange={(next, meta) => {
              setBookingValue(next)
              setBookingComplete(meta.complete)
              setBookingOk(meta.verdict ? meta.verdict.ok : null)
            }}
            blocks={activeBlocks}
            config={configProp}
            showFooter={showFooter}
            disabled={disabled}
          />
        )}
      </div>

      <figure className='code-block' style={{ marginTop: 24 }}>
        <figcaption className='code-block-header'>
          <span>your-app.tsx (updates as you change controls)</span>
          <CopyButton code={code} />
        </figcaption>
        <div className='code-block-body' style={{ background: '#24292e' }}>
          <pre style={{ color: '#e6edf3' }}>
            <code>{code}</code>
          </pre>
        </div>
      </figure>

      <StateInspector
        title={`What onChange returned  ·  valueFormat='${format}'`}
        data={returnData({
          kind,
          format,
          zone: resolvedZone,
          usingBrowserZone,
          dayValue,
          instantValue,
          rangeValue,
          rangeComplete,
          bookingValue,
          bookingComplete,
          bookingOk,
        })}
      />

      <p className='demo-note'>
        The <code>valueFormat</code> control is the answer to &quot;what is
        being returned?&quot; — switch it and the return panel above shows the
        exact type and shape your <code>onChange</code> receives. Set{' '}
        <code>timeZone</code> to <strong>none</strong> and the{' '}
        <code>timeZone</code> prop is dropped entirely — the picker falls back
        to your browser&apos;s zone ({resolvedZone}), which the panel shows as
        the resolved zone. Engine math stays UTC epoch milliseconds internally
        regardless.
      </p>
    </div>
  )
}

// ── Live return panel ──────────────────────────────────────────────────

function returnData(s: {
  kind: Kind
  format: string
  zone: string
  usingBrowserZone: boolean
  dayValue: Scalar
  instantValue: Scalar
  rangeValue: { from: Scalar; to: Scalar }
  rangeComplete: boolean
  bookingValue: { pickup: Scalar; ret: Scalar }
  bookingComplete: boolean
  bookingOk: boolean | null
}): Record<string, unknown> {
  const { kind, format, zone } = s
  // When no timeZone is passed, show which zone the picker actually resolved to.
  const zoneRow: Record<string, unknown> = s.usingBrowserZone
    ? { 'timeZone (resolved)': `${zone}   (browser default — no timeZone prop)` }
    : {}
  if (kind === 'SingleDatePicker') {
    return {
      ...zoneRow,
      'value (raw)': JSON.stringify(s.dayValue),
      'typeof': typeTag(s.dayValue),
      decoded: describe(s.dayValue, format, zone),
    }
  }
  if (kind === 'SingleDateTimePicker') {
    return {
      ...zoneRow,
      'value (raw)': JSON.stringify(s.instantValue),
      'typeof': typeTag(s.instantValue),
      decoded: describe(s.instantValue, format, zone),
    }
  }
  if (kind === 'DateOnlyRangePicker') {
    return {
      ...zoneRow,
      'value (raw)': JSON.stringify(s.rangeValue),
      'from': describe(s.rangeValue.from, format, zone),
      'to': describe(s.rangeValue.to, format, zone),
      'meta.complete': String(s.rangeComplete),
    }
  }
  return {
    ...zoneRow,
    'value (raw)': JSON.stringify(s.bookingValue),
    'pickup': describe(s.bookingValue.pickup, format, zone),
    'return': describe(s.bookingValue.ret, format, zone),
    'meta.complete': String(s.bookingComplete),
    'meta.verdict.ok': s.bookingOk === null ? '—' : String(s.bookingOk),
  }
}

// ── Live code generation ───────────────────────────────────────────────

function generateCode(s: {
  kind: Kind
  zone: string
  format: string
  label: string
  showFooter: boolean
  disabled: boolean
  includeBlocks: boolean
  precision: 'slots' | 'minute'
  configOverrides: Partial<EngineKnobs>
}): string {
  const lines: string[] = []
  // "none" → omit the timeZone prop; the picker falls back to the browser zone.
  if (s.zone !== '') lines.push(`  timeZone='${s.zone}'`)
  lines.push(`  valueFormat='${s.format}'`)
  lines.push('  value={value}')

  if (s.kind === 'DateOnlyRangePicker' || s.kind === 'DateTimeRangePicker') {
    lines.push('  onChange={(value, meta) => setValue(value)}')
  } else {
    lines.push('  onChange={setValue}')
  }

  if (s.kind === 'SingleDateTimePicker' && s.precision === 'minute') {
    lines.push(`  precision='minute'`)
  }
  if (s.kind === 'SingleDatePicker' || s.kind === 'SingleDateTimePicker') {
    lines.push(`  label='${s.label}'`)
  }
  if (s.includeBlocks) lines.push('  blocks={blocks}')
  // Only the knobs changed from this component's baseline — pass what differs.
  const overrideKeys = Object.keys(s.configOverrides) as (keyof EngineKnobs)[]
  if (overrideKeys.length > 0) {
    const inner = overrideKeys.map(k => `${k}: ${s.configOverrides[k]}`).join(', ')
    lines.push(`  config={{ ${inner} }}`)
  }
  if (!s.showFooter) lines.push('  showFooter={false}')
  if (s.disabled) lines.push('  disabled')

  return `<${s.kind}\n${lines.join('\n')}\n/>`
}
