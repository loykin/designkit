import type { TemplateOverride, TemplateId } from '@/store/types'
import type { DataGridViewVariant } from './table/DataGridView'

export type TemplateGroup = 'Table' | 'Pages' | 'Design'
export type TemplateNavigationGroupId = 'DataBodyTemplate' | 'FormWizardBodyTemplate'
export type TemplateExportKind =
  | 'data-grid'
  | 'data-grid-card'
  | 'body-template'
  | 'typography'
  | 'databody'

export interface TemplateOptionChoice {
  value: string
  label: string
}

export interface TemplateOptionSpec {
  key: string
  label: string
  type: 'select'
  choices: TemplateOptionChoice[]
  defaultValue: string
}

export interface TemplateDefinition {
  id: TemplateId
  label: string
  /** Short label used only in nav sub-menu (omit to fall back to label) */
  navigationLabel?: string
  /** Section-header label for the nav group this item anchors (omit to fall back to label) */
  navigationSubgroupLabel?: string
  group: TemplateGroup
  navigationGroup: TemplateNavigationGroupId
  navigationParent?: TemplateId
  layoutClassName: string
  exportComponent: string
  exportKind: TemplateExportKind
  preset: TemplateOverride
  options?: TemplateOptionSpec[]
  preview?: {
    variant?: DataGridViewVariant
    breadcrumb?: React.ReactNode
    title?: React.ReactNode
    description?: React.ReactNode
  }
}

export const TEMPLATE_DEFINITIONS: TemplateDefinition[] = [
  // ── DataGridView (DataBodyTemplate 하위) ─────────────────────────────────────
  {
    id: 'table',
    label: 'Standard',
    navigationSubgroupLabel: 'Table',
    group: 'Table',
    navigationGroup: 'DataBodyTemplate',
    layoutClassName: 'layout-table',
    exportComponent: 'DataGridView',
    exportKind: 'data-grid',
    preset: { radius: 0.125 },
    preview: {
      variant: 'standard',
      breadcrumb: 'Data / Table',
      title: 'Users',
    },
  },
  {
    id: 'table-infinity',
    label: 'Infinite Scroll',
    group: 'Table',
    navigationGroup: 'DataBodyTemplate',
    navigationParent: 'table',
    layoutClassName: 'layout-table-infinity',
    exportComponent: 'DataGridView',
    exportKind: 'data-grid',
    preset: { radius: 0.125 },
    preview: {
      variant: 'infinity',
      breadcrumb: 'Data / Table / Infinite Scroll',
      title: 'Users',
      description: 'gridkit DataGridInfinity',
    },
  },
  {
    id: 'table-drag',
    label: 'Row Drag',
    group: 'Table',
    navigationGroup: 'DataBodyTemplate',
    navigationParent: 'table',
    layoutClassName: 'layout-table-drag',
    exportComponent: 'DataGridView',
    exportKind: 'data-grid',
    preset: { radius: 0.125 },
    preview: {
      variant: 'drag',
      breadcrumb: 'Data / Table / Row Drag',
      title: 'Services',
      description: 'gridkit DataGridDrag',
    },
  },
  {
    id: 'table-card',
    label: 'Card Grid',
    navigationSubgroupLabel: 'Card',
    group: 'Table',
    navigationGroup: 'DataBodyTemplate',
    layoutClassName: 'layout-table-card',
    exportComponent: 'DataGridView',
    exportKind: 'data-grid-card',
    preset: { radius: 0.375 },
    preview: {
      variant: 'card',
      breadcrumb: 'Data / Table / Card Grid',
      title: 'User Cards',
      description: 'gridkit DataGridCard',
    },
  },
  {
    id: 'table-card-list',
    label: 'Card List',
    group: 'Table',
    navigationGroup: 'DataBodyTemplate',
    navigationParent: 'table-card',
    layoutClassName: 'layout-table-card-list',
    exportComponent: 'DataGridView',
    exportKind: 'data-grid-card',
    preset: { radius: 0.375 },
    preview: {
      variant: 'card-list',
      breadcrumb: 'Data / Table / Card List',
      title: 'User Cards',
      description: 'gridkit DataGridCard list mode',
    },
  },
  // ── DataBodyTemplate ─────────────────────────────────────────────────────────
  {
    id: 'databody',
    label: 'Standard',
    navigationSubgroupLabel: 'Data View',
    group: 'Pages',
    navigationGroup: 'DataBodyTemplate',
    layoutClassName: 'layout-databody',
    exportComponent: 'DataBodyTemplate',
    exportKind: 'databody',
    preset: { radius: 0.375 },
  },
  {
    id: 'tabbed',
    label: 'Tabbed',
    group: 'Pages',
    navigationGroup: 'DataBodyTemplate',
    navigationParent: 'databody',
    layoutClassName: 'layout-tabbed',
    exportComponent: 'DataBodyTemplate',
    exportKind: 'databody',
    preset: { radius: 0.375 },
  },
  {
    id: 'form',
    label: 'Form Horizontal',
    navigationLabel: 'Horizontal',
    navigationSubgroupLabel: 'Form',
    group: 'Pages',
    navigationGroup: 'DataBodyTemplate',
    layoutClassName: 'layout-form',
    exportComponent: 'DataBodyTemplate',
    exportKind: 'databody',
    preset: { radius: 0.5 },
  },
  {
    id: 'form-stacked',
    label: 'Form Stacked',
    navigationLabel: 'Stacked',
    group: 'Pages',
    navigationGroup: 'DataBodyTemplate',
    navigationParent: 'form',
    layoutClassName: 'layout-form-stacked',
    exportComponent: 'DataBodyTemplate',
    exportKind: 'databody',
    preset: { radius: 0.5 },
  },
  {
    id: 'form-inline',
    label: 'Form Inline',
    navigationLabel: 'Inline',
    group: 'Pages',
    navigationGroup: 'DataBodyTemplate',
    navigationParent: 'form',
    layoutClassName: 'layout-form-inline',
    exportComponent: 'DataBodyTemplate',
    exportKind: 'databody',
    preset: { radius: 0.25 },
  },
  // ── FormWizardBodyTemplate ────────────────────────────────────────────────────
  {
    id: 'form-wizard',
    label: 'Wizard',
    group: 'Pages',
    navigationGroup: 'FormWizardBodyTemplate',
    layoutClassName: 'layout-form-wizard',
    exportComponent: 'FormWizardBodyTemplate',
    exportKind: 'body-template',
    preset: { radius: 0.5 },
  },
]

export function getTemplateDefinition(id: TemplateId) {
  return TEMPLATE_DEFINITIONS.find((definition) => definition.id === id)
}

export function createTemplateOverrides(): Record<TemplateId, TemplateOverride> {
  return TEMPLATE_DEFINITIONS.reduce((acc, definition) => {
    acc[definition.id] = { ...definition.preset }
    return acc
  }, {} as Record<TemplateId, TemplateOverride>)
}
