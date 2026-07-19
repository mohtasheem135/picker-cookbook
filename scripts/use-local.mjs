/**
 * Switch the app to the sibling package's local build.
 *
 * Packs ../availability-datetime-picker and installs the tarball with
 * `--no-save`, so **package.json and package-lock.json are never touched**.
 * A Vercel build therefore cannot inherit this state: the manifest it clones
 * still tracks the published registry range.
 *
 * Installing the real tarball (rather than aliasing a path or symlinking the
 * folder) is what makes this a faithful test bed:
 *   - it exercises the exports map, the `fix-extensions` rewrite and the
 *     `'use client'` directives, exactly as an npm consumer receives them;
 *   - the tarball ships no node_modules, so React stays single. A symlink or
 *     `file:` *directory* dep would resolve the package's own devDependency
 *     copy of React and every hook would throw "Invalid hook call".
 *
 * Reverse with `npm run use:npm`. Check with `npm run use:status`.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync, existsSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pkgRoot = path.resolve(root, '../availability-datetime-picker')

if (!existsSync(pkgRoot)) {
  console.error(
    `\n✖ Sibling package not found at ${pkgRoot}\n` +
      `  This command only works in the two-folder workspace checkout.\n`,
  )
  process.exit(1)
}

const run = (cmd, args, cwd) => {
  console.log(`\n$ ${cmd} ${args.join(' ')}   (in ${path.basename(cwd)})`)
  execFileSync(cmd, args, { cwd, stdio: 'inherit' })
}

const { name, version } = JSON.parse(
  readFileSync(path.join(pkgRoot, 'package.json'), 'utf8'),
)

console.log(`Packing ${name}@${version} from ${path.relative(root, pkgRoot)}`)

// Build explicitly so a failure here reads as a build failure, not a pack one.
run('npm', ['run', 'build'], pkgRoot)

// Drop stale tarballs so an older version can never be picked up by mistake.
for (const f of readdirSync(pkgRoot)) {
  if (f.startsWith(`${name}-`) && f.endsWith('.tgz')) {
    rmSync(path.join(pkgRoot, f))
  }
}

run('npm', ['pack'], pkgRoot)

const tarball = path.join(pkgRoot, `${name}-${version}.tgz`)
run('npm', ['install', '--no-save', `file:${tarball}`], root)

console.log(`
✓ LOCAL mode — node_modules now holds ${name}@${version} from the tarball.
  package.json and package-lock.json were NOT modified.

  Use normally:  npm run dev | npm run build | npm run typecheck
  Check mode:    npm run use:status
  Restore:       npm run use:npm
`)
