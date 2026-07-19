/**
 * Report which package the app is currently wired to.
 *
 * Local mode is deliberately invisible to git (`--no-save` touches neither
 * package.json nor package-lock.json), which is what makes it deploy-safe —
 * but it also means nothing on disk announces it. This is that announcement.
 *
 * npm records the real resolution in node_modules/.package-lock.json even for
 * --no-save installs, so that is the source of truth rather than the manifest.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PKG = 'availability-datetime-picker'

let entry
try {
  const tree = JSON.parse(
    readFileSync(path.join(root, 'node_modules/.package-lock.json'), 'utf8'),
  )
  entry = tree.packages?.[`node_modules/${PKG}`]
} catch {
  console.log(`? ${PKG}: node_modules not installed — run \`npm install\``)
  process.exit(0)
}

if (!entry) {
  console.log(`? ${PKG}: not installed — run \`npm install\``)
  process.exit(0)
}

const { resolved, version } = entry
const isLocal = typeof resolved === 'string' && resolved.startsWith('file:')

if (isLocal) {
  console.log(`
▲ LOCAL  ${PKG}@${version}
  from   ${resolved.replace(/^file:/, '')}

  This is node_modules-only — package.json/package-lock.json are untouched,
  so it cannot reach a deploy. It also will not survive \`npm install\`.
  Re-sync after changing the package:  npm run use:local
  Back to the published package:       npm run use:npm
`)
} else {
  console.log(`
● REGISTRY  ${PKG}@${version}
  from      ${resolved}

  Test unpublished package changes with:  npm run use:local
`)
}
