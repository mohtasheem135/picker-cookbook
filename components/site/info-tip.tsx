'use client'

/**
 * Small ⓘ help icon with a hover/focus tooltip. Pure CSS positioning (no
 * portal); the bubble opens upward so it clears the input below and stays
 * inside the demo frame. Keyboard-reachable — the trigger is a real button
 * and the bubble shows on `:focus-within`.
 */
export function InfoTip({ text, label }: { text: string; label?: string }) {
  return (
    <span className='infotip'>
      <button
        type='button'
        className='infotip-trigger'
        aria-label={label ? `What is ${label}?` : 'More info'}
      >
        <svg width='14' height='14' viewBox='0 0 16 16' aria-hidden='true'>
          <circle cx='8' cy='8' r='7' fill='none' stroke='currentColor' strokeWidth='1.4' />
          <circle cx='8' cy='4.6' r='0.95' fill='currentColor' />
          <rect x='7.2' y='6.7' width='1.6' height='5' rx='0.8' fill='currentColor' />
        </svg>
      </button>
      <span role='tooltip' className='infotip-bubble'>
        {text}
      </span>
    </span>
  )
}
