# Theming

Live page: `/docs/theming` · Demo: `components/demos/theme-editor.tsx`

## What it demonstrates

Runtime retheme via `--bdp-*` custom properties on `:root` — presets switch
live, and the popover (a portal) rethemes too, which is the point.

## How

```css
:root {
  --bdp-primary: #7c3aed;
  --bdp-primary-dark: #5b21b6;
  --bdp-primary-pale: #f1e9fe;
  --bdp-radius-sm: 6px;
}
```

No Tailwind, no package rebuild. **Must be `:root`** — the popover/drawer
portals to `<body>`, so wrapper-scoped variables never reach it. Corollary:
theming is app-level, not per-instance (documented limitation).

## Token table

| Token | Default | Paints |
| ----- | ------- | ------ |
| `--bdp-primary` | `#1b5eff` | selection, CTAs, focus |
| `--bdp-primary-dark` | `#0f3fcc` | CTA hover |
| `--bdp-primary-pale` | `#e8eeff` | range band, tints |
| `--bdp-foreground` | `oklch(0.145 0 0)` | primary text |
| `--bdp-muted-foreground` | `oklch(0.556 0 0)` | secondary text |
| `--bdp-accent` | `oklch(0.97 0 0)` | hover surfaces |
| `--bdp-card` | `oklch(1 0 0)` | popover/drawer/fields |
| `--bdp-destructive` | `oklch(0.577 0.245 27.325)` | invalid |
| `--bdp-ring` | `oklch(0.708 0 0)` | focus ring |
| `--bdp-red-pale` | `#fee8e8` | invalid tint |
| `--bdp-border-muted` / `-strong` | `#e8e2da` / `#d8d0c4` | borders |
| `--bdp-radius-xs/sm/md/lg` | 6/10/14/20 px | radius scale |
| `--bdp-shadow-elevated` | two-layer | popover elevation |
| `--bdp-border-width-hairline/medium` | 1 / 1.5 px | border widths |

Everything is `bdp`-namespaced + a CSS-collision guard runs at package
build — imports can't restyle your app and vice versa.
