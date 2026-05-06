import { createElement, type ComponentType } from 'react'
import type { TemplateId } from '@/store/types'
import { CreditCard, FileText, LayoutDashboard, Table2, Type } from 'lucide-react'

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
  TableBodyTemplate,
  type TableBodyTemplateProps,
  type TableBodyVariant,
  type TableColumn,
  type TableVariantTab,
} from './table/TableBodyTemplate'
export { DashboardBodyTemplate } from './dashboard/DashboardBodyTemplate'
export { CardListBodyTemplate  } from './cardlist/CardListBodyTemplate'
export { TypographyBodyTemplate } from './typography/TypographyBodyTemplate'
export { TabbedBodyTemplate    } from './tabbed/TabbedBodyTemplate'
export { FormBodyTemplate      } from './form/FormBodyTemplate'
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

import { TableBodyTemplate     } from './table/TableBodyTemplate'
import { DashboardBodyTemplate } from './dashboard/DashboardBodyTemplate'
import { TypographyBodyTemplate } from './typography/TypographyBodyTemplate'
import { TabbedBodyTemplate    } from './tabbed/TabbedBodyTemplate'
import { FormBodyTemplate      } from './form/FormBodyTemplate'

function StandardTableTemplate({ theme }: { theme?: React.CSSProperties }) {
  return createElement(TableBodyTemplate, { theme, variant: 'standard', layoutClassName: 'layout-table', title: 'Users' })
}

function InfinityTableTemplate({ theme }: { theme?: React.CSSProperties }) {
  return createElement(TableBodyTemplate, {
    theme,
    variant: 'infinity',
    layoutClassName: 'layout-table-infinity',
    title: 'Users',
    description: 'gridkit DataGridInfinity',
  })
}

function DragTableTemplate({ theme }: { theme?: React.CSSProperties }) {
  return createElement(TableBodyTemplate, {
    theme,
    variant: 'drag',
    layoutClassName: 'layout-table-drag',
    title: 'Services',
    description: 'gridkit DataGridDrag',
  })
}

function CardTableTemplate({ theme }: { theme?: React.CSSProperties }) {
  return createElement(TableBodyTemplate, {
    theme,
    variant: 'card',
    layoutClassName: 'layout-table-card',
    title: 'User Cards',
    description: 'gridkit DataGridCard',
  })
}

function CardListTableTemplate({ theme }: { theme?: React.CSSProperties }) {
  return createElement(TableBodyTemplate, {
    theme,
    variant: 'card-list',
    layoutClassName: 'layout-table-card-list',
    title: 'User Cards',
    description: 'gridkit DataGridCard list mode',
  })
}

export const TEMPLATES: TemplateConfig[] = [
  { id: 'table',          label: 'Standard',        group: 'Table', component: StandardTableTemplate },
  { id: 'table-infinity', label: 'Infinite Scroll', group: 'Table', component: InfinityTableTemplate },
  { id: 'table-drag',     label: 'Row Drag',        group: 'Table', component: DragTableTemplate     },
  { id: 'table-card',     label: 'Card Grid',       group: 'Table', component: CardTableTemplate     },
  { id: 'table-card-list', label: 'Card List',      group: 'Table', component: CardListTableTemplate },
  { id: 'dashboard',      label: 'Dashboard',       group: 'Pages', component: DashboardBodyTemplate },
  { id: 'typography',     label: 'Typography',      group: 'Design', component: TypographyBodyTemplate },
  { id: 'tabbed',         label: 'Tabbed',          group: 'Pages', component: TabbedBodyTemplate    },
  { id: 'form',           label: 'Form',            group: 'Pages', component: FormBodyTemplate      },
]

export const TEMPLATE_NAVIGATION: TemplateNavigationGroup[] = [
  {
    label: 'Data',
    items: [
      {
        id: 'table',
        label: 'Table',
        icon: Table2,
        children: [
          { id: 'table',          label: 'Standard'        },
          { id: 'table-infinity', label: 'Infinite Scroll' },
          { id: 'table-drag',     label: 'Row Drag'        },
          { id: 'table-card',     label: 'Card Grid'       },
          { id: 'table-card-list', label: 'Card List'      },
        ],
      },
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Design',
    items: [
      { id: 'typography', label: 'Typography', icon: Type },
    ],
  },
  {
    label: 'Workflow',
    items: [
      { id: 'tabbed', label: 'Tabbed', icon: CreditCard },
      { id: 'form',   label: 'Form',   icon: FileText   },
    ],
  },
]
