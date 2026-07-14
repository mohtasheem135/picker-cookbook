# Limitations & troubleshooting

Live page: `/docs/limitations-and-troubleshooting`

## Deliberate exclusions (design boundaries, not bugs)

1. Half-open block semantics are the consumer's contract to uphold.
2. No per-resource settings source — wire your own `EngineConfig`.
3. No live availability push — blocks are last-passed-in; refetch on open.
4. One display zone per picker instance.
5. Theming is `:root`-level only (portals; no per-instance forwarding).
6. No time-only micro-popover; no roving arrow-key slot navigation.
7. Mobile calendar pages month-by-month (no infinite scroll).
8. ESM-only (no CommonJS build).

## Troubleshooting

| Symptom | Cause | Fix |
| ------- | ----- | --- |
| Day off by one | DayKey went through `new Date()` in the wrong zone | keep strings; convert with `dayStart`/`endOfDay` |
| All slots disabled | lead time (default 60 min) | `leadTimeMinutes: 0` for non-booking surfaces |
| "Trip too short" on a pickup slot | no valid return fits before next block | expected; lower `minRentalMinutes` if allowed |
| Selection "vanished" | consumer's controlled-value echo dropped it | feed `onChange` back into `value` unmodified |
| Unstyled popover | stylesheet never imported | `import 'availability-datetime-picker/styles.css'` |
| Theme ignored | tokens on a wrapper | set `--bdp-*` on `:root` |
| `onIssues` firing | malformed block input | fix the producer; engine kept the valid blocks |
| Hydration mismatch | blocks/`now` differ between server & client render | stable clock, or pass `config.now` |
| `ERR_REQUIRE_ESM` | CommonJS pipeline | ESM bundler/runtime required |

Engine behavior questions: the package's test matrix is executable
documentation — `npm test` / `npm run test:tz` in the package repo.
