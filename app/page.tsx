import Link from 'next/link'

import { NAV } from '@/lib/nav'

export default function HomePage() {
  return (
    <div className='home'>
      <section className='home-hero'>
        <h1>
        Every use case of <span>availability-datetime-picker</span>, live.
        </h1>
        <p>
          A cookbook of runnable demos, honest code samples, and in-depth
          guides for the booking-grade React date/time picker where an
          invalid selection is unselectable — not caught and wiped after the
          fact.
        </p>
        <div className='home-actions'>
          <Link className='primary' href='/docs/installation'>
            Get started
          </Link>
          <Link className='secondary' href='/docs/booking-date-time-picker'>
            See the booking picker
          </Link>
        </div>
      </section>

      {NAV.map(group => (
        <section key={group.title}>
          <p className='home-section-title'>{group.title}</p>
          <div className='home-grid'>
            {group.pages.map(page => (
              <Link
                key={page.slug}
                href={`/docs/${page.slug}`}
                className='home-card'
              >
                <h3>{page.title}</h3>
                <p>{page.lead}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
