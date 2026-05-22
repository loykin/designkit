import type { TemplateOverride, TemplateId } from '@/store/types'
import type { DataGridViewVariant } from './table/DataGridView'

export type TemplateGroup = 'Table' | 'Pages' | 'Design'
export type TemplateNavigationGroupId = 'Data' | 'Design' | 'Workflow'
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

export const TEMPLATE_DEFINITIONS = [
  {
    id: 'table',
    label: 'Standard',
    group: 'Table',
    navigationGroup: 'Data',
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
    navigationGroup: 'Data',
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
    navigationGroup: 'Data',
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
    group: 'Table',
    navigationGroup: 'Data',
    navigationParent: 'table',
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
    navigationGroup: 'Data',
    navigationParent: 'table',
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
  {
    id: 'dashboard',
    label: 'Dashboard',
    group: 'Pages',
    navigationGroup: 'Data',
    layoutClassName: 'layout-dashboard',
    exportComponent: 'DashboardBodyTemplate',
    exportKind: 'body-template',
    preset: { radius: 0.75 },
  },
  {
    id: 'cardlist',
    label: 'Card List',
    group: 'Pages',
    navigationGroup: 'Data',
    layoutClassName: 'layout-cardlist',
    exportComponent: 'CardListBodyTemplate',
    exportKind: 'body-template',
    preset: { radius: 0.5 },
  },
  {
    id: 'typography',
    label: 'Typography',
    group: 'Design',
    navigationGroup: 'Design',
    layoutClassName: 'layout-typography',
    exportComponent: 'TypographyBodyTemplate',
    exportKind: 'typography',
    preset: { radius: 0.375 },
  },
  {
    id: 'databody',
    label: 'Body Template',
    group: 'Design',
    navigationGroup: 'Design',
    layoutClassName: 'layout-databody',
    exportComponent: 'DataBodyTemplate',
    exportKind: 'databody',
    preset: { radius: 0.375 },
  },
  {
    id: 'tabbed',
    label: 'Tabbed',
    group: 'Pages',
    navigationGroup: 'Workflow',
    layoutClassName: 'layout-tabbed',
    exportComponent: 'TabbedBodyTemplate',
    exportKind: 'body-template',
    preset: { radius: 0.375 },
  },
  {
    id: 'form',
    label: 'Standard',
    group: 'Pages',
    navigationGroup: 'Workflow',
    layoutClassName: 'layout-form',
    exportComponent: 'FormBodyTemplate',
    exportKind: 'body-template',
    preset: { radius: 0.5 },
    options: [
      {
        key: 'variant',
        label: 'Variant',
        type: 'select',
        choices: [
          { value: 'card',  label: 'Card'  },
          { value: 'plain', label: 'Plain' },
        ],
        defaultValue: 'card',
      },
    ],
  },
  {
    id: 'form-stacked',
    label: 'Stacked',
    group: 'Pages',
    navigationGroup: 'Workflow',
    navigationParent: 'form',
    layoutClassName: 'layout-form-stacked',
    exportComponent: 'FormStackedBodyTemplate',
    exportKind: 'body-template',
    preset: { radius: 0.5 },
    options: [
      {
        key: 'variant',
        label: 'Variant',
        type: 'select',
        choices: [
          { value: 'plain', label: 'Plain' },
          { value: 'card',  label: 'Card'  },
        ],
        defaultValue: 'plain',
      },
    ],
  },
  {
    id: 'form-wizard',
    label: 'Wizard',
    group: 'Pages',
    navigationGroup: 'Workflow',
    navigationParent: 'form',
    layoutClassName: 'layout-form-wizard',
    exportComponent: 'FormWizardBodyTemplate',
    exportKind: 'body-template',
    preset: { radius: 0.5 },
    options: [
      {
        key: 'variant',
        label: 'Variant',
        type: 'select',
        choices: [
          { value: 'plain', label: 'Plain' },
          { value: 'card',  label: 'Card'  },
        ],
        defaultValue: 'plain',
      },
    ],
  },
  {
    id: 'form-inline',
    label: 'Inline',
    group: 'Pages',
    navigationGroup: 'Workflow',
    navigationParent: 'form',
    layoutClassName: 'layout-form-inline',
    exportComponent: 'FormInlineBodyTemplate',
    exportKind: 'body-template',
    preset: { radius: 0.25 },
    options: [
      {
        key: 'variant',
        label: 'Variant',
        type: 'select',
        choices: [
          { value: 'bordered', label: 'Bordered' },
          { value: 'plain',    label: 'Plain'    },
        ],
        defaultValue: 'bordered',
      },
    ],
  },
] satisfies TemplateDefinition[]

export function getTemplateDefinition(id: TemplateId) {
  return TEMPLATE_DEFINITIONS.find((definition) => definition.id === id)
}

export function createTemplateOverrides(): Record<TemplateId, TemplateOverride> {
  return TEMPLATE_DEFINITIONS.reduce((acc, definition) => {
    acc[definition.id] = { ...definition.preset }
    return acc
  }, {} as Record<TemplateId, TemplateOverride>)
}
