'use client'

import { useEffect, useState } from 'react'

/**
 * Light/dark switch. The actual theme is a `data-theme` attribute on <html>
 * (set before paint by the inline script in app/layout.tsx); this button
 * just flips it and persists the choice. Hand-rolled rather than shadcn/ui:
 * shadcn requires Tailwind, and this site is deliberately Tailwind-free to
 * prove the package needs no CSS framework.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('pc-theme', next)
    } catch {
      /* storage unavailable — theme just won't persist */
    }
  }

  return (
    <button
      type='button'
      className='theme-toggle'
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  )
}
