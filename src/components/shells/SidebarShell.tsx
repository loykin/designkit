import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarRail,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LayoutDashboard, Table2, LayoutGrid, Layers, FileText, Settings, Bell } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SidebarShellProps {
  /** Sidebar slot: override entire sidebar contents */
  sidebar?: React.ReactNode
  children: React.ReactNode
}

// ─── Demo sidebar ─────────────────────────────────────────────────────────────

const demoNav = [
  { icon: Table2,         label: 'Users',     active: true  },
  { icon: LayoutDashboard,label: 'Overview',  active: false },
  { icon: LayoutGrid,     label: 'Products',  active: false },
  { icon: Layers,         label: 'Reports',   active: false },
  { icon: FileText,       label: 'Documents', active: false },
]

const demoSystem = [
  { icon: Bell,     label: 'Alerts',   active: false },
  { icon: Settings, label: 'Settings', active: false },
]

function DemoSidebarContent() {
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="h-7 w-7 rounded-[--radius] bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
            A
          </div>
          <span className="text-sm font-semibold">Acme Corp</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {demoNav.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton isActive={item.active}>
                    <item.icon /><span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {demoSystem.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton isActive={item.active}>
                    <item.icon /><span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-1">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs bg-primary/20 text-primary">JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">john@acme.com</p>
          </div>
        </div>
      </SidebarFooter>
    </>
  )
}

// ─── Shell ────────────────────────────────────────────────────────────────────

export function SidebarShell({ sidebar, children }: SidebarShellProps) {
  return (
    <div className="h-full" style={{ transform: 'translateZ(0)' }}>
      <SidebarProvider className="h-full min-h-0!">
        <Sidebar>
          {sidebar ?? <DemoSidebarContent />}
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="overflow-hidden">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
