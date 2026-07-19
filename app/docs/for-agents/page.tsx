import type { Metadata } from 'next'

import { Callout } from '@/components/site/callout'
import { CodeBlock } from '@/components/site/code-block'
import { DocPage } from '@/components/site/doc-page'
import { readDoc } from '@/lib/docs'

export const metadata: Metadata = { title: 'Using with AI agents' }

export default function Page() {
  const guide = readDoc('for-agents') ?? ''

  return (
    <DocPage slug='for-agents'>
      <p>
        Point Claude Code (or any coding agent) at this library with a single
        URL. This page is a condensed, paste-ready integration guide — install,
        the component decision table, value formats, the engine{' '}
        <code>config</code> knobs, the gotchas, and copy-paste snippets for each
        component. The same content is served as machine-readable markdown for
        agents to fetch directly.
      </p>

      <Callout type='tip' title='Three URLs to share with an agent'>
        <ul>
          <li>
            <a href='/llms.txt'>
              <code>/llms.txt</code>
            </a>{' '}
            — the index agents look for first (
            <a href='https://llmstxt.org'>llmstxt.org</a> format).
          </li>
          <li>
            <a href='/llms-full.txt'>
              <code>/llms-full.txt</code>
            </a>{' '}
            — every documentation page concatenated into one markdown file.
          </li>
          <li>
            <strong>This page</strong> (<code>/docs/for-agents</code>) — the
            human-readable version of the guide below.
          </li>
        </ul>
      </Callout>

      <p>
        The guide below is the exact markdown an agent receives. Copy it
        straight into a prompt, or hand over one of the URLs above.
      </p>

      <CodeBlock
        code={guide}
        lang='markdown'
        title='for-agents.md — copy & paste to your coding agent'
      />
    </DocPage>
  )
}
