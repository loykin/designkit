import type { ComponentType } from 'react'
import type { TemplateId } from '@/store/types'

export interface TemplateConfig {
  id:        TemplateId
  label:     string
  component: ComponentType<{ theme?: React.CSSProperties }>
}

export { TableBodyTemplate     } from './table/TableBodyTemplate'
export { DashboardBodyTemplate } from './dashboard/DashboardBodyTemplate'
export { CardListBodyTemplate  } from './cardlist/CardListBodyTemplate'
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
import { CardListBodyTemplate  } from './cardlist/CardListBodyTemplate'
import { TabbedBodyTemplate    } from './tabbed/TabbedBodyTemplate'
import { FormBodyTemplate      } from './form/FormBodyTemplate'

export const TEMPLATES: TemplateConfig[] = [
  { id: 'table',     label: 'Table',     component: TableBodyTemplate     },
  { id: 'dashboard', label: 'Dashboard', component: DashboardBodyTemplate },
  { id: 'cardlist',  label: 'Card List', component: CardListBodyTemplate  },
  { id: 'tabbed',    label: 'Tabbed',    component: TabbedBodyTemplate    },
  { id: 'form',      label: 'Form',      component: FormBodyTemplate      },
]
