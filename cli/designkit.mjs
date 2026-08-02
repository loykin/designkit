#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const packageJson = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'))
const guideRoot = join(packageRoot, packageJson.designkit.guideManifest, '..')
const manifest = JSON.parse(await readFile(join(guideRoot, 'manifest.json'), 'utf8'))
const args = process.argv.slice(2)

function usage() {
  return `@loykin/designkit ${packageJson.version}

Versioned implementation guides for developers and coding agents.

Usage:
  designkit guide list
  designkit guide <guide-id>
  designkit guide <guide-id> --prompt
  designkit guide list --json

Examples:
  npx @loykin/designkit guide managed-table
  npx @loykin/designkit guide publishing-workflow --prompt
  npx @loykin/designkit guide commerce-workflow
`
}

function listGuides() {
  const width = Math.max(...manifest.guides.map((guide) => guide.id.length))
  return [
    `@loykin/designkit ${packageJson.version} implementation guides`,
    '',
    ...manifest.guides.map((guide) => `${guide.id.padEnd(width)}  ${guide.summary}`),
    '',
    'Print one guide with: designkit guide <guide-id>',
  ].join('\n')
}

function fail(message) {
  process.stderr.write(`${message}\n\n${usage()}`)
  process.exitCode = 1
}

const [command, subject, ...flags] = args
const wantsJson = args.includes('--json')
const wantsPrompt = args.includes('--prompt')

if (!command || command === 'help' || command === '--help' || command === '-h') {
  process.stdout.write(usage())
} else if (command !== 'guide') {
  fail(`Unknown command: ${command}`)
} else if (!subject || subject === 'list') {
  process.stdout.write(
    wantsJson
      ? `${JSON.stringify({ packageVersion: packageJson.version, ...manifest }, null, 2)}\n`
      : `${listGuides()}\n`,
  )
} else {
  const guide = manifest.guides.find((candidate) => candidate.id === subject)
  if (!guide) {
    fail(`Unknown guide: ${subject}`)
  } else if (flags.some((flag) => !['--json', '--prompt'].includes(flag))) {
    fail(`Unknown option: ${flags.find((flag) => !['--json', '--prompt'].includes(flag))}`)
  } else if (wantsJson) {
    process.stdout.write(
      `${JSON.stringify({ packageVersion: packageJson.version, ...guide }, null, 2)}\n`,
    )
  } else {
    const contract = await readFile(join(guideRoot, guide.contract), 'utf8')
    const prompt = wantsPrompt
      ? `Implement this workflow with @loykin/designkit ${packageJson.version}. Follow the complete contract below. Preserve route, query, action-placement, loading, and page-template boundaries. Do not nest page-level templates.\n\n`
      : ''
    process.stdout.write(`${prompt}${contract.trim()}\n`)
  }
}
