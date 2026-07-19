/**
 * Guard: the committed dependency must always be the published registry
 * range, never a local `file:` path.
 *
 * Vercel builds this repo on its own — the sibling package folder and its
 * tarball do not exist there, so a pushed `file:` dep fails the deploy. The
 * pre-push hook runs this; `npm run use:local` is expected to trip it, which
 * is the whole point: run `npm run use:npm` before pushing.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const PKG = 'availability-datetime-picker'
const problems = []

const manifest = JSON.parse(
  readFileSync(path.join(root, 'package.json'), 'utf8'),
)
const declared = manifest.dependencies?.[PKG]

if (!declared) {
  problems.push(`package.json: "${PKG}" is missing from dependencies`)
} else if (!/^[\^~]?\d/.test(declared)) {
  problems.push(
    `package.json: "${PKG}": "${declared}" is not a registry version range.\n` +
      `    You are in local mode. Run: npm run use:npm`,
  )
}

// The lockfile is the thing Vercel actually installs from, so check it too:
// package.json can look clean while the lock still pins a file: resolution.
try {
  const lock = JSON.parse(
    readFileSync(path.join(root, 'package-lock.json'), 'utf8'),
  )
  const entry = lock.packages?.[`node_modules/${PKG}`]
  if (entry?.resolved && !entry.resolved.startsWith('https://registry.npmjs.org/')) {
    problems.push(
      `package-lock.json: "${PKG}" resolves to ${entry.resolved}\n` +
        `    Run: npm run use:npm`,
    )
  }
  if (entry?.link) {
    problems.push(
      `package-lock.json: "${PKG}" is a link: dependency. Run: npm run use:npm`,
    )
  }
} catch {
  problems.push('package-lock.json: missing or unreadable')
}

if (problems.length > 0) {
  console.error('\n✖ Local-package mode is still active — refusing to push.\n')
  for (const p of problems) console.error(`  - ${p}`)
  console.error(
    '\n  Why: Vercel builds picker-cookbook from its own repo, where\n' +
      '  ../availability-datetime-picker does not exist.\n' +
      '\n  Tip: `npm run use:local` is the supported way to test local package\n' +
      '  changes — it installs the tarball with --no-save, so package.json and\n' +
      '  package-lock.json stay clean and this guard never fires.\n',
  )
  process.exit(1)
}

console.log(`✓ ${PKG} tracks the registry (${declared}) — safe to push.`)
