import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import type { TemplateId } from '@/store/types'
import type { TemplateNavigationGroup, TemplateNavigationItem } from '@/components/templates'
import { Bell, Settings } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeaderShellProps {
  /** Header slot: override entire header contents */
  header?: React.ReactNode
  navigation?: TemplateNavigationGroup[]
  activeItemId?: TemplateId
  onItemSelect?: (id: TemplateId) => void
  children: React.ReactNode
}

// ─── Demo header ──────────────────────────────────────────────────────────────

const demoNav = ['Overview', 'Users', 'Products', 'Reports', 'Settings']

function itemIsActive(item: TemplateNavigationItem, activeItemId?: TemplateId) {
  return item.id === activeItemId || item.children?.some((child) => child.id === activeItemId) === true
}

function NavigationHeaderContent({
  navigation,
  activeItemId,
  onItemSelect,
}: Pick<HeaderShellProps, 'navigation' | 'activeItemId' | 'onItemSelect'>) {
  if (!navigation?.length) return <DemoHeaderContent />

  return (
    <>
      <div className="mr-5 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius)] bg-primary text-xs font-bold text-primary-foreground">
          D
        </div>
        <span className="text-sm font-semibold">DesignKit</span>
      </div>

      <nav className="flex min-w-0 items-center gap-4 overflow-x-auto">
        {navigation.map((group) => (
          <div key={group.label} className="flex items-center gap-1">
            {group.items.map((item) => {
              const Icon = item.icon
              const active = itemIsActive(item, activeItemId)

              return (
                <div key={item.id} className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => !item.children?.length && onItemSelect?.(item.id)}
                    className={[
                      'flex h-8 items-center gap-1.5 rounded-[var(--radius)] px-2.5 text-sm transition-colors',
                      active && !item.children?.length
                        ? 'bg-accent text-foreground font-medium'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                    ].join(' ')}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </button>

                  {item.children?.length ? (
                    <div className="flex items-center gap-0.5 border-l pl-1">
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => onItemSelect?.(child.id)}
                          className={[
                            'h-7 rounded-[var(--radius)] px-2 text-xs transition-colors',
                            child.id === activeItemId
                              ? 'bg-accent text-foreground font-medium'
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                          ].join(' ')}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        ))}
      </nav>

      <HeaderActions />
    </>
  )
}

function HeaderActions() {
  return (
    <div className="ml-auto flex items-center gap-2">
      <button className="relative flex h-8 w-8 items-center justify-center rounded-[var(--radius)] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
        <Bell className="h-4 w-4" />
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
      </button>
      <button className="flex h-8 w-8 items-center justify-center rounded-[var(--radius)] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
        <Settings className="h-4 w-4" />
      </button>
      <Separator orientation="vertical" className="h-5" />
      <Avatar className="h-7 w-7 cursor-pointer">
        <AvatarFallback className="bg-primary/20 text-xs text-primary">JD</AvatarFallback>
      </Avatar>
    </div>
  )
}

function DemoHeaderContent() {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 mr-6">
        <div className="h-7 w-7 rounded-[var(--radius)] bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
          A
        </div>
        <span className="text-sm font-semibold">Acme Corp</span>
      </div>

      {/* Nav links */}
      <nav className="flex items-center gap-1">
        {demoNav.map((item) => (
          <button
            key={item}
            className={[
              'px-3 py-1.5 text-sm rounded-[var(--radius)] transition-colors',
              item === 'Users'
                ? 'bg-accent text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent',
            ].join(' ')}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Right actions */}
      <HeaderActions />
    </>
  )
}

// ─── Shell ────────────────────────────────────────────────────────────────────

export function HeaderShell({ header, navigation, activeItemId, onItemSelect, children }: HeaderShellProps) {
  return (
    <div className="h-full flex flex-col">
      <header className="flex h-12 shrink-0 items-center border-b px-4 bg-background">
        {header ?? (
          <NavigationHeaderContent
            navigation={navigation}
            activeItemId={activeItemId}
            onItemSelect={onItemSelect}
          />
        )}
      </header>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
