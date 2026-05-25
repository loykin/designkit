import { Fragment } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Avatar, AvatarFallback,
  Button,
  NavigationMenu, NavigationMenuContent, NavigationMenuItem,
  NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger,
  Separator,
  cn,
} from '@loykin/designkit'
import type { TemplateId } from '@loykin/designkit'
import type { TemplateNavigationGroup, TemplateNavigationItem } from '../../templates'
import { Bell, Settings } from 'lucide-react'

export interface HeaderShellProps {
  navigation?: TemplateNavigationGroup[]
  children: React.ReactNode
}

function itemIsActive(item: TemplateNavigationItem, activeItemId?: TemplateId) {
  return item.id === activeItemId || item.children?.some((c) => c.id === activeItemId) === true
}

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

const demoNav = ['Overview', 'Users', 'Products', 'Reports', 'Settings']

function NavigationHeaderContent({
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
        <div className="flex items-center gap-2 mr-6">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">A</div>
          <span className="text-sm font-semibold">Acme Corp</span>
        </div>
        <nav className="flex items-center gap-1">
          {demoNav.map((item) => (
            <Button key={item} variant="ghost" size="sm"
              className={item === 'Users' ? 'bg-accent text-foreground font-medium' : 'text-muted-foreground'}
            >
              {item}
            </Button>
          ))}
        </nav>
        <HeaderActions />
      </>
    )
  }

  return (
    <>
      <div className="mr-4 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">D</div>
        <span className="text-sm font-semibold">DesignKit</span>
      </div>

      <NavigationMenu>
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
                        <NavigationMenuTrigger className={cn(
                          'h-8 text-sm',
                          active ? 'text-foreground font-medium' : 'text-muted-foreground font-normal',
                        )}>
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="w-36 p-1">
                            {item.children?.map((child) => (
                              <li key={child.id}>
                                <NavigationMenuLink
                                  active={child.id === activeItemId}
                                  render={<Link to={`/${shellId}/${child.id}`} />}
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
                        render={<Link to={`/${shellId}/${item.id}`} />}
                        className={cn(
                          'h-8 px-2.5 py-1.5 text-sm',
                          active ? 'bg-accent text-foreground font-medium' : 'text-muted-foreground',
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

export function HeaderShell({ navigation, children }: HeaderShellProps) {
  const { shell: shellId = 'sidebar', templateId } = useParams()

  return (
    <div className="h-full flex flex-col">
      <header className="flex h-12 shrink-0 items-center border-b px-4 bg-(--dk-header) backdrop-blur-sm">
        <NavigationHeaderContent
          navigation={navigation}
          activeItemId={templateId as TemplateId | undefined}
          shellId={shellId}
        />
      </header>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
