import type { ComponentType } from 'react'
import type { ShellId } from '@/store/types'

export interface ShellConfig {
  id: ShellId
  label: string
  component: ComponentType<{ children: React.ReactNode }>
}

export { SidebarShell } from './SidebarShell'
export { HeaderShell  } from './HeaderShell'

import { SidebarShell } from './SidebarShell'
import { HeaderShell  } from './HeaderShell'

export const SHELLS: ShellConfig[] = [
  { id: 'sidebar', label: 'Sidebar', component: SidebarShell },
  { id: 'header',  label: 'Header',  component: HeaderShell  },
]
