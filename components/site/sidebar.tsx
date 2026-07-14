'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NAV } from '@/lib/nav'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className='sidebar' aria-label='Documentation'>
      <Link href='/' className='sidebar-brand'>
        <span className='sidebar-brand-mark' aria-hidden>
          ▦
        </span>
        <span>
          picker-cookbook
          <small>availability-datetime-picker</small>
        </span>
      </Link>
      {NAV.map(group => (
        <div key={group.title} className='sidebar-group'>
          <p className='sidebar-group-title'>{group.title}</p>
          <ul>
            {group.pages.map(page => {
              const href = `/docs/${page.slug}`
              const active = pathname === href
              return (
                <li key={page.slug}>
                  <Link
                    href={href}
                    className={active ? 'sidebar-link active' : 'sidebar-link'}
                    aria-current={active ? 'page' : undefined}
                  >
                    {page.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
