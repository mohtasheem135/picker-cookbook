# Performance & bundle size

Live page: `/docs/performance` (tables; no demo). All numbers **measured**
against the installed v0.1.0 tarball (Node 24, Apple Silicon) — methodology
rows in [TEST-LOG.md](./TEST-LOG.md).

## Shipped artifact

| Artifact | Raw | Gzip |
| -------- | --- | ---- |
| npm tarball | 48.3 KB | — |
| All JS (components + hooks + engine) | 96.8 KB | **21.6 KB** |
| `/core` alone (engine, zero React) | 29.6 KB | **7.7 KB** |
| `styles.css` | 13.7 KB | **3.3 KB** |
| Type declarations | 41.2 KB | not shipped to browsers |

ESM-only + tree-shakeable: styled components pull everything; headless
hooks skip the 4 UI deps; `/core` pulls only `@date-fns/tz`.

## Dependencies

react-day-picker (calendar; ~5 MB on disk is mostly locale data bundlers
drop) · @radix-ui/react-popover (~112 KB) · @radix-ui/react-tooltip
(~152 KB) · vaul (~196 KB) · @date-fns/tz (~200 KB; uses platform `Intl`,
no bundled tz database). node_modules size ≠ bundle cost.

## Engine benchmarks

| Operation | Cost |
| --------- | ---- |
| `createAvailabilityEngine`, 100 blocks | ~0.016 ms |
| `dayInfo` | ~0.002 ms/call (a year classifies in <1 ms) |
| `pickupSlots` (48 slots) | ~0.08 ms/call |
| `validateRange` | ~0.0006 ms/call |

## Render path

One memoized engine per picker (keep `blocks`/`config` referentially
stable); zero idle work while closed; triggers O(1); SSR-safe; theming via
CSS custom properties (zero JS).

## Real-app data point

This whole 18-page site incl. Next 16 runtime: ~318 KB gz total client JS
(1,020 KB raw), shared via chunking.

## Watch-outs

Inline `blocks`/`config` literals re-created per render; thousands of
blocks → merge server-side (`mergeBlocks`) and send only the reachable
window.
