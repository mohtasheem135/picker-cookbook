import type { ReactNode } from 'react'

const ICONS = { info: 'ℹ', tip: '✦', warn: '⚠' } as const

export function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: keyof typeof ICONS
  title?: string
  children: ReactNode
}) {
  return (
    <aside className={`callout callout-${type}`}>
      <span className='callout-icon' aria-hidden>
        {ICONS[type]}
      </span>
      <div>
        {title && <p className='callout-title'>{title}</p>}
        <div className='callout-body'>{children}</div>
      </div>
    </aside>
  )
}
