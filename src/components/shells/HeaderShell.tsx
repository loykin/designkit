import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import type { TemplateNavigationGroup, TemplateNavigationItem } from '@/components/templates'
import { Bell, ChevronLeft, ChevronRight, Menu, Settings } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeaderShellProps {
  header?: React.ReactNode
  navigation?: TemplateNavigationGroup[]
  activeItemId?: string
  onItemSelect?: (id: string) => void
  children: React.ReactNode
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function itemIsActive(item: TemplateNavigationItem, activeItemId?: string) {
  return item.id === activeItemId || item.children?.some((c) => c.id === activeItemId) === true
}

/** A horizontally scrollable header nav needs a pointer affordance: overlay scrollbars
 *  are invisible until scrolled, so without arrows the overflowed items are unreachable. */
const NAV_SCROLL_STEP = 160

function useNavOverflow<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [overflow, setOverflow] = useState({ start: false, end: false })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      const max = el.scrollWidth - el.clientWidth
      setOverflow({ start: el.scrollLeft > 1, end: el.scrollLeft < max - 1 })
    }

    update()
    el.addEventListener('scroll', update, { passive: true })

    let observer: ResizeObserver | undefined
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(update)
      observer.observe(el)
      for (const child of Array.from(el.children)) observer.observe(child)
    }

    return () => {
      el.removeEventListener('scroll', update)
      observer?.disconnect()
    }
  }, [])

  const scrollBy = useCallback((direction: -1 | 1) => {
    ref.current?.scrollBy({ left: direction * NAV_SCROLL_STEP, behavior: 'smooth' })
  }, [])

  return { ref, overflow, scrollBy }
}

/** Thin, always-rendered track so the nav reads as scrollable on every platform. */
const navScrollAreaClass =
  'min-w-0 justify-start overflow-x-auto overflow-y-hidden overscroll-x-contain pb-1 [scrollbar-width:thin] [scrollbar-color:var(--border)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent'

function NavScrollButton({
  direction,
  disabled,
  onClick,
}: {
  direction: 'start' | 'end'
  disabled: boolean
  onClick: () => void
}) {
  const Icon = direction === 'start' ? ChevronLeft : ChevronRight

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      tabIndex={-1}
      aria-hidden
      disabled={disabled}
      onClick={onClick}
      className="h-8 w-6 shrink-0 text-muted-foreground disabled:opacity-30"
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}

// ─── Actions ──────────────────────────────────────────────────────────────────

function HeaderActions() {
  return (
    <div className="ml-auto flex shrink-0 items-center gap-2 pl-2">
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

function MobileNavSheet({
  navigation,
  activeItemId,
  onItemSelect,
}: Pick<HeaderShellProps, 'navigation' | 'activeItemId' | 'onItemSelect'>) {
  const [open, setOpen] = useState(false)

  const handleSelect = (id: string) => {
    onItemSelect?.(id)
    setOpen(false)
  }

  const allItems = navigation?.flatMap((g) => g.items) ?? []

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
        <Menu className="h-4 w-4" />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="border-b border-border px-4 py-3">
          <SheetTitle className="text-sm">Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-0.5 p-2">
          {allItems.map((item) => {
            const Icon = item.icon
            const active = itemIsActive(item, activeItemId)
            return (
              <Fragment key={item.id}>
                <button
                  type="button"
                  onClick={() => !item.children?.length && handleSelect(item.id)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-(--radius) px-3 py-2 text-left text-sm transition-colors',
                    active && !item.children?.length
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {Icon && <Icon className="h-4 w-4 shrink-0" />}
                  {item.label}
                </button>
                {item.children?.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => handleSelect(child.id)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-(--radius) py-1.5 pl-9 pr-3 text-left text-sm transition-colors',
                      child.id === activeItemId
                        ? 'bg-accent text-accent-foreground font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    {child.label}
                  </button>
                ))}
              </Fragment>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

function NavigationHeaderContent({
  navigation,
  activeItemId,
  onItemSelect,
}: Pick<HeaderShellProps, 'navigation' | 'activeItemId' | 'onItemSelect'>) {
  const [menuValue, setMenuValue] = useState('')
  const { ref: listRef, overflow, scrollBy } = useNavOverflow<HTMLUListElement>()
  const scrollable = overflow.start || overflow.end

  const handleSelect = (id: string) => {
    onItemSelect?.(id)
    setMenuValue('')
  }

  if (!navigation?.length) return <DemoHeaderContent />

  return (
    <>
      {/* Mobile: hamburger + logo */}
      <div className="flex shrink-0 items-center gap-2 md:hidden">
        <MobileNavSheet
          navigation={navigation}
          activeItemId={activeItemId}
          onItemSelect={onItemSelect}
        />
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
          D
        </div>
      </div>

      {/* Desktop: logo + nav */}
      <div className="mr-4 hidden shrink-0 items-center gap-2 md:flex">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
          D
        </div>
        <span className="text-sm font-semibold">DesignKit</span>
      </div>

      <div className="hidden min-w-0 flex-1 items-center md:flex">
        {scrollable && (
          <NavScrollButton
            direction="start"
            disabled={!overflow.start}
            onClick={() => scrollBy(-1)}
          />
        )}

        <NavigationMenu
          value={menuValue}
          onValueChange={setMenuValue}
          className="min-w-0 max-w-none flex-1 justify-start"
        >
          <NavigationMenuList ref={listRef} className={navScrollAreaClass}>
          {navigation.map((group, gi) => (
            <Fragment key={group.label}>
              {gi > 0 && (
                <li className="flex shrink-0 items-center">
                  <Separator orientation="vertical" className="mx-1 h-4 shrink-0" />
                </li>
              )}
              {group.items.map((item) => {
                const active = itemIsActive(item, activeItemId)

                return (
                  <NavigationMenuItem key={item.id} value={item.id} className="shrink-0">
                    {(item.children?.length ?? 0) > 0 ? (
                      <>
                        <NavigationMenuTrigger
                          className={cn(
                            'h-8 whitespace-nowrap text-sm',
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
                          'h-8 whitespace-nowrap px-2.5 py-1.5 text-sm',
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

        {scrollable && (
          <NavScrollButton direction="end" disabled={!overflow.end} onClick={() => scrollBy(1)} />
        )}
      </div>

      <HeaderActions />
    </>
  )
}

function DemoHeaderContent() {
  const { ref: navRef, overflow, scrollBy } = useNavOverflow<HTMLElement>()
  const scrollable = overflow.start || overflow.end

  return (
    <>
      <div className="flex shrink-0 items-center gap-2 mr-6">
        <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
          A
        </div>
        <span className="text-sm font-semibold hidden sm:inline">Acme Corp</span>
      </div>

      <div className="hidden min-w-0 flex-1 items-center md:flex">
        {scrollable && (
          <NavScrollButton
            direction="start"
            disabled={!overflow.start}
            onClick={() => scrollBy(-1)}
          />
        )}

        <nav ref={navRef} className={cn('flex flex-1 items-center gap-1', navScrollAreaClass)}>
          {demoNav.map((item) => (
            <Button
              key={item}
              variant="ghost"
              size="sm"
              className={cn(
                'shrink-0',
                item === 'Users'
                  ? 'bg-accent text-foreground font-medium'
                  : 'text-muted-foreground',
              )}
            >
              {item}
            </Button>
          ))}
        </nav>

        {scrollable && (
          <NavScrollButton direction="end" disabled={!overflow.end} onClick={() => scrollBy(1)} />
        )}
      </div>

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
      <header className="flex h-12 min-w-0 shrink-0 items-center border-b border-border px-4 bg-(--designkit-header) backdrop-blur-sm">
        {header ?? (
          <NavigationHeaderContent
            navigation={navigation}
            activeItemId={activeItemId}
            onItemSelect={onItemSelect}
          />
        )}
      </header>
      <div className="min-h-0 min-w-0 flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
