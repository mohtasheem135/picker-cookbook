import type { Metadata } from 'next'

import { ThemeEditor } from '@/components/demos/theme-editor'
import { Callout } from '@/components/site/callout'
import { CodeBlock } from '@/components/site/code-block'
import { DemoFrame } from '@/components/site/demo-frame'
import { DocPage } from '@/components/site/doc-page'
import { readDemoSource } from '@/lib/source'

export const metadata: Metadata = { title: 'Theming' }

const BRAND_CSS = `/* Your global stylesheet — no Tailwind, no rebuild of the package. */
:root {
  --bdp-primary: #7c3aed;          /* selection, CTAs, focus ring */
  --bdp-primary-dark: #5b21b6;     /* CTA hover */
  --bdp-primary-pale: #f1e9fe;     /* range band, info tints */
  --bdp-radius-sm: 6px;            /* sharper corners */
  --bdp-radius-md: 8px;
}`

export default function Page() {
  return (
    <DocPage slug='theming'>
      <p>
        The stylesheet is prebuilt, but every color, radius, border width,
        and shadow routes through a <code>--bdp-*</code> custom property with
        a hardcoded default. Set the properties on <code>:root</code> and the
        pickers retheme at runtime — your app needs no Tailwind and the
        package needs no rebuild.
      </p>

      <h2>Live theme switcher</h2>
      <DemoFrame hint='switch a preset, then open the picker — the portal retheme is the point'>
        <ThemeEditor />
      </DemoFrame>
      <CodeBlock
        code={readDemoSource('theme-editor.tsx')}
        title='components/demos/theme-editor.tsx'
      />

      <h2>Static brand theme</h2>
      <p>Most apps just ship the overrides in global CSS:</p>
      <CodeBlock code={BRAND_CSS} lang='css' title='globals.css' />

      <Callout type='warn' title='Set tokens on :root, not a wrapper'>
        <p>
          The popover and drawer portal to <code>&lt;body&gt;</code>.
          Variables scoped to a wrapper around the trigger never reach the
          portal — the calendar would keep the stock theme while the trigger
          rethemes. This also means theming is app-level: one theme per page,
          not per picker instance (a documented{' '}
          <a href='/docs/limitations-and-troubleshooting'>limitation</a>).
        </p>
      </Callout>

      <h2>Token reference</h2>
      <table>
        <thead>
          <tr><th>Variable</th><th>Default</th><th>Paints</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--bdp-primary</code></td><td><code>#1b5eff</code></td><td>selection, CTAs, focus ring</td></tr>
          <tr><td><code>--bdp-primary-dark</code></td><td><code>#0f3fcc</code></td><td>CTA hover</td></tr>
          <tr><td><code>--bdp-primary-pale</code></td><td><code>#e8eeff</code></td><td>range band, info tints</td></tr>
          <tr><td><code>--bdp-foreground</code></td><td><code>oklch(0.145 0 0)</code></td><td>primary text</td></tr>
          <tr><td><code>--bdp-muted-foreground</code></td><td><code>oklch(0.556 0 0)</code></td><td>secondary text</td></tr>
          <tr><td><code>--bdp-accent</code></td><td><code>oklch(0.97 0 0)</code></td><td>hover surfaces</td></tr>
          <tr><td><code>--bdp-card</code></td><td><code>oklch(1 0 0)</code></td><td>popover/drawer/field surfaces</td></tr>
          <tr><td><code>--bdp-destructive</code></td><td><code>oklch(0.577 0.245 27.325)</code></td><td>invalid state</td></tr>
          <tr><td><code>--bdp-ring</code></td><td><code>oklch(0.708 0 0)</code></td><td>focus-visible ring</td></tr>
          <tr><td><code>--bdp-red-pale</code></td><td><code>#fee8e8</code></td><td>invalid tint</td></tr>
          <tr><td><code>--bdp-border-muted</code></td><td><code>#e8e2da</code></td><td>default borders</td></tr>
          <tr><td><code>--bdp-border-muted-strong</code></td><td><code>#d8d0c4</code></td><td>emphasis borders, drawer handle</td></tr>
          <tr><td><code>--bdp-radius-xs/sm/md/lg</code></td><td><code>6 / 10 / 14 / 20px</code></td><td>radius scale</td></tr>
          <tr><td><code>--bdp-shadow-elevated</code></td><td>soft two-layer</td><td>popover elevation</td></tr>
          <tr><td><code>--bdp-border-width-hairline</code></td><td><code>1px</code></td><td>hairline borders</td></tr>
          <tr><td><code>--bdp-border-width-medium</code></td><td><code>1.5px</code></td><td>field borders</td></tr>
        </tbody>
      </table>

      <Callout type='tip' title='Collision-proof by construction'>
        <p>
          Every class and token the package ships is <code>bdp</code>-
          namespaced and the build runs a CSS-collision guard, so importing
          the stylesheet can never restyle your app — and your CSS can never
          accidentally restyle the picker internals.
        </p>
      </Callout>
    </DocPage>
  )
}
