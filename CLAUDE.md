# picker-cookbook — agent contract

Use-case cookbook and consumer-side test bed for the npm package
`availability-datetime-picker`, whose source lives in the sibling folder
`../availability-datetime-picker/` (this project installs its packed
tarball, `../availability-datetime-picker/availability-datetime-picker-0.1.0.tgz`).
Every use case of the package
is documented as a live demo + honest code sample + prose guide.

## The docs-in-parallel rule (binding)

**Every change that adds or edits code in this project MUST, in the same
working session, update the matching markdown documentation.** Code without
its doc is an incomplete change — do not stop, commit, or hand off until
both sides are updated.

Concretely:

1. **New or changed demo/page** (`components/demos/*.tsx`,
   `app/docs/<slug>/page.tsx`) → update `docs/<slug>.md` (create it if
   missing) with: what the page demonstrates, the package APIs it uses, the
   primary code sample, and gotchas. Keep it faithful to the page — same
   claims, same API names.
2. **New page** → also add the entry to `lib/nav.ts` (the single nav source
   of truth) AND a row in `docs/INDEX.md`.
3. **Any verification of the package** (manual click-through, build gate,
   API probe) → append a row to `docs/TEST-LOG.md` (date, scenario, result).
4. **Site infrastructure changes** (`components/site/`, `lib/`,
   `app/layout.tsx`, `app/globals.css`) → update the conventions section
   below if a convention changed.

## Structure conventions

- One route per use case: `app/docs/<slug>/page.tsx` (server component).
  Page anatomy, in order: lead (from `lib/nav.ts`) → live demo in
  `<DemoFrame>` → "How to use it" walkthrough → `<CodeBlock>` with the demo
  source → `<PropsTable>` → variations → gotchas/related.
- Demos live in `components/demos/*.tsx`, are `'use client'`, hold their own
  state, and render a `<StateInspector>` showing live values. Pages display
  demo source via `readDemoSource('<file>.tsx')` (`lib/source.ts`) so the
  shown code can never drift from the running code.
- Demo availability data comes from `lib/demo-data.ts` (`demoBlocks()`,
  `demoNow()` — hour-stable to keep SSR hydration clean). Don't call
  `Date.now()` raw in anything that renders during SSR.
- `RawBlockInput` is `{ id, startMs, endMs, kind, label? }` (epoch ms,
  half-open `[startMs, endMs)`). Never invent ISO-string block shapes.
- Memoize `blocks` and `config` objects passed to package components/hooks.
- Site styling is hand-rolled CSS in `app/globals.css` (no Tailwind, by
  design — the site proves the package needs no CSS framework).

## Package facts that must stay true in docs

- Values: `Instant` = UTC epoch ms; date-only values are `DayKey`
  `'yyyy-MM-dd'` strings. `timeZone` is display-only.
- Blocks are half-open; blocked days stay clickable (anti-wipe).
- `/core` subpath is server-safe (no React, no `'use client'`).
- Engine defaults: minRental 420, slots 30, lead 60, turnaround 0,
  horizon 365.

## Commands

- `npm run dev` — local docs site
- `npm run build` — production build; also the SSR/RSC gate for the package
- `npm run typecheck` — TS against the tarball's shipped types

After changing the package itself (in `../availability-datetime-picker`):
rebuild + `npm pack` there, then here
`rm -rf node_modules package-lock.json && npm install` to pick up the fresh
tarball, then `npm run build`, then log it in `docs/TEST-LOG.md`.
