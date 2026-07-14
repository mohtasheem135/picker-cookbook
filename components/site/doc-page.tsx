import Link from 'next/link'
import type { ReactNode } from 'react'

import { flatPages, groupOf, pageBySlug } from '@/lib/nav'

/**
 * Standard page chrome: kicker (group), title, lead, content, prev/next
 * pager. Every docs page wraps itself in this so the anatomy stays uniform.
 */
export function DocPage({ slug, children }: { slug: string; children: ReactNode }) {
  const page = pageBySlug(slug)
  const group = groupOf(slug)
  if (!page || !group) throw new Error(`Unknown docs slug: ${slug}`)

  const flat = flatPages()
  const index = flat.findIndex(p => p.slug === slug)
  const prev = index > 0 ? flat[index - 1] : null
  const next = index < flat.length - 1 ? flat[index + 1] : null

  return (
    <article className='doc'>
      <header className='doc-header'>
        <p className='doc-kicker'>{group.title}</p>
        <h1>{page.title}</h1>
        <p className='doc-lead'>{page.lead}</p>
      </header>
      {children}
      <nav className='pager' aria-label='Pagination'>
        {prev ? (
          <Link href={`/docs/${prev.slug}`} className='pager-link pager-prev'>
            <small>← Previous</small>
            {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/docs/${next.slug}`} className='pager-link pager-next'>
            <small>Next →</small>
            {next.title}
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  )
}
