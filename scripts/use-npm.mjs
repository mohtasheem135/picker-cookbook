/**
 * Switch back to the published registry package.
 *
 * `npm ci` reinstalls node_modules from the lockfile, which always points at
 * the registry (see use-local.mjs — local mode never writes the manifest), so
 * this is a guaranteed restore rather than a best-effort one.
 */
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

console.log('Restoring the registry package from package-lock.json (npm ci)')
execFileSync('npm', ['ci'], { cwd: root, stdio: 'inherit' })

execFileSync('node', [path.join(root, 'scripts/use-status.mjs')], {
  cwd: root,
  stdio: 'inherit',
})
