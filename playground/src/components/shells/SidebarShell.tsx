import { Link, useParams } from 'react-router-dom'
import {
  Avatar, AvatarFallback,
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
  SidebarProvider, SidebarRail,
} from '@loykin/designkit'
import type { TemplateId } from '@loykin/designkit'
import type { TemplateNavigationGroup, TemplateNavigationItem } from '~/templates'
import { LayoutDashboard, Table2, LayoutGrid, Layers, FileText, Settings, Bell } from 'lucide-react'

export interface SidebarShellProps {
  navigation?: TemplateNavigationGroup[]
  children: React.ReactNode
}

function itemIsActive(item: TemplateNavigationItem, activeItemId?: TemplateId) {
  return item.id === activeItemId || item.children?.some((c) => c.id === activeItemId) === true
}

const demoNav = [
  { icon: Table2,          label: 'Users',     active: true  },
  { icon: LayoutDashboard, label: 'Overview',  active: false },
  { icon: LayoutGrid,      label: 'Products',  active: false },
  { icon: Layers,          label: 'Reports',   active: false },
  { icon: FileText,        label: 'Documents', active: false },
]

const demoSystem = [
  { icon: Bell,     label: 'Alerts',   active: false },
  { icon: Settings, label: 'Settings', active: false },
]

function NavigationSidebarContent({
  navigation,
  activeItemId,
  shellId,
}: {
  navigation?: TemplateNavigationGroup[]
  activeItemId?: TemplateId
  shellId: string
}) {
  if (!navigation?.length) {
    return (
      <>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="h-7 w-7 rounded-(--radius) bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">A</div>
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

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-(--radius) bg-primary text-xs font-bold text-primary-foreground">D</div>
          <span className="text-sm font-semibold">DesignKit</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigation.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon
                  const active = itemIsActive(item, activeItemId)
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={active && !item.children?.length}
                        render={<Link to={!item.children?.length ? `/${shellId}/${item.id}` : '#'} />}
                      >
                        {Icon && <Icon />}
                        <span>{item.label}</span>
                      </SidebarMenuButton>

                      {item.children?.length ? (
                        <SidebarMenuSub>
                          {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.id}>
                              <SidebarMenuSubButton
                                render={<Link to={`/${shellId}/${child.id}`} />}
                                isActive={child.id === activeItemId}
                              >
                                <span>{child.label}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      ) : null}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </>
  )
}

export function SidebarShell({ navigation, children }: SidebarShellProps) {
  const { shell: shellId = 'sidebar', templateId } = useParams()

  return (
    <div className="h-full">
      <SidebarProvider className="h-full min-h-0!">
        <Sidebar>
          <NavigationSidebarContent
            navigation={navigation}
            activeItemId={templateId as TemplateId | undefined}
            shellId={shellId}
          />
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="overflow-hidden">{children}</SidebarInset>
      </SidebarProvider>
    </div>
  )
}
