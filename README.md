# picker-cookbook

Use-case cookbook, documentation site, and consumer-side test bed for the
[`availability-datetime-picker`](https://www.npmjs.com/package/availability-datetime-picker)
npm package.

Every use case of the package — 4 styled components, 4 headless hooks, the
pure availability engine, theming, time zones, server-side validation — is
documented as a **live demo + the exact source running it + an in-depth
guide**, in the style of a professional component-library docs site.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

The package is installed from the packed tarball
(`../availability-datetime-picker-0.1.0.tgz`), so this app consumes exactly
what npm consumers get: only `dist/`, the real exports map, the shipped
types.

## Layout

- `app/docs/<slug>/page.tsx` — one route per use case (17 pages in 5 groups)
- `components/demos/` — the live demos (each page displays its demo's real
  source via `lib/source.ts`, so samples can never drift)
- `components/site/` — docs-site building blocks (DemoFrame, CodeBlock,
  PropsTable, StateInspector, …)
- `docs/` — markdown mirrors of every page + `INDEX.md` + `TEST-LOG.md`
- `CLAUDE.md` — the binding docs-in-parallel contract: code changes must
  update their matching docs in the same session

## As a test bed

`npm run build` doubles as the package's SSR/RSC gate (Next 16 App Router,
one Route Handler importing `availability-datetime-picker/core`
server-side). All verifications are logged in `docs/TEST-LOG.md`.
