'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  DateTimeRangePicker,
  type BookingValue,
} from 'availability-datetime-picker'

import { demoBlocks } from '@/lib/demo-data'

const THEMES: Record<string, Record<string, string>> = {
  Default: {},
  Violet: {
    '--bdp-primary': '#7c3aed',
    '--bdp-primary-dark': '#5b21b6',
    '--bdp-primary-pale': '#f1e9fe',
    '--bdp-radius-sm': '6px',
    '--bdp-radius-md': '8px',
  },
  Forest: {
    '--bdp-primary': '#047857',
    '--bdp-primary-dark': '#065f46',
    '--bdp-primary-pale': '#e7f6ef',
    '--bdp-border-muted': '#d7e4dc',
    '--bdp-radius-lg': '26px',
  },
  Amber: {
    '--bdp-primary': '#b45309',
    '--bdp-primary-dark': '#92400e',
    '--bdp-primary-pale': '#fdf0e0',
    '--bdp-border-width-medium': '2px',
  },
}

const ALL_VARS = Array.from(
  new Set(Object.values(THEMES).flatMap(t => Object.keys(t))),
)

/**
 * Runtime retheme: set --bdp-* custom properties on :root. It must be :root
 * (not a wrapper) because the popover/drawer portals to <body> — variables
 * scoped to an ancestor of the trigger never reach the portal.
 */
export function ThemeEditor() {
  const blocks = useMemo(demoBlocks, [])
  const [value, setValue] = useState<BookingValue>({ pickup: null, ret: null })
  const [theme, setTheme] = useState('Default')

  useEffect(() => {
    const root = document.documentElement
    ALL_VARS.forEach(v => root.style.removeProperty(v))
    Object.entries(THEMES[theme]!).forEach(([k, v]) =>
      root.style.setProperty(k, v),
    )
    // Leaving the page restores the stock theme.
    return () => ALL_VARS.forEach(v => root.style.removeProperty(v))
  }, [theme])

  return (
    <div style={{ maxWidth: 460 }}>
      <div className='demo-controls'>
        {Object.keys(THEMES).map(name => (
          <button
            key={name}
            type='button'
            onClick={() => setTheme(name)}
            style={{
              font: 'inherit',
              padding: '5px 14px',
              borderRadius: 8,
              cursor: 'pointer',
              color: 'var(--ink)',
              border:
                theme === name
                  ? '2px solid var(--brand)'
                  : '1px solid var(--line-strong)',
              background: theme === name ? 'var(--brand-pale)' : 'var(--card)',
              fontWeight: theme === name ? 650 : 450,
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <DateTimeRangePicker
        blocks={blocks}
        timeZone='America/New_York'
        value={value}
        onChange={next => setValue(next)}
      />
      <p className='demo-note'>
        Open the picker after switching themes — the popover retheme proves
        the tokens reach the portal.
      </p>
    </div>
  )
}
