# TEST-LOG — verifications of availability-datetime-picker v0.1.0

Consumer-side test log. Every check of the package performed through or
alongside this cookbook gets a row. Newest last.

| Date | Scenario | Method | Result |
| ---- | -------- | ------ | ------ |
| 2026-07-15 | Tarball installs as a real npm consumer | `npm install` with `file:../availability-datetime-picker-0.1.0.tgz` (only `dist/` present, real exports map) | ✅ installed clean, peer deps react/react-dom 19 satisfied |
| 2026-07-15 | Types resolve from the packed artifact | `tsc --noEmit` across 17 pages + 14 demos importing root and `/core` | ✅ zero errors — all prop/hook/type names checked against shipped `.d.ts` |
| 2026-07-15 | SSR/RSC production build | `next build` (Next 16, Turbopack): 20 static routes + 1 dynamic API route | ✅ compiled; all docs pages prerendered; no hydration-unsafe imports flagged |
| 2026-07-15 | `/core` subpath is server-safe | `app/api/quote/route.ts` imports `createAvailabilityEngine` from `availability-datetime-picker/core` in a Route Handler | ✅ builds and executes server-side (no React, no 'use client' leakage) |
