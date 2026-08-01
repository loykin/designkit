/// <reference types="node" />

import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const guideUrl = new URL('../../../../docs/guides/databody-resource-management.md', import.meta.url)
const consumerGuideUrl = new URL('../../../../docs/consumer-guide.md', import.meta.url)
const playgroundIndexUrl = new URL('../../../../playground/src/templates/index.ts', import.meta.url)
const playgroundDemoUrl = new URL(
  '../../../../playground/src/templates/demos/databody/DataBodyResourceGuide.tsx',
  import.meta.url,
)
const removedDuplicateGuideUrl = new URL(
  '../../../../playground/src/templates/demos/databody/DataBodyResourceGuide.md',
  import.meta.url,
)

const guide = readFileSync(guideUrl, 'utf8')
const consumerGuide = readFileSync(consumerGuideUrl, 'utf8')
const playgroundIndex = readFileSync(playgroundIndexUrl, 'utf8')
const playgroundDemo = readFileSync(playgroundDemoUrl, 'utf8')

describe('DataBodyTemplate Resource Management guide contract', () => {
  it('uses one canonical Markdown source in docs and Playground', () => {
    expect(playgroundIndex).toContain(
      "import dataBodyResourceAiGuide from '../../../docs/guides/databody-resource-management.md?raw'",
    )
    expect(consumerGuide).toContain(
      '[DataBodyTemplate Resource Management Contract](./guides/databody-resource-management.md)',
    )
    expect(existsSync(removedDuplicateGuideUrl)).toBe(false)
  })

  it('defines the complete reconstruction contract', () => {
    const requiredRules = [
      '/users/new',
      'Its records are only sample data',
      'Pattern ID: `databody.resource-management`',
      'Only entries marked **Executable** are implemented references',
      '## Applicability examples',
      '## When not to use this pattern',
      '## Pattern selection questions',
      '| Credentials',
      '| Metrics and monitoring panels',
      "Do not simulate navigation with component state such as `view === 'create'`.",
      'PageBreadcrumb',
      'DataBodyTemplate.Tab',
      'toolbarLeft',
      'toolbarRight',
      'placeholderData: keepPreviousData',
      'Keep automatic polling silent by default.',
      '`Resource.refreshing` is opt-in',
      'DataGridPaginationBar',
      "classNames={{ footer: 'pt-3' }}",
      'layout="stacked"',
      'className="space-y-3"',
      'className="h-8 text-sm"',
      'Table-toolbar controls are compact: `28px` (`h-7`).',
      'Form controls and buttons are `32px` (`h-8`)',
      'A Sheet is not the default form container.',
      'Do not add `mx-auto`, an arbitrary `max-w-*`',
    ]

    requiredRules.forEach((rule) => expect(guide, rule).toContain(rule))
  })

  it('keeps the executable example aligned with the guide', () => {
    const requiredImplementation = [
      "params['*'] === 'new'",
      'navigate(`${listPath}/new`)',
      "items={['Data', 'Users']}",
      "{ label: 'Users', href: listPath }",
      'placeholderData: keepPreviousData',
      '<DataGridPaginationBar',
      "classNames={{ footer: 'pt-3' }}",
      'layout="stacked"',
      'className="space-y-3"',
      'className="h-8 text-sm"',
      '<UserDetailSheet',
    ]

    requiredImplementation.forEach((rule) => expect(playgroundDemo, rule).toContain(rule))
    expect(playgroundDemo).not.toContain('CreateUserSheet')
    expect(playgroundDemo).not.toContain('createOpen')
    expect(playgroundDemo).not.toContain('refreshing={query.isFetching')
    expect(playgroundDemo).not.toContain('mx-auto grid w-full max-w-2xl')
    expect(playgroundIndex).not.toContain(
      "'databody-resource-guide': buildDataBodyResourceGuideCode",
    )
  })

  it('does not retain the conflicting custom pagination example', () => {
    expect(consumerGuide).not.toContain('footer={<UserPagination')
    expect(consumerGuide).toContain("classNames={{ footer: 'pt-3' }}")
    expect(consumerGuide).toContain('DataGridPaginationBar')
  })
})
