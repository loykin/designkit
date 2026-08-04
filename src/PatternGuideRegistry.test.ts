/// <reference types="node" />

import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')
const manifest = JSON.parse(read('../docs/guides/manifest.json'))
const definitions = read('../playground/src/templates/definitions.ts')
const registry = read('../playground/src/templates/index.ts')
const agentInstructions = read('../AGENTS.md')
const guideIndex = read('../docs/guides/README.md')
const consumerGuide = read('../docs/consumer-guide.md')
const managedGuide = read('../docs/guides/managed-table.md')
const kubernetesGuide = read('../docs/guides/kubernetes-workspace.md')
const formGuide = read('../docs/guides/form-workflow.md')
const publishingGuide = read('../docs/guides/publishing-workflow.md')
const commerceGuide = read('../docs/guides/commerce-workflow.md')
const publishingDemo = read('../playground/src/templates/demos/guides/PublishingWorkflowGuide.tsx')
const commerceDemo = read('../playground/src/templates/demos/guides/CommerceWorkflowGuide.tsx')
const formDemo = read('../playground/src/templates/demos/guides/FormWorkflowGuide.tsx')
const kubernetesDemo = read(
  '../playground/src/templates/demos/databody/KubernetesMonitoringDemo.tsx',
)

describe('implementation guide registry', () => {
  it('keeps AI contracts only on complete Guides workflows', () => {
    for (const id of [
      'managed-table',
      'kubernetes-workspace',
      'form-workflow',
      'publishing-workflow',
      'commerce-workflow',
    ]) {
      expect(definitions).toContain(`patternId: '${id}'`)
      expect(guideIndex).toContain(`\`${id}\``)
    }

    for (const removedTemplateContract of ['content-collection', 'list-detail', 'detail-page']) {
      expect(definitions).not.toContain(`patternId: '${removedTemplateContract}'`)
    }

    expect(definitions.match(/patternId:/g)).toHaveLength(5)
    expect(registry).toContain("label: 'Guides'")
    expect(registry).toContain("label: 'Resource Management'")
    expect(registry).toContain("label: 'Operations'")
    expect(registry).toContain("label: 'Forms'")
    expect(registry).toContain("label: 'Publishing'")
    expect(registry).toContain("label: 'Commerce'")
  })

  it('uses one canonical Markdown source for each Playground AI Guide', () => {
    for (const guide of manifest.guides) {
      expect(definitions, guide.id).toContain(`patternId: '${guide.id}'`)
      expect(guideIndex, guide.id).toContain(`\`${guide.id}\``)
      expect(registry, guide.id).toContain(`../../../docs/guides/${guide.contract}?raw`)
      expect(registry, guide.id).toContain(`'${guide.id}':`)
    }

    expect(consumerGuide).toContain('[Pattern Guide Index](./guides/README.md)')
    expect(consumerGuide).toContain('./guides/managed-table.md')
    expect(consumerGuide).toContain('./guides/kubernetes-workspace.md')
    expect(consumerGuide).toContain('./guides/form-workflow.md')
    expect(consumerGuide).toContain('./guides/publishing-workflow.md')
    expect(consumerGuide).toContain('./guides/commerce-workflow.md')
    expect(existsSync(new URL('../docs/guides/content-collection.md', import.meta.url))).toBe(false)
  })

  it('keeps every product form on the modular stacked contract', () => {
    for (const rule of [
      'layout="stacked"',
      'function IdentitySection',
      'function AccessSection',
      'function MemberForm',
      'className="contents"',
      "from 'react-hook-form'",
      'FormProvider',
      'useFormContext<MemberFormValues>()',
    ]) {
      expect(formDemo).toContain(rule)
    }

    for (const rule of [
      'create, edit, and settings forms',
      'Use the stacked form shape',
      'Each section component returns one stacked',
      'Form and validation libraries remain application choices.',
      'React Hook Form is a Playground implementation choice',
      "import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'",
      'onSubmit={form.handleSubmit(submitMember)}',
    ]) {
      expect(formGuide).toContain(rule)
    }

    for (const rule of [
      'For every ordinary create, edit, or settings screen',
      'DataBodyTemplate.Group layout="stacked"',
      'Implement each semantic Group as a named component',
      'react-hook-form` must remain a Playground-only dependency',
    ]) {
      expect(agentInstructions).toContain(rule)
    }
  })

  it('separates Kubernetes inspection from persistent resource tools', () => {
    for (const rule of [
      'SidePanelProvider',
      'useSidePanel',
      'PanelTemplate',
      'onRowClick={openPodDetails}',
      'GlobalSearch',
      'FilterInput',
      'ControlBar',
      'No active resource panels',
    ]) {
      expect(kubernetesDemo).toContain(rule)
    }

    for (const rule of [
      'Clicking a Pod row opens a read-oriented detail SidePanel.',
      'It must not implicitly open logs or start a shell.',
      'The dock participates in the workspace flex layout.',
      "The content area's bottom padding must equal its horizontal page padding.",
      'Detail, collection query, and dock tools have separate component/state boundaries.',
    ]) {
      expect(kubernetesGuide).toContain(rule)
    }
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
      'A SidePanel is not the default form container.',
      'Keep automatic polling silent by default.',
    ]) {
      expect(managedGuide).toContain(rule)
    }
  })
})
