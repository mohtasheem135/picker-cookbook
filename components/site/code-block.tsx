import { codeToHtml } from 'shiki'

import { CopyButton } from './copy-button'

interface CodeBlockProps {
  code: string
  lang?: 'tsx' | 'ts' | 'css' | 'bash' | 'json'
  /** Filename or short caption shown in the block header. */
  title?: string
}

/**
 * Server component: highlights at render/build time with shiki, so zero
 * highlighting JS ships to the client. The copy button is the only client
 * part.
 */
export async function CodeBlock({ code, lang = 'tsx', title }: CodeBlockProps) {
  const trimmed = code.trimEnd()
  const html = await codeToHtml(trimmed, { lang, theme: 'github-dark' })

  return (
    <figure className='code-block'>
      <figcaption className='code-block-header'>
        <span>{title ?? lang}</span>
        <CopyButton code={trimmed} />
      </figcaption>
      <div
        className='code-block-body'
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  )
}
