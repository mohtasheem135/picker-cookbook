/**
 * Single source of truth for the cookbook's navigation. Every docs page
 * registers here; the sidebar, page headers, and prev/next pager all render
 * from this list. Adding a page = add a route folder + one entry here + one
 * mirror file in docs/ (see CLAUDE.md).
 */
export interface NavPage {
  slug: string
  title: string
  /** One-line "when to use this" shown under the page title. */
  lead: string
}

export interface NavGroup {
  title: string
  pages: NavPage[]
}

export const NAV: NavGroup[] = [
  {
    title: 'Getting started',
    pages: [
      {
        slug: 'installation',
        title: 'Installation',
        lead: 'Install the package, load the stylesheet once, render your first picker.',
      },
      {
        slug: 'core-concepts',
        title: 'Core concepts',
        lead: 'The five facts about values, zones, and blocks that every other page builds on.',
      },
    ],
  },
  {
    title: 'Components',
    pages: [
      {
        slug: 'booking-date-time-picker',
        title: 'BookingDateTimePicker',
        lead: 'Trip range with pickup and return times — the flagship booking flow.',
      },
      {
        slug: 'single-date-time-picker',
        title: 'SingleDateTimePicker',
        lead: 'One date + one time, as 30-minute slots or exact-minute entry.',
      },
      {
        slug: 'single-date-picker',
        title: 'SingleDatePicker',
        lead: 'One date, no time — service dates, maintenance dates, form fields.',
      },
      {
        slug: 'date-only-range-picker',
        title: 'DateOnlyRangePicker',
        lead: 'A date range without times — list filters, availability windows.',
      },
      {
        slug: 'suggestion-banner',
        title: 'SuggestionBanner',
        lead: 'Offer the nearest available window instead of a dead error.',
      },
    ],
  },
  {
    title: 'Concepts',
    pages: [
      {
        slug: 'blocks-and-availability',
        title: 'Blocks & availability',
        lead: 'RawBlockInput, half-open intervals, parse issues, and turnaround gaps.',
      },
      {
        slug: 'engine-config',
        title: 'Engine config',
        lead: 'Every EngineConfig knob, live — lead time, min duration, horizon, windows.',
      },
      {
        slug: 'timezones',
        title: 'Time zones',
        lead: 'Why timeZone is display-only, proven with one value in three zones.',
      },
      {
        slug: 'day-states-and-anti-wipe',
        title: 'Day states & anti-wipe',
        lead: 'The five day statuses, six slot-disabled reasons, and why nothing ever wipes.',
      },
    ],
  },
  {
    title: 'Advanced',
    pages: [
      {
        slug: 'theming',
        title: 'Theming',
        lead: 'Retheme at runtime with --bdp-* tokens — no Tailwind, no rebuild.',
      },
      {
        slug: 'headless-hooks',
        title: 'Headless hooks',
        lead: 'Build your own UI on the exact state machines the styled components use.',
      },
      {
        slug: 'server-side-validation',
        title: 'Server-side validation',
        lead: 'Re-validate on the server with the React-free /core subpath.',
      },
      {
        slug: 'recipes',
        title: 'Recipes',
        lead: 'Forms, refetch-on-open, URL state, and other integration patterns.',
      },
    ],
  },
  {
    title: 'Reference',
    pages: [
      {
        slug: 'api-reference',
        title: 'API reference',
        lead: 'Every export from the root entry and the /core subpath, with links to demos.',
      },
      {
        slug: 'limitations-and-troubleshooting',
        title: 'Limitations & troubleshooting',
        lead: 'What the package deliberately does not do, and fixes for common symptoms.',
      },
    ],
  },
]

export function flatPages(): NavPage[] {
  return NAV.flatMap(group => group.pages)
}

export function pageBySlug(slug: string): NavPage | undefined {
  return flatPages().find(p => p.slug === slug)
}

export function groupOf(slug: string): NavGroup | undefined {
  return NAV.find(g => g.pages.some(p => p.slug === slug))
}
