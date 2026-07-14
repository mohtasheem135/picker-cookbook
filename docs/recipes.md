# Recipes

Live page: `/docs/recipes` (snippets; no live demo)

Integration patterns. Common thread: the picker owns in-progress selection;
`meta.complete` + `verdict` decide when the outside world hears about it.

## react-hook-form

Keep `Instant | null` (or `DayKey`) in form state via `Controller`; convert
units in the submit handler, never in the field.

```tsx
<Controller control={control} name='returnAt'
  render={({ field }) => (
    <SingleDateTimePicker timeZone={zone} value={field.value}
      onChange={next => field.onChange(next)} />
  )} />
```

## Refresh availability on open

```tsx
<BookingDateTimePicker
  blocks={blocks}
  onOpenChange={open => { if (open) refetch() }}
  onIssues={issues => monitoring.report('bad-blocks', issues)} />
```

## URL as a projection of state

Write only complete + valid ranges to the URL; keep in-progress picking
local; read the URL once on mount. Avoids router-vs-picker fights.

```tsx
onChange={(next, { complete, verdict }) => {
  setValue(next)
  if (complete && verdict?.ok !== false)
    router.replace(`?pickup=${next.pickup}&ret=${next.ret}`)
}}
```

## Optimistic persist with server re-check

Trust the verdict locally; POST to the server (see
[server-side-validation.md](./server-side-validation.md)); on 422, refetch
blocks and offer `suggestNearestWindow`.
