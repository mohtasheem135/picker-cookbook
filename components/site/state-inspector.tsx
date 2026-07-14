'use client'

/**
 * Live view of a demo's state — the docs-site equivalent of a debugger
 * watch panel. Demos pass already-formatted display values.
 */
export function StateInspector({
  data,
  title = 'Live state',
}: {
  data: Record<string, unknown>
  title?: string
}) {
  return (
    <div className='state-inspector'>
      <p className='state-inspector-title'>{title}</p>
      <dl>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className='state-inspector-row'>
            <dt>{key}</dt>
            <dd>
              <code>
                {typeof value === 'string'
                  ? value
                  : JSON.stringify(value, null, 1)}
              </code>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
