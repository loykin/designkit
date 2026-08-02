import type { TemplateOverride } from '@loykin/designkit'

export type DataGridTemplateVariant = 'standard' | 'infinity' | 'drag' | 'card' | 'card-list'

export type TemplateGroup = 'Table' | 'Pages' | 'Design' | 'Auth' | 'Dashboard' | 'Workbench'
export type TemplateNavigationGroupId =
  | 'Guides'
  | 'DataBodyTemplate'
  | 'FormWizardBodyTemplate'
  | 'LoginBodyTemplate'
  | 'DetailBodyTemplate'
  | 'DashboardBodyTemplate'
  | 'WorkbenchBodyTemplate'
  | 'ListDetailBodyTemplate'
  | 'PanelTemplate'
  | 'Common'
export type TemplateExportKind =
  | 'data-grid'
  | 'data-grid-card'
  | 'body-template'
  | 'typography'
  | 'databody'
  | 'login'
  | 'detail'
  | 'dashboard'
  | 'workbench'
  | 'list-detail'
  | 'panel'

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
  id: string
  label: string
  /** Usage-pattern contract demonstrated by this executable example. */
  patternId?: string
  /** Short label used only in nav sub-menu (omit to fall back to label) */
  navigationLabel?: string
  /** Section-header label for the nav group this item anchors (omit to fall back to label) */
  navigationSubgroupLabel?: string
  group: TemplateGroup
  navigationGroup: TemplateNavigationGroupId
  navigationParent?: string
  layoutClassName: string
  exportComponent: string
  exportKind: TemplateExportKind
  preset: TemplateOverride
  options?: TemplateOptionSpec[]
  preview?: {
    variant?: DataGridTemplateVariant
    breadcrumb?: React.ReactNode
    title?: React.ReactNode
    description?: React.ReactNode
  }
}

const topBarOptions: TemplateOptionSpec[] = [
  {
    key: 'topBarShow',
    label: 'Top Bar',
    type: 'select',
    choices: [
      { value: 'show', label: 'Show' },
      { value: 'hide', label: 'Hide' },
    ],
    defaultValue: 'show',
  },
  {
    key: 'topBarVariant',
    label: 'Border',
    type: 'select',
    choices: [
      { value: 'ghost', label: 'None' },
      { value: 'default', label: 'Line' },
    ],
    defaultValue: 'ghost',
  },
  {
    key: 'topBarBg',
    label: 'Background',
    type: 'select',
    choices: [
      { value: 'transparent', label: 'Default' },
      { value: 'muted', label: 'Muted' },
      { value: 'card', label: 'Card' },
    ],
    defaultValue: 'transparent',
  },
]

const loginOptions: TemplateOptionSpec[] = [
  {
    key: 'loginLayout',
    label: 'Layout',
    type: 'select',
    choices: [
      { value: 'centered', label: 'Centered' },
      { value: 'split', label: 'Split' },
    ],
    defaultValue: 'centered',
  },
  {
    key: 'loginSide',
    label: 'Brand Side',
    type: 'select',
    choices: [
      { value: 'left', label: 'Left' },
      { value: 'right', label: 'Right' },
    ],
    defaultValue: 'left',
  },
  {
    key: 'loginCard',
    label: 'Card',
    type: 'select',
    choices: [
      { value: 'card', label: 'Card' },
      { value: 'plain', label: 'None' },
    ],
    defaultValue: 'card',
  },
  {
    key: 'loginBg',
    label: 'Background',
    type: 'select',
    choices: [
      { value: 'default', label: 'Muted' },
      { value: 'subtle', label: 'Gradient' },
      { value: 'none', label: 'None' },
    ],
    defaultValue: 'default',
  },
  {
    key: 'loginCardWidth',
    label: 'Width',
    type: 'select',
    choices: [
      { value: 'sm', label: 'Narrow' },
      { value: 'md', label: 'Medium' },
      { value: 'lg', label: 'Wide' },
    ],
    defaultValue: 'sm',
  },
]

export const TEMPLATE_DEFINITIONS: TemplateDefinition[] = [
  // ── End-to-end implementation guides ─────────────────────────────────────────
  {
    id: 'databody-managed-table-guide',
    label: 'Managed Table',
    navigationLabel: 'Managed Table',
    patternId: 'managed-table',
    group: 'Pages',
    navigationGroup: 'Guides',
    layoutClassName: 'layout-databody-managed-table-guide',
    exportComponent: 'DataBodyTemplate',
    exportKind: 'databody',
    preset: {},
  },
  {
    id: 'publishing-workflow-guide',
    label: 'Blog → Article',
    patternId: 'publishing-workflow',
    group: 'Pages',
    navigationGroup: 'Guides',
    layoutClassName: 'layout-guide-publishing',
    exportComponent: 'DataBodyTemplate + DetailBodyTemplate',
    exportKind: 'body-template',
    preset: {},
  },
  {
    id: 'commerce-workflow-guide',
    label: 'Catalog → Product',
    patternId: 'commerce-workflow',
    group: 'Pages',
    navigationGroup: 'Guides',
    layoutClassName: 'layout-guide-commerce',
    exportComponent: 'BrowseBodyTemplate + DetailBodyTemplate',
    exportKind: 'body-template',
    preset: {},
  },
  // ── DataGridView (nested under DataBodyTemplate) ─────────────────────────────
  {
    id: 'table',
    label: 'Standard',
    navigationSubgroupLabel: 'Table',
    group: 'Table',
    navigationGroup: 'DataBodyTemplate',
    layoutClassName: 'layout-table',
    exportComponent: 'DataGridView',
    exportKind: 'data-grid',
    preset: {},
    options: topBarOptions,
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
    preset: {},
    preview: {
      variant: 'infinity',
      breadcrumb: 'Data / Table / Infinite Scroll',
      title: 'Users',
      description: 'gridkit DataGridInfinity',
    },
    options: topBarOptions,
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
    preset: {},
    preview: {
      variant: 'drag',
      breadcrumb: 'Data / Table / Row Drag',
      title: 'Services',
      description: 'gridkit DataGridDrag',
    },
    options: topBarOptions,
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
    preset: {},
    preview: {
      variant: 'card',
      breadcrumb: 'Data / Table / Card Grid',
      title: 'User Cards',
      description: 'gridkit DataGridCard',
    },
    options: topBarOptions,
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
    preset: {},
    preview: {
      variant: 'card-list',
      breadcrumb: 'Data / Table / Card List',
      title: 'User Cards',
      description: 'gridkit DataGridCard list mode',
    },
    options: topBarOptions,
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
    preset: {},
    options: topBarOptions,
  },
  {
    id: 'databody-detail',
    label: 'Detail',
    group: 'Pages',
    navigationGroup: 'DataBodyTemplate',
    navigationParent: 'databody',
    layoutClassName: 'layout-databody-detail',
    exportComponent: 'DataBodyTemplate',
    exportKind: 'databody',
    preset: {},
    options: topBarOptions,
  },
  {
    id: 'databody-split',
    label: 'Split',
    group: 'Pages',
    navigationGroup: 'DataBodyTemplate',
    navigationParent: 'databody',
    layoutClassName: 'layout-databody-split',
    exportComponent: 'DataBodyTemplate',
    exportKind: 'databody',
    preset: {},
    options: topBarOptions,
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
    preset: {},
    options: topBarOptions,
  },
  {
    id: 'databody-kubernetes',
    label: 'Kubernetes Monitoring',
    navigationLabel: 'Kubernetes',
    group: 'Pages',
    navigationGroup: 'DataBodyTemplate',
    navigationParent: 'databody',
    layoutClassName: 'layout-databody-kubernetes',
    exportComponent: 'DataBodyTemplate',
    exportKind: 'databody',
    preset: {},
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
    preset: {},
    options: topBarOptions,
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
    preset: {},
    options: topBarOptions,
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
    preset: {},
    options: topBarOptions,
  },
  {
    id: 'sectioned',
    label: 'Sectioned',
    group: 'Pages',
    navigationGroup: 'DataBodyTemplate',
    layoutClassName: 'layout-sectioned',
    exportComponent: 'DataBodyTemplate',
    exportKind: 'body-template',
    preset: {},
    options: topBarOptions,
  },
  {
    id: 'board-table',
    label: 'Board Table',
    navigationSubgroupLabel: 'Content Lists',
    group: 'Pages',
    navigationGroup: 'DataBodyTemplate',
    layoutClassName: 'layout-board-table',
    exportComponent: 'DataBodyTemplate',
    exportKind: 'databody',
    preset: {},
  },
  {
    id: 'blog-feed',
    label: 'Blog Feed',
    group: 'Pages',
    navigationGroup: 'DataBodyTemplate',
    navigationParent: 'board-table',
    layoutClassName: 'layout-blog-feed',
    exportComponent: 'DataBodyTemplate',
    exportKind: 'databody',
    preset: {},
  },
  // ── ListDetailBodyTemplate ────────────────────────────────────────────────────
  {
    id: 'list-detail',
    label: 'List / Detail',
    navigationSubgroupLabel: 'List / Detail',
    group: 'Pages',
    navigationGroup: 'ListDetailBodyTemplate',
    layoutClassName: 'layout-list-detail',
    exportComponent: 'ListDetailBodyTemplate',
    exportKind: 'list-detail',
    preset: {},
  },
  // ── BrowseBodyTemplate ───────────────────────────────────────────────────────
  {
    id: 'browse',
    label: 'Browse / Catalog',
    navigationLabel: 'Browse',
    navigationSubgroupLabel: 'Browse',
    group: 'Pages',
    navigationGroup: 'DataBodyTemplate',
    layoutClassName: 'layout-browse',
    exportComponent: 'BrowseBodyTemplate',
    exportKind: 'databody',
    preset: {},
    options: topBarOptions,
  },
  {
    id: 'detail',
    label: 'Media Detail',
    navigationLabel: 'Media',
    navigationSubgroupLabel: 'Detail',
    group: 'Pages',
    navigationGroup: 'DetailBodyTemplate',
    layoutClassName: 'layout-detail',
    exportComponent: 'DetailBodyTemplate',
    exportKind: 'detail',
    preset: {},
  },
  {
    id: 'detail-record',
    label: 'Record Detail',
    navigationLabel: 'Record',
    group: 'Pages',
    navigationGroup: 'DetailBodyTemplate',
    navigationParent: 'detail',
    layoutClassName: 'layout-detail-record',
    exportComponent: 'DetailBodyTemplate',
    exportKind: 'detail',
    preset: {},
  },
  {
    id: 'detail-full',
    label: 'Full Detail',
    navigationLabel: 'Full',
    group: 'Pages',
    navigationGroup: 'DetailBodyTemplate',
    navigationParent: 'detail',
    layoutClassName: 'layout-detail-full',
    exportComponent: 'DetailBodyTemplate',
    exportKind: 'detail',
    preset: {},
  },
  {
    id: 'thread-detail',
    label: 'Thread',
    navigationSubgroupLabel: 'Content Detail',
    group: 'Pages',
    navigationGroup: 'DetailBodyTemplate',
    layoutClassName: 'layout-thread-detail',
    exportComponent: 'DetailBodyTemplate',
    exportKind: 'detail',
    preset: {},
  },
  {
    id: 'article-detail',
    label: 'Article',
    group: 'Pages',
    navigationGroup: 'DetailBodyTemplate',
    navigationParent: 'thread-detail',
    layoutClassName: 'layout-article-detail',
    exportComponent: 'DetailBodyTemplate',
    exportKind: 'detail',
    preset: {},
  },
  // ── Common ───────────────────────────────────────────────────────────────────
  {
    id: 'typography',
    label: 'Typography',
    navigationSubgroupLabel: 'Typography',
    group: 'Design',
    navigationGroup: 'Common',
    layoutClassName: 'layout-typography',
    exportComponent: 'TypographyBodyTemplate',
    exportKind: 'body-template',
    preset: {},
  },
  {
    id: 'colors',
    label: 'Colors',
    navigationSubgroupLabel: 'Colors',
    group: 'Design',
    navigationGroup: 'Common',
    layoutClassName: 'layout-colors',
    exportComponent: 'ColorsBodyTemplate',
    exportKind: 'body-template',
    preset: {},
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
    preset: {},
    options: topBarOptions,
  },
  // ── LoginBodyTemplate ─────────────────────────────────────────────────────────
  {
    id: 'login',
    label: 'Sign In',
    navigationSubgroupLabel: 'Auth',
    group: 'Auth',
    navigationGroup: 'LoginBodyTemplate',
    layoutClassName: 'layout-login',
    exportComponent: 'LoginBodyTemplate',
    exportKind: 'login',
    preset: {},
    options: loginOptions,
  },
  {
    id: 'login-forgot',
    label: 'Forgot Password',
    navigationLabel: 'Forgot',
    group: 'Auth',
    navigationGroup: 'LoginBodyTemplate',
    navigationParent: 'login',
    layoutClassName: 'layout-login',
    exportComponent: 'LoginBodyTemplate',
    exportKind: 'login',
    preset: {},
    options: loginOptions,
  },
  {
    id: 'login-reset',
    label: 'Reset Password',
    navigationLabel: 'Reset',
    group: 'Auth',
    navigationGroup: 'LoginBodyTemplate',
    navigationParent: 'login',
    layoutClassName: 'layout-login',
    exportComponent: 'LoginBodyTemplate',
    exportKind: 'login',
    preset: {},
    options: loginOptions,
  },
  {
    id: 'login-otp',
    label: 'OTP Verification',
    navigationLabel: 'OTP',
    group: 'Auth',
    navigationGroup: 'LoginBodyTemplate',
    navigationParent: 'login',
    layoutClassName: 'layout-login',
    exportComponent: 'LoginBodyTemplate',
    exportKind: 'login',
    preset: {},
    options: loginOptions,
  },
  // ── DashboardBodyTemplate ─────────────────────────────────────────────────────
  {
    id: 'dashboard',
    label: 'Overview',
    navigationSubgroupLabel: 'Dashboard',
    group: 'Dashboard',
    navigationGroup: 'DashboardBodyTemplate',
    layoutClassName: 'layout-dashboard',
    exportComponent: 'DashboardBodyTemplate',
    exportKind: 'dashboard',
    preset: {},
  },
  // -- WorkbenchBodyTemplate ----------------------------------------------------
  {
    id: 'workbench-panel-editor',
    label: 'Panel Editor',
    navigationSubgroupLabel: 'Workbench',
    group: 'Workbench',
    navigationGroup: 'WorkbenchBodyTemplate',
    layoutClassName: 'layout-workbench-panel-editor',
    exportComponent: 'WorkbenchBodyTemplate',
    exportKind: 'workbench',
    preset: {},
  },
  {
    id: 'workbench-sql-editor',
    label: 'SQL Editor',
    group: 'Workbench',
    navigationGroup: 'WorkbenchBodyTemplate',
    navigationParent: 'workbench-panel-editor',
    layoutClassName: 'layout-workbench-sql-editor',
    exportComponent: 'WorkbenchBodyTemplate',
    exportKind: 'workbench',
    preset: {},
  },
  {
    id: 'workbench-agent-chat',
    label: 'Agent Chat',
    group: 'Workbench',
    navigationGroup: 'WorkbenchBodyTemplate',
    navigationParent: 'workbench-panel-editor',
    layoutClassName: 'layout-workbench-agent-chat',
    exportComponent: 'WorkbenchBodyTemplate',
    exportKind: 'workbench',
    preset: {},
  },
  // ── PanelTemplate ────────────────────────────────────────────────────────────
  {
    id: 'panel',
    label: 'Side Panel',
    navigationSubgroupLabel: 'Panel',
    group: 'Pages',
    navigationGroup: 'PanelTemplate',
    layoutClassName: 'layout-panel',
    exportComponent: 'PanelTemplate',
    exportKind: 'panel',
    preset: {},
  },
]

export type PlaygroundTemplateId = (typeof TEMPLATE_DEFINITIONS)[number]['id']

export function getTemplateDefinition(id: string) {
  return TEMPLATE_DEFINITIONS.find((definition) => definition.id === id)
}

export function createTemplateOverrides(): Record<string, TemplateOverride> {
  return TEMPLATE_DEFINITIONS.reduce(
    (acc, definition) => {
      acc[definition.id] = { ...definition.preset }
      return acc
    },
    {} as Record<string, TemplateOverride>,
  )
}
