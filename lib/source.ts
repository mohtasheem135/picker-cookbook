import fs from 'node:fs'
import path from 'node:path'

/**
 * Read a demo component's source for display. Pages show the exact file
 * that is running in the live demo, so the sample can never drift from the
 * demo. Server-only (used from server components at render/build time).
 */
export function readDemoSource(file: string): string {
  const abs = path.join(process.cwd(), 'components', 'demos', file)
  return fs.readFileSync(abs, 'utf8')
}
