import { createElement, type ComponentType } from 'react'
import type { TemplateId } from '@/store/types'
import { CreditCard, FileText, LayoutDashboard, Table2, Type } from 'lucide-react'
import { TEMPLATE_DEFINITIONS } from './definitions'
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
export { DashboardBodyTemplate } from './dashboard/DashboardBodyTemplate'
export { DashboardBodyTemplateDemo } from './dashboard/DashboardBodyTemplateDemo'
export { TypographyBodyTemplate } from './typography/TypographyBodyTemplate'
export { DataBodyTemplate } from './databody/DataBodyTemplate'
export { DataBodyTemplateDemo } from './databody/DataBodyTemplateDemo'
export { TabbedBodyTemplate    } from './tabbed/TabbedBodyTemplate'
export { TabbedBodyTemplateDemo } from './tabbed/TabbedBodyTemplateDemo'
export { FormBodyTemplate           } from './form/FormBodyTemplate'
export { FormBodyTemplateDemo       } from './form/FormBodyTemplateDemo'
export { FormStackedBodyTemplate    } from './form/FormStackedBodyTemplate'
export { FormStackedBodyTemplateDemo } from './form/FormStackedBodyTemplateDemo'
export { FormWizardBodyTemplate     } from './form/FormWizardBodyTemplate'
export { FormWizardBodyTemplateDemo } from './form/FormWizardBodyTemplateDemo'
export { FormInlineBodyTemplate     } from './form/FormInlineBodyTemplate'
export { FormInlineBodyTemplateDemo } from './form/FormInlineBodyTemplateDemo'
export { DataPage              } from './datapage/DataPage'
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

import { DataGridTemplateDemo } from './table/DataGridTemplateDemo'
import type { DataGridViewVariant } from './table/DataGridView'
import { DashboardBodyTemplateDemo } from './dashboard/DashboardBodyTemplateDemo'
import { TypographyBodyTemplate } from './typography/TypographyBodyTemplate'
import { DataBodyTemplateDemo } from './databody/DataBodyTemplateDemo'
import { TabbedBodyTemplateDemo } from './tabbed/TabbedBodyTemplateDemo'
import { FormBodyTemplateDemo         } from './form/FormBodyTemplateDemo'
import { FormStackedBodyTemplateDemo  } from './form/FormStackedBodyTemplateDemo'
import { FormWizardBodyTemplateDemo   } from './form/FormWizardBodyTemplateDemo'
import { FormInlineBodyTemplateDemo   } from './form/FormInlineBodyTemplateDemo'

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
  dashboard: DashboardBodyTemplateDemo,
  typography: (props) => createElement(TypographyBodyTemplate, {
    ...props,
    breadcrumb: 'Design / Typography',
  }),
  databody: DataBodyTemplateDemo,
  tabbed: TabbedBodyTemplateDemo,
  form: FormBodyTemplateDemo,
  'form-stacked': FormStackedBodyTemplateDemo,
  'form-wizard': FormWizardBodyTemplateDemo,
  'form-inline': FormInlineBodyTemplateDemo,
}

export const TEMPLATES: TemplateConfig[] = TEMPLATE_DEFINITIONS.map((definition) => ({
  id: definition.id,
  label: definition.label,
  group: definition.group,
  component: previewComponents[definition.id],
}))

const iconById: Partial<Record<TemplateId, ComponentType<{ className?: string }>>> = {
  table: Table2,
  dashboard: LayoutDashboard,
  typography: Type,
  databody: LayoutDashboard,
  tabbed: CreditCard,
  form: FileText,
}

const navigationLabelOrder: TemplateNavigationGroup['label'][] = ['Data', 'Design', 'Workflow']

export const TEMPLATE_NAVIGATION: TemplateNavigationGroup[] = navigationLabelOrder.map((label) => {
  const definitions = TEMPLATE_DEFINITIONS.filter((definition) => definition.navigationGroup === label)
  const parentDefinitions = definitions.filter((definition) => !definition.navigationParent)

  return {
    label,
    items: parentDefinitions.map((definition) => {
      const childDefs = definitions.filter((d) => d.navigationParent === definition.id)
      const hasChildren = childDefs.length > 0
      const groupLabel =
        definition.group === 'Table' ? 'Table' :
        definition.id === 'form'     ? 'Form'  :
        definition.label

      return {
        id: definition.id,
        label: groupLabel,
        icon: iconById[definition.id],
        children: hasChildren
          ? [
              { id: definition.id, label: definition.label },
              ...childDefs.map((child) => ({ id: child.id, label: child.label })),
            ]
          : [],
      }
    }),
  }
}).filter((group) => group.items.length > 0)
