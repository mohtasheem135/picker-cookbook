import type { Metadata } from 'next'

import { Callout } from '@/components/site/callout'
import { CodeBlock } from '@/components/site/code-block'
import { DocPage } from '@/components/site/doc-page'

export const metadata: Metadata = { title: 'Recipes' }

const RHF = `// react-hook-form: keep Instant | null in form state via Controller;
// convert to your API's format in the submit handler, not in the field.
import { Controller, useForm } from 'react-hook-form'

type FormValues = { returnAt: number | null }

const { control, handleSubmit } = useForm<FormValues>({
  defaultValues: { returnAt: null },
})

<form onSubmit={handleSubmit(v => api.setReturn({ epochSec: Math.round(v.returnAt! / 1000) }))}>
  <Controller
    control={control}
    name='returnAt'
    rules={{ required: 'Pick the return time' }}
    render={({ field, fieldState }) => (
      <SingleDateTimePicker
        timeZone={zone}
        value={field.value}
        onChange={next => field.onChange(next)}
        label='Actual return'
        disabledReason={fieldState.error?.message}
      />
    )}
  />
</form>`

const REFRESH = `// Availability changes while the page sits open. Refetch when the picker
// opens; pass the fresh blocks straight back down — the open picker
// re-derives day states and slots on the next render.
const { data: blocks = [], refetch } = useQuery(['blocks', carId], fetchBlocks)

<BookingDateTimePicker
  blocks={blocks}
  onOpenChange={open => { if (open) refetch() }}
  onIssues={issues => monitoring.report('bad-blocks', { carId, issues })}
  …
/>`

const URL_STATE = `// URL as a projection of state: write only COMPLETE, VALID ranges to the
// URL; keep in-progress picking in local state; read the URL once on mount.
const [value, setValue] = useState<BookingValue>(() => readFromUrl())

<BookingDateTimePicker
  value={value}
  onChange={(next, { complete, verdict }) => {
    setValue(next)                          // local state: every keystroke
    if (complete && verdict?.ok !== false) {
      router.replace(\`?pickup=\${next.pickup}&ret=\${next.ret}\`)  // URL: only settled
    }
  }}
  …
/>`

const OPTIMISTIC = `// Persist with optimistic UI + server re-validation (see
// /docs/server-side-validation): trust the verdict locally, verify remotely.
onChange={async (next, { complete, verdict }) => {
  setValue(next)
  if (!complete || verdict?.ok === false) return
  setSaving(true)
  const res = await fetch('/api/quote', { method: 'POST', body: JSON.stringify(next) })
  if (!res.ok) {
    // Availability changed under the user: offer the nearest window.
    const engine = createAvailabilityEngine(await refetchBlocks(), { timeZone })
    setOffer(engine.suggestNearestWindow({ pickup: next.pickup!, ret: next.ret! }))
  }
  setSaving(false)
}}`

export default function Page() {
  return (
    <DocPage slug='recipes'>
      <p>
        Integration patterns that come up in every real app. Each is a
        problem statement + the shape of the fix — copy and adapt.
      </p>

      <h2>react-hook-form</h2>
      <p>
        The pickers are controlled components, so they drop into{' '}
        <code>Controller</code> directly. Keep the raw <code>Instant</code>{' '}
        (or <code>DayKey</code>) in form state; convert units only on submit:
      </p>
      <CodeBlock code={RHF} title='with-react-hook-form.tsx' />

      <h2>Refresh availability on open</h2>
      <p>
        Blocks go stale the moment another guest books. The picker&apos;s
        open event is the natural refetch trigger:
      </p>
      <CodeBlock code={REFRESH} title='refetch-on-open.tsx' />

      <h2>URL as a projection of state</h2>
      <p>
        Round-tripping half-picked state through the URL causes fights
        between the router and the picker. Project one way instead:
      </p>
      <CodeBlock code={URL_STATE} title='url-projection.tsx' />

      <h2>Optimistic persist with server re-check</h2>
      <CodeBlock code={OPTIMISTIC} title='optimistic-persist.tsx' />

      <Callout type='tip' title='The common thread'>
        <p>
          Every recipe treats the picker as the single owner of in-progress
          selection and lets <code>meta.complete</code> +{' '}
          <code>verdict</code> decide when the outside world (form, URL,
          API) hears about it.
        </p>
      </Callout>
    </DocPage>
  )
}
