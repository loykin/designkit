import { createElement, type ComponentType } from 'react'
import type { TemplateId } from '@/store/types'
import { FileText, LayoutDashboard, Table2, Layers } from 'lucide-react'
import { TEMPLATE_DEFINITIONS } from './definitions'
import type { TemplateCodeBuilder } from './code'
export {
  TEMPLATE_DEFINITIONS,
  createTemplateOverrides,
  getTemplateDefinition,
} from './definitions'
export type {
  TemplateDefinition,
  TemplateExportKind,
  TemplateGroup,
  TemplateNavigationGroupId,
  TemplateOptionSpec,
  TemplateOptionChoice,
} from './definitions'

export interface TemplateConfig {
  id: TemplateId
  label: string
  component: ComponentType<{ theme?: React.CSSProperties }>
  buildCode?: TemplateCodeBuilder
  group?: string
  description?: string
}

export interface TemplateNavigationItem {
  id: TemplateId
  label: string
  icon?: ComponentType<{ className?: string }>
  children?: TemplateNavigationItem[]
}

export interface TemplateNavigationGroup {
  label: string
  items: TemplateNavigationItem[]
}

export {
  DataGridView,
  type DataGridViewProps,
  type DataGridColumnDef,
  type DataGridViewVariant,
} from './table/DataGridView'
export { DataBodyTemplate } from './databody/DataBodyTemplate'
export { DataBodyTemplateDemo } from './databody/DataBodyTemplateDemo'
export { FormWizardBodyTemplate } from './form/FormWizardBodyTemplate'
export type {
  FormWizardBodyTemplateProps,
  FormWizardStep,
  FormWizardVariant,
} from './form/FormWizardBodyTemplate'
export { FormWizardBodyTemplateDemo } from './form/FormWizardBodyTemplateDemo'
export { TypographyBodyTemplate } from './typography/TypographyBodyTemplate'
export type { TypographyBodyTemplateProps } from './typography/TypographyBodyTemplate'
export { ColorsBodyTemplate } from './typography/ColorsBodyTemplate'
export type { ColorsBodyTemplateProps } from './typography/ColorsBodyTemplate'
export { DataPage } from './datapage/DataPage'
export type {
  DataPageActionsProps,
  DataPageContentProps,
  DataPageFooterProps,
  DataPageGroupBodyProps,
  DataPageGroupHeaderProps,
  DataPageGroupProps,
  DataPageGroupToolbarProps,
  DataPageHeaderProps,
  DataPageProps,
  DataPageTabProps,
  DataPageTabsProps,
  DataPageTitleBlockProps,
} from './datapage/DataPage'
export type {
  TemplateCodeBuilder,
  TemplateCodeContext,
} from './code'
export type {
  DataBodyTabProps,
  DataBodySectionProps,
  DataBodySummaryProps,
  DataBodyGroupProps,
  DataBodyRowProps,
  DataBodyFieldProps,
  DataBodyTemplateProps,
  GroupLayout,
  GroupVariant,
} from './databody/DataBodyTemplate'

import { DataGridTemplateDemo, buildDataGridTemplateCode } from './table/DataGridTemplateDemo'
import type { DataGridViewVariant } from './table/DataGridView'
import { DataBodyTemplateDemo, buildDataBodyTemplateCode } from './databody/DataBodyTemplateDemo'
import { DetailBodyTemplateDemo, buildDetailBodyTemplateCode } from './databody/DetailBodyTemplateDemo'
import { SplitBodyTemplateDemo, buildSplitBodyTemplateCode } from './databody/SplitBodyTemplateDemo'
import { TabbedBodyTemplateDemo, buildTabbedBodyTemplateCode } from './tabbed/TabbedBodyTemplateDemo'
import { FormBodyTemplateDemo, buildFormBodyTemplateCode } from './form/FormBodyTemplateDemo'
import { FormStackedBodyTemplateDemo, buildFormStackedBodyTemplateCode } from './form/FormStackedBodyTemplateDemo'
import { FormWizardBodyTemplateDemo, buildFormWizardBodyTemplateCode } from './form/FormWizardBodyTemplateDemo'
import { FormInlineBodyTemplateDemo, buildFormInlineBodyTemplateCode } from './form/FormInlineBodyTemplateDemo'
import { SectionedBodyTemplateDemo, buildSectionedBodyTemplateCode } from './sectioned/SectionedBodyTemplateDemo'
import { TypographyBodyTemplate } from './typography/TypographyBodyTemplate'
import { ColorsBodyTemplate } from './typography/ColorsBodyTemplate'

function DataGridTemplatePreview(props: {
  theme?: React.CSSProperties
  variant: DataGridViewVariant
  layoutClassName: string
  breadcrumb: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
}) {
  return createElement(DataGridTemplateDemo, props)
}

function createDataGridPreview(id: TemplateId) {
  const definition = TEMPLATE_DEFINITIONS.find((item) => item.id === id)
  return function DataGridPreview({ theme }: { theme?: React.CSSProperties }) {
    return createElement(DataGridTemplatePreview, {
      theme,
      variant: definition?.preview?.variant ?? 'standard',
      layoutClassName: definition?.layoutClassName ?? `layout-${id}`,
      breadcrumb: definition?.preview?.breadcrumb ?? 'Data / Table',
      title: definition?.preview?.title ?? 'Users',
      description: definition?.preview?.description,
    })
  }
}

const previewComponents: Record<TemplateId, ComponentType<{ theme?: React.CSSProperties }>> = {
  table: createDataGridPreview('table'),
  'table-infinity': createDataGridPreview('table-infinity'),
  'table-drag': createDataGridPreview('table-drag'),
  'table-card': createDataGridPreview('table-card'),
  'table-card-list': createDataGridPreview('table-card-list'),
  databody: DataBodyTemplateDemo,
  'databody-detail': DetailBodyTemplateDemo,
  'databody-split': SplitBodyTemplateDemo,
  tabbed: TabbedBodyTemplateDemo,
  form: FormBodyTemplateDemo,
  'form-stacked': FormStackedBodyTemplateDemo,
  'form-wizard': FormWizardBodyTemplateDemo,
  'form-inline': FormInlineBodyTemplateDemo,
  sectioned: SectionedBodyTemplateDemo,
  typography: TypographyBodyTemplate,
  colors: ColorsBodyTemplate,
}

const codeBuilders: Partial<Record<TemplateId, TemplateCodeBuilder>> = {
  table: buildDataGridTemplateCode,
  'table-infinity': buildDataGridTemplateCode,
  'table-drag': buildDataGridTemplateCode,
  'table-card': buildDataGridTemplateCode,
  'table-card-list': buildDataGridTemplateCode,
  databody: buildDataBodyTemplateCode,
  'databody-detail': buildDetailBodyTemplateCode,
  'databody-split': buildSplitBodyTemplateCode,
  tabbed: buildTabbedBodyTemplateCode,
  form: buildFormBodyTemplateCode,
  'form-stacked': buildFormStackedBodyTemplateCode,
  'form-wizard': buildFormWizardBodyTemplateCode,
  'form-inline': buildFormInlineBodyTemplateCode,
  sectioned: buildSectionedBodyTemplateCode,
}

export const TEMPLATES: TemplateConfig[] = TEMPLATE_DEFINITIONS.map((definition) => ({
  id: definition.id,
  label: definition.label,
  group: definition.group,
  component: previewComponents[definition.id],
  buildCode: codeBuilders[definition.id],
}))

const iconById: Partial<Record<TemplateId, ComponentType<{ className?: string }>>> = {
  table:         Table2,
  'table-card':  Layers,
  databody:      LayoutDashboard,
  sectioned:     FileText,
  form:          FileText,
  'form-wizard': FileText,
}

const navigationGroupIcon: Partial<Record<string, ComponentType<{ className?: string }>>> = {
  DataBodyTemplate:       LayoutDashboard,
  FormWizardBodyTemplate: Layers,
}

const navigationLabelOrder = ['Common', 'DataBodyTemplate', 'FormWizardBodyTemplate']

export const TEMPLATE_NAVIGATION: TemplateNavigationGroup[] = navigationLabelOrder.map((groupId) => {
  const definitions = TEMPLATE_DEFINITIONS.filter((d) => d.navigationGroup === groupId)
  const parentDefinitions = definitions.filter((d) => !d.navigationParent)
  const label = groupId

  return {
    label,
    items: parentDefinitions.map((definition) => {
      const childDefs = definitions.filter((d) => d.navigationParent === definition.id)
      const hasChildren = childDefs.length > 0

      return {
        id: definition.id,
        label: definition.navigationSubgroupLabel ?? definition.navigationLabel ?? definition.label,
        icon: iconById[definition.id] ?? navigationGroupIcon[label],
        children: hasChildren
          ? [
              { id: definition.id, label: definition.navigationLabel ?? definition.label },
              ...childDefs.map((child) => ({ id: child.id, label: child.navigationLabel ?? child.label })),
            ]
          : [],
      }
    }),
  }
}).filter((group) => group.items.length > 0)
