import { Fragment, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import type { TemplateId } from '@/store/types'
import type { TemplateNavigationGroup, TemplateNavigationItem } from '@/components/templates'
import { Bell, Settings } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeaderShellProps {
  header?: React.ReactNode
  navigation?: TemplateNavigationGroup[]
  activeItemId?: TemplateId
  onItemSelect?: (id: TemplateId) => void
  children: React.ReactNode
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function itemIsActive(item: TemplateNavigationItem, activeItemId?: TemplateId) {
  return item.id === activeItemId || item.children?.some((c) => c.id === activeItemId) === true
}

// ─── Actions ──────────────────────────────────────────────────────────────────

function HeaderActions() {
  return (
    <div className="ml-auto flex items-center gap-2">
      <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground">
        <Bell className="h-4 w-4" />
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
        <Settings className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-5" />
      <Avatar className="h-7 w-7 cursor-pointer">
        <AvatarFallback className="bg-primary/20 text-xs text-primary">JD</AvatarFallback>
      </Avatar>
    </div>
  )
}

// ─── Navigation header ────────────────────────────────────────────────────────

const demoNav = ['Overview', 'Users', 'Products', 'Reports', 'Settings']

function NavigationHeaderContent({
  navigation,
  activeItemId,
  onItemSelect,
}: Pick<HeaderShellProps, 'navigation' | 'activeItemId' | 'onItemSelect'>) {
  const [menuValue, setMenuValue] = useState('')

  const handleSelect = (id: TemplateId) => {
    onItemSelect?.(id)
    setMenuValue('')
  }

  if (!navigation?.length) return <DemoHeaderContent />

  return (
    <>
      <div className="mr-4 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
          D
        </div>
        <span className="text-sm font-semibold">DesignKit</span>
      </div>

      <NavigationMenu value={menuValue} onValueChange={setMenuValue}>
        <NavigationMenuList>
          {navigation.map((group, gi) => (
            <Fragment key={group.label}>
              {gi > 0 && (
                <li className="flex items-center">
                  <Separator orientation="vertical" className="mx-1 h-4 shrink-0" />
                </li>
              )}
              {group.items.map((item) => {
                const active = itemIsActive(item, activeItemId)

                return (
                  <NavigationMenuItem key={item.id} value={item.id}>
                    {(item.children?.length ?? 0) > 0 ? (
                      <>
                        <NavigationMenuTrigger
                          className={cn(
                            'h-8 text-sm',
                            active
                              ? 'text-foreground font-medium'
                              : 'text-muted-foreground font-normal',
                          )}
                        >
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="w-36 p-1">
                            {item.children?.map((child) => (
                              <li key={child.id}>
                                <NavigationMenuLink
                                  active={child.id === activeItemId}
                                  render={<button type="button" />}
                                  onClick={() => handleSelect(child.id)}
                                  className="w-full px-2 py-1.5 text-sm"
                                >
                                  {child.label}
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink
                        active={active}
                        render={<button type="button" />}
                        onClick={() => handleSelect(item.id)}
                        className={cn(
                          'h-8 px-2.5 py-1.5 text-sm',
                          active
                            ? 'bg-accent text-foreground font-medium'
                            : 'text-muted-foreground',
                        )}
                      >
                        {item.label}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                )
              })}
            </Fragment>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <HeaderActions />
    </>
  )
}

function DemoHeaderContent() {
  return (
    <>
      <div className="flex items-center gap-2 mr-6">
        <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
          A
        </div>
        <span className="text-sm font-semibold">Acme Corp</span>
      </div>

      <nav className="flex items-center gap-1">
        {demoNav.map((item) => (
          <Button
            key={item}
            variant="ghost"
            size="sm"
            className={
              item === 'Users' ? 'bg-accent text-foreground font-medium' : 'text-muted-foreground'
            }
          >
            {item}
          </Button>
        ))}
      </nav>

      <HeaderActions />
    </>
  )
}

// ─── Shell ────────────────────────────────────────────────────────────────────

export function HeaderShell({
  header,
  navigation,
  activeItemId,
  onItemSelect,
  children,
}: HeaderShellProps) {
  return (
    <div className="h-full flex flex-col">
      <header className="flex h-12 shrink-0 items-center border-b px-4 bg-(--dk-header) backdrop-blur-sm">
        {header ?? (
          <NavigationHeaderContent
            navigation={navigation}
            activeItemId={activeItemId}
            onItemSelect={onItemSelect}
          />
        )}
      </header>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
