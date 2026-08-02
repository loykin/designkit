/// <reference types="node" />

import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')
const definitions = read('../playground/src/templates/definitions.ts')
const registry = read('../playground/src/templates/index.ts')
const guideIndex = read('../docs/guides/README.md')
const consumerGuide = read('../docs/consumer-guide.md')
const managedGuide = read('../docs/guides/managed-table.md')
const publishingGuide = read('../docs/guides/publishing-workflow.md')
const commerceGuide = read('../docs/guides/commerce-workflow.md')
const publishingDemo = read('../playground/src/templates/demos/guides/PublishingWorkflowGuide.tsx')
const commerceDemo = read('../playground/src/templates/demos/guides/CommerceWorkflowGuide.tsx')

describe('implementation guide registry', () => {
  it('keeps AI contracts only on complete Guides workflows', () => {
    for (const id of ['managed-table', 'publishing-workflow', 'commerce-workflow']) {
      expect(definitions).toContain(`patternId: '${id}'`)
      expect(guideIndex).toContain(`\`${id}\``)
    }

    for (const removedTemplateContract of ['content-collection', 'list-detail', 'detail-page']) {
      expect(definitions).not.toContain(`patternId: '${removedTemplateContract}'`)
    }

    expect(definitions.match(/patternId:/g)).toHaveLength(3)
    expect(registry).toContain("label: 'Guides'")
    expect(registry).toContain("label: 'Resource Management'")
    expect(registry).toContain("label: 'Publishing'")
    expect(registry).toContain("label: 'Commerce'")
  })

  it('uses one canonical Markdown source for each Playground AI Guide', () => {
    for (const source of [
      '../../../docs/guides/managed-table.md?raw',
      '../../../docs/guides/publishing-workflow.md?raw',
      '../../../docs/guides/commerce-workflow.md?raw',
    ]) {
      expect(registry).toContain(source)
    }

    expect(consumerGuide).toContain('[Pattern Guide Index](./guides/README.md)')
    expect(consumerGuide).toContain('./guides/managed-table.md')
    expect(consumerGuide).toContain('./guides/publishing-workflow.md')
    expect(consumerGuide).toContain('./guides/commerce-workflow.md')
    expect(existsSync(new URL('../docs/guides/content-collection.md', import.meta.url))).toBe(false)
  })

  it('connects publishing collection and article routes', () => {
    for (const rule of [
      'DataBodyTemplate',
      'DetailBodyTemplate',
      'QueryClientProvider',
      "queryKey: ['guide', 'publishing', 'articles']",
      "queryKey: ['guide', 'publishing', 'article', slug]",
      'onRowClick={(article) => navigate(`${basePath}/${article.slug}`)}',
      'initialSorting=',
    ]) {
      expect(publishingDemo).toContain(rule)
    }
    expect(publishingGuide).toContain(
      'The existing **Blog Feed** and **Article** template demos are visual references only.',
    )
    expect(publishingGuide).toContain(
      'Never put `DetailBodyTemplate` inside `DataBodyTemplate.Body`.',
    )
  })

  it('connects commerce catalog and product routes', () => {
    for (const rule of [
      'BrowseBodyTemplate',
      'DetailBodyTemplate',
      'QueryClientProvider',
      "queryKey: ['guide', 'commerce', 'products', category, sort]",
      "queryKey: ['guide', 'commerce', 'product', slug]",
      'onRowClick={(product) => navigate(`${basePath}/${product.slug}`)}',
    ]) {
      expect(commerceDemo).toContain(rule)
    }
    expect(commerceGuide).toContain(
      'The existing **Browse / Catalog** and product detail template demos remain visual references.',
    )
    expect(commerceGuide).toContain('Render exactly one page-level template per route.')
  })

  it('preserves the detailed managed-table contract', () => {
    for (const rule of [
      'toolbarLeft',
      'toolbarRight',
      'placeholderData: keepPreviousData',
      'DataGridPaginationBar',
      'A Sheet is not the default form container.',
      'Keep automatic polling silent by default.',
    ]) {
      expect(managedGuide).toContain(rule)
    }
  })
})
