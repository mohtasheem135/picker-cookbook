# TEST-LOG — verifications of availability-datetime-picker v0.1.0

Consumer-side test log. Every check of the package performed through or
alongside this cookbook gets a row. Newest last.

| Date | Scenario | Method | Result |
| ---- | -------- | ------ | ------ |
| 2026-07-15 | Tarball installs as a real npm consumer | `npm install` with `file:../availability-datetime-picker-0.1.0.tgz` (only `dist/` present, real exports map) | ✅ installed clean, peer deps react/react-dom 19 satisfied |
| 2026-07-15 | Types resolve from the packed artifact | `tsc --noEmit` across 17 pages + 14 demos importing root and `/core` | ✅ zero errors — all prop/hook/type names checked against shipped `.d.ts` |
| 2026-07-15 | SSR/RSC production build | `next build` (Next 16, Turbopack): 20 static routes + 1 dynamic API route | ✅ compiled; all docs pages prerendered; no hydration-unsafe imports flagged |
| 2026-07-15 | `/core` subpath is server-safe | `app/api/quote/route.ts` imports `createAvailabilityEngine` from `availability-datetime-picker/core` in a Route Handler | ✅ builds and executes server-side (no React, no 'use client' leakage) |
| 2026-07-15 | Engine test matrix, zone-independent | package repo: `npm run test:tz` (vitest under `TZ=UTC` then `TZ=Pacific/Kiritimati`) | ✅ 50/50 tests pass in both zones |
| 2026-07-15 | Package static gates | package repo: `npm run typecheck`, `npm run lint`, `npm run build` (fix-extensions + use-client directive guard + CSS-collision guard: 161 rules) | ✅ all clean; rebuild produced zero diff in committed `dist/` (reproducible) |
| 2026-07-15 | Publish readiness of the artifact | `npx publint` (packs and lints) · `npx attw --pack .` | ✅ publint "All good". attw: root + `/core` green for ESM/bundler; CJS shows expected "dynamic import only" (ESM-only by design); `/styles.css` "resolution failed" is attw checking TS resolution on a CSS export — non-issue, bundler resolution proven by this app |
| 2026-07-15 | All routes serve under production SSR | `next start` + HTTP GET on all 18 routes (home + 17 docs pages) | ✅ 18× HTTP 200; SSR HTML contains expected content and `bdp`-classed picker triggers |
| 2026-07-15 | Server rejects what the UI would never allow | POST `/api/quote`: valid range and a range overlapping the seeded booked trip | ✅ valid → 200 `{ok:true}`; tampered → 422 `OVERLAPS_BLOCKS` with offending block + human-readable message |
| 2026-07-15 | Interactive browser click-through (popover/drawer, blocked-day reasons, retheme, breakpoints) | manual — `npm run dev` | ⏳ pending human pass; all machine-checkable layers green |
| 2026-07-15 | Workspace restructure: package moved to sibling `../availability-datetime-picker/`, tarball re-packed (79 files), dependency path updated | `rm -rf node_modules package-lock.json && npm install` + `next build` | ✅ install clean, all 21 routes build; consumer unaffected by relocation |
| 2026-07-15 | Package v0.1.0 feature update: `valueFormat` wire formats + `showFooter` + footer border fix (`bdp-bw-hairline-t`) | package gates: typecheck, lint, `test:tz` (59 tests ×2 zones incl. 9 new codec tests), build guards; tarball re-packed and re-installed here | ✅ all green; new utility present in shipped styles.css |
| 2026-07-15 | New codec exports usable from the packed artifact | `node` ESM import of `/core`: `encodeInstant(…, 'iso')`, `decodeDay(epoch-s, 'Asia/Kolkata')`, `encodeDay(…, 'epoch-seconds')` | ✅ correct zone-sensitive results at runtime |
| 2026-07-15 | valueFormat via the components (typed) | `value-formats.tsx` demo — SingleDateTimePicker `valueFormat='iso'` (string state) + SingleDatePicker `valueFormat='epoch-seconds'` (number state) compile against shipped `.d.ts` and render | ✅ typecheck + `next build` green |
| 2026-07-15 | Cookbook UI: dark/light toggle + code-block readability fix | inline-code CSS no longer leaks into shiki blocks (`:not(pre) > code`); `data-theme` boot script + `--bdp-*` dark tokens; `next build` | ✅ builds; manual visual pass recommended |
