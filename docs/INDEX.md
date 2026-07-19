# picker-cookbook documentation index

Markdown mirrors of the live docs site (`app/docs/<slug>/page.tsx`). Each
file states what the page demonstrates, the package APIs used, the primary
code sample, and gotchas. Kept in lockstep with the site by the
docs-in-parallel rule in [CLAUDE.md](../CLAUDE.md).

| Doc | Group | Covers |
| --- | ----- | ------ |
| [installation.md](./installation.md) | Getting started | Install, peer deps, ESM-only, stylesheet import, first render |
| [for-agents.md](./for-agents.md) | Getting started | Condensed agent guide: install, decision table, value formats, config, gotchas, snippets; feeds /llms.txt and /llms-full.txt |
| [core-concepts.md](./core-concepts.md) | Getting started | Instants, display-only zones, half-open blocks, DayKeys, anti-wipe |
| [date-time-range-picker.md](./date-time-range-picker.md) | Components | Trip range picker: value/meta flow, config, triggers, layouts |
| [single-date-time-picker.md](./single-date-time-picker.md) | Components | Single instant: slots & minute precision, rangeAnchor trip-end mode |
| [single-date-picker.md](./single-date-picker.md) | Components | Date-only single value, windows, form errors |
| [date-only-range-picker.md](./date-only-range-picker.md) | Components | Date-only range, meta.complete, boundary math |
| [suggestion-banner.md](./suggestion-banner.md) | Components | Nearest-window recovery for invalid values |
| [playground.md](./playground.md) | Components | Interactive prop sandbox for all four pickers; live valueFormat + return-value inspector |
| [blocks-and-availability.md](./blocks-and-availability.md) | Concepts | RawBlockInput, half-open boundaries, turnaround, parse issues |
| [engine-config.md](./engine-config.md) | Concepts | Every EngineConfig knob, selection windows, presets |
| [timezones.md](./timezones.md) | Concepts | One value in three zones, helpers, DST, off-by-one bug |
| [day-states-and-anti-wipe.md](./day-states-and-anti-wipe.md) | Concepts | Five day statuses, six slot reasons, anti-wipe contract |
| [theming.md](./theming.md) | Advanced | --bdp-* tokens, runtime retheme, :root-only rule |
| [headless-hooks.md](./headless-hooks.md) | Advanced | The four hooks, custom UI, options/returns |
| [server-side-validation.md](./server-side-validation.md) | Advanced | /core in a Route Handler, violation codes, deep links |
| [recipes.md](./recipes.md) | Advanced | react-hook-form, refetch-on-open, URL projection, optimistic persist |
| [api-reference.md](./api-reference.md) | Reference | Every export from root and /core, all types |
| [performance.md](./performance.md) | Reference | Measured bundle sizes, dependency impact, engine benchmarks, render path |
| [limitations-and-troubleshooting.md](./limitations-and-troubleshooting.md) | Reference | The 8 exclusions + symptom→cause→fix table |

Process docs:

- [TEST-LOG.md](./TEST-LOG.md) — every verification run against the package.
- [TEST-REPORT.md](./TEST-REPORT.md) — final pre-publish verdict (written at
  the end of the test phase).
