import type { ReactNode } from 'react'

/**
 * Frame around a live demo: labels it, gives the picker breathing room, and
 * visually separates "this is running" from the prose around it.
 */
export function DemoFrame({
  children,
  hint,
}: {
  children: ReactNode
  hint?: string
}) {
  return (
    <section className='demo-frame'>
      <div className='demo-frame-header'>
        <span className='demo-frame-dot' aria-hidden />
        Live demo
        {hint && <span className='demo-frame-hint'>{hint}</span>}
      </div>
      <div className='demo-frame-body'>{children}</div>
    </section>
  )
}
