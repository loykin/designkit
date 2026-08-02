/// <reference types="node" />

import { existsSync, readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

const repoRoot = new URL('../', import.meta.url)
const packageJson = JSON.parse(readFileSync(new URL('package.json', repoRoot), 'utf8'))
const manifest = JSON.parse(readFileSync(new URL('docs/guides/manifest.json', repoRoot), 'utf8'))
const readme = readFileSync(new URL('README.md', repoRoot), 'utf8')
const cliPath = new URL('cli/designkit.mjs', repoRoot)

function runCli(args: string[]) {
  return spawnSync(process.execPath, [cliPath.pathname, ...args], {
    cwd: repoRoot.pathname,
    encoding: 'utf8',
  })
}

describe('published implementation guides', () => {
  it('ships one canonical contract for every manifest entry', () => {
    expect(packageJson.files).toEqual(expect.arrayContaining(['cli', 'docs/guides']))
    expect(packageJson.bin.designkit).toBe('./cli/designkit.mjs')
    expect(packageJson.designkit.guideManifest).toBe('./docs/guides/manifest.json')
    expect(manifest.guides.map((guide: { id: string }) => guide.id)).toEqual([
      'managed-table',
      'form-workflow',
      'publishing-workflow',
      'commerce-workflow',
    ])

    for (const guide of manifest.guides) {
      expect(existsSync(new URL(`docs/guides/${guide.contract}`, repoRoot)), guide.id).toBe(true)
    }
    expect(packageJson.exports['./guides/*']).toBe('./docs/guides/*')
  })

  it('announces the discovery command in the npm README', () => {
    expect(readme).toContain('## Building with AI')
    expect(readme).toContain('npx @loykin/designkit guide list')
    expect(readme).toContain('Template demos are visual API references.')
    expect(readme).toContain('React Hook Form is installed in the Playground')

    for (const guide of manifest.guides) {
      expect(readme, guide.id).toContain(`npx @loykin/designkit guide ${guide.id}`)
    }
  })

  it('lists guides and prints the canonical AI prompt', () => {
    const list = runCli(['guide', 'list'])
    expect(list.status).toBe(0)
    expect(list.stdout).toContain('managed-table')
    expect(list.stdout).toContain('form-workflow')
    expect(list.stdout).toContain('publishing-workflow')
    expect(list.stdout).toContain('commerce-workflow')

    const prompt = runCli(['guide', 'commerce-workflow', '--prompt'])
    expect(prompt.status).toBe(0)
    expect(prompt.stdout).toContain('Implement this workflow with @loykin/designkit')
    expect(prompt.stdout).toContain('# Commerce Workflow Contract for AI')
    expect(prompt.stdout).toContain('Render exactly one page-level template per route.')
  })

  it('fails with a useful message for an unknown guide', () => {
    const result = runCli(['guide', 'unknown-workflow'])
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Unknown guide: unknown-workflow')
    expect(result.stderr).toContain('designkit guide list')
  })
})
