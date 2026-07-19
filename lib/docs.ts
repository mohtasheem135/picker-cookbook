import fs from 'node:fs'
import path from 'node:path'

import { NAV } from './nav'

/**
 * Agent-facing doc assembly. `readDoc` pulls a `docs/<slug>.md` mirror; the
 * builders compose `/llms.txt` (an llmstxt.org index) and `/llms-full.txt`
 * (every page concatenated) from those mirrors in nav order — so the agent
 * files never drift from the site as long as the docs-in-parallel rule holds.
 * Server-only (used from route handlers at build time).
 */

const DOCS_DIR = path.join(process.cwd(), 'docs')

const SUMMARY =
  'Availability-aware date & time pickers for React — a pure booking engine, headless hooks, and styled components for range, single date-time, and date-only selection. Date+time values are UTC epoch milliseconds; date-only values are DayKey strings ("yyyy-MM-dd"); timeZone is display-only.'

/** Absolute base for links, from NEXT_PUBLIC_SITE_URL; falls back to root-relative. */
function base(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '')
}

export function readDoc(slug: string): string | null {
  try {
    return fs.readFileSync(path.join(DOCS_DIR, `${slug}.md`), 'utf8').trim()
  } catch {
    return null
  }
}

/** `/llms.txt` — the curated index agents look for first. */
export function buildLlmsIndex(): string {
  const b = base()
  const lines: string[] = [
    '# availability-datetime-picker',
    '',
    `> ${SUMMARY}`,
    '',
    'Documentation index for coding agents. Fetch /llms-full.txt for every page as one markdown file.',
    '',
    '## Start here',
    `- [Using with AI agents](${b}/docs/for-agents): condensed install, API, config, gotchas, and copy-paste snippets.`,
    `- [Full docs (one file)](${b}/llms-full.txt): every page below, concatenated.`,
    '',
  ]
  for (const group of NAV) {
    lines.push(`## ${group.title}`)
    for (const p of group.pages) {
      lines.push(`- [${p.title}](${b}/docs/${p.slug}): ${p.lead}`)
    }
    lines.push('')
  }
  return lines.join('\n').trim() + '\n'
}

/** `/llms-full.txt` — the For-agents guide first, then every page in nav order. */
export function buildLlmsFull(): string {
  const parts: string[] = [
    '# availability-datetime-picker — full documentation',
    '',
    `> ${SUMMARY}`,
    '',
    'Generated from the picker-cookbook docs. Each section below is one documentation page.',
  ]
  const navSlugs = NAV.flatMap(g => g.pages.map(p => p.slug))
  const ordered = ['for-agents', ...navSlugs.filter(s => s !== 'for-agents')]
  for (const slug of ordered) {
    const md = readDoc(slug)
    if (!md) continue
    parts.push('', '---', '', md)
  }
  return parts.join('\n').trim() + '\n'
}
