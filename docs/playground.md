# Playground

Live page: `/docs/playground`

An interactive sandbox for all four styled components. It answers two
questions consumers keep asking: *"can I try the props without writing code?"*
and *"what exactly does `onChange` return?"*

## What the page demonstrates

- A **component switcher** across `SingleDatePicker`, `SingleDateTimePicker`,
  `DateOnlyRangePicker`, and `DateTimeRangePicker`.
- **Real prop controls** — every control maps to a genuine prop, no demo-only
  modes: `timeZone`, `valueFormat`, `precision` (SingleDateTimePicker only),
  `label`, `blocks` on/off, `showFooter`, `disabled`.
- **Engine `config` knobs** (date+time components only) — `minRentalMinutes`,
  `leadTimeMinutes`, `turnaroundMinutes`, `slotIntervalMinutes`,
  `maxAdvanceDays`, each labeled with its default and carrying an ⓘ help tooltip
  (hover or keyboard-focus) that explains what the knob does; see the config
  section below.
- The `timeZone` control includes a **none → browser zone** option. Selecting
  it omits the `timeZone` prop entirely; the picker then falls back to the
  runtime zone, and the return panel shows the resolved zone. This is the live
  proof of the optional-`timeZone` behaviour.
- Three synchronized outputs: the **live picker**, a **generated code
  snippet** that updates as controls change (copyable), and a **"What onChange
  returned" panel** showing the raw value, its `typeof`, and a human-readable
  decoding.

## Package APIs used

- Components: `SingleDatePicker`, `SingleDateTimePicker`,
  `DateOnlyRangePicker`, `DateTimeRangePicker`.
- Types: `DayValueFormat` (`'day-key' | 'epoch-ms' | 'epoch-seconds' | 'iso'`)
  and `InstantValueFormat` (`'epoch-ms' | 'epoch-seconds' | 'iso'`).
- `SinglePrecision` is `'slots' | 'minute'` (note the singular `'minute'`).

## What exactly is returned?

The `valueFormat` prop makes each component generic over its wire format;
`value` and `onChange` speak whatever you pick, while the engine always
computes over UTC epoch milliseconds internally.

| valueFormat | JS type | Meaning |
| ----------- | ------- | ------- |
| `'day-key'` | `string` | `'yyyy-MM-dd'`, zone-independent (date-only default) |
| `'epoch-ms'` | `number` | ms since Unix epoch (date+time default) |
| `'epoch-seconds'` | `number` | seconds (÷1000 of epoch-ms) |
| `'iso'` | `string` | ISO-8601 |

Date-only pickers accept all four; date+time pickers accept the three instant
formats. For date-only values in an instant format, the number/string encodes
the day's **start** in the selected `timeZone`.

## Engine config knobs (`config` prop)

`minRentalMinutes`, `leadTimeMinutes`, `slotIntervalMinutes`, and
`maxAdvanceDays` are fields of `EngineConfig`. You pass them through the
**`config`** prop — `Partial<Omit<EngineConfig, 'timeZone'>>` — which exists
only on the **date+time** components (`DateTimeRangePicker`,
`SingleDateTimePicker`). Date-only pickers (`SingleDatePicker`,
`DateOnlyRangePicker`) have no `config` prop: they run the `dateOnlyConfig`
preset (trip rules zeroed) and are bounded with `window` instead. The
playground shows the four knobs only for the date+time components.

```tsx
<DateTimeRangePicker
  timeZone='Asia/Kolkata'
  value={value}
  onChange={(value, meta) => setValue(value)}
  config={{ minRentalMinutes: 120, leadTimeMinutes: 0 }}  // override only what differs
/>
```

**Defaults are component-dependent.** `DateTimeRangePicker` uses the raw
`ENGINE_DEFAULTS`; `SingleDateTimePicker` runs `singleInstantConfig`, which
zeroes the trip rules:

| Knob | Default (DateTimeRangePicker) | Default (SingleDateTimePicker) | Meaning |
| ---- | :---: | :---: | ------- |
| `minRentalMinutes` | `420` | `0` | shortest trip (7 h) |
| `leadTimeMinutes` | `60` | `0` | earliest pickup = now + this |
| `turnaroundMinutes` | `0` | `0` | gap required next to blocks, both sides |
| `slotIntervalMinutes` | `30` | `30` | selectable tick size |
| `maxAdvanceDays` | `365` | `365` | booking horizon |

`turnaroundMinutes` pads every block on **both** sides — a trip must start at
least that long after a block ends and end at least that long before the next
block starts (default `0` = back-to-back allowed). Only pass the knobs you want
to change; unset fields keep the default. The playground's generated snippet
reflects this — it emits a `config={{…}}` line containing **only** the knobs you
moved off the baseline.

## Primary code sample

The controlled pattern the playground itself uses — the selected
`valueFormat` passes straight through:

```tsx
const [value, setValue] = useState(null)

<SingleDatePicker
  timeZone='Asia/Kolkata'
  valueFormat='epoch-ms'   // value + onChange are now numbers
  value={value}
  onChange={setValue}
/>
```

## Gotchas

- **Switching format clears the value.** A value in one wire format is not
  valid in another, so the playground resets the selection to `null` on a
  `valueFormat` change. In a real app, pick one format up front.
- The generated snippet omits props left at their defaults (no `showFooter`
  line means `true`) — that is how you would write it by hand.
- `timeZone` is display-only; changing it re-labels the same instant, it does
  not shift the stored value.
