# TEST-REPORT — availability-datetime-picker v0.1.0

**Date:** 2026-07-15 · **Consumer:** picker-cookbook (Next.js 16 App Router,
React 19, installed from the packed tarball) · **Full log:**
[TEST-LOG.md](./TEST-LOG.md)

## Verdict: ✅ publish-ready

No blockers found. Every machine-checkable layer passes; one advisory item
and one manual pass remain (below), neither gating.

## What was verified

| Layer | Evidence |
| ----- | -------- |
| Engine correctness | 50/50 vitest cases, identical under `TZ=UTC` and `TZ=Pacific/Kiritimati` |
| Static quality | `tsc` clean, eslint clean, build guards (use-client directives, CSS collisions ×161) clean |
| Packed artifact | installs from tarball with only `dist/`; publint clean; attw green for ESM + bundler on both entries |
| Exports map | `.`, `./core`, `./styles.css` all resolve under Next/Turbopack; types resolve for both TS entries |
| SSR/RSC | production build prerenders 17 docs pages statically; `/core` runs inside a Route Handler with no React leakage |
| Consumer API surface | 14 demos exercise all 4 components (incl. `trigger='search-bar'`, `precision='minute'`, `rangeAnchor`, `window`, `error`), `useBookingPicker` headless, `SuggestionBanner` standalone, `onIssues`, `turnaroundMinutes`, engine day classification |
| Server validation | live 200/422 round-trip with structured `OVERLAPS_BLOCKS` violations |
| Reproducibility | `npm run build` in the package produced zero diff against committed `dist/` |

## Advisory (non-blocking)

1. **attw on `/styles.css`** reports "resolution failed" — attw evaluates
   TypeScript resolution for every export; a CSS subpath has none. Bundler
   resolution is proven by this app. No action needed (optionally exclude
   the CSS entry in an attw config to silence it).
2. **CJS consumers** get ESM-dynamic-import-only — matches the documented
   ESM-only design (limitation #8).

## Remaining manual pass (recommended, not gating)

Browser click-through via `npm run dev`: popover ↔ drawer at 768 px,
blocked-day tap shows reason without firing onChange, slot-disable reasons,
runtime retheme reaching the portal. All of these behaviors are encoded in
the demos on `/docs/day-states-and-anti-wipe`, `/docs/theming`, and
`/docs/blocks-and-availability` for quick eyeballing.
