import type { ComponentType } from 'react'
import type { ShellId, TemplateId } from '@/store/types'
import type { TemplateNavigationGroup } from '@/components/templates'

export interface ShellComponentProps {
  children: React.ReactNode
  navigation?: TemplateNavigationGroup[]
  activeItemId?: TemplateId
  onItemSelect?: (id: TemplateId) => void
}

export interface ShellConfig {
  id: ShellId
  label: string
  component: ComponentType<ShellComponentProps>
}

export { SidebarShell } from './SidebarShell'
export { HeaderShell  } from './HeaderShell'

import { SidebarShell } from './SidebarShell'
import { HeaderShell  } from './HeaderShell'

export const SHELLS: ShellConfig[] = [
  { id: 'sidebar', label: 'Sidebar', component: SidebarShell },
  { id: 'header',  label: 'Header',  component: HeaderShell  },
]
