import React, { useEffect, useState } from 'react'
import { DataPage } from '@/components/templates/datapage/DataPage'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

// Matches Tailwind's lg breakpoint (1024px) used for layout switching
function useIsNarrow() {
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1023px)')
    setNarrow(mql.matches)
    const handler = (e: MediaQueryListEvent) => setNarrow(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])
  return narrow
}

export interface BrowseBodyTemplateProps {
  theme?: React.CSSProperties
  className?: string
  topBar?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  status?: React.ReactNode
  actions?: React.ReactNode
  sidebar: React.ReactNode
  sidebarTitle?: string
  sidebarWidth?: string
  toolbar?: React.ReactNode
  footer?: React.ReactNode
  contentClassName?: string
  children?: React.ReactNode
}

export function BrowseBodyTemplate({
  theme,
  className,
  topBar,
  title,
  description,
  status,
  actions,
  sidebar,
  sidebarTitle = 'Filters',
  sidebarWidth = '18rem',
  toolbar,
  footer,
  contentClassName,
  children,
}: BrowseBodyTemplateProps) {
  const isNarrow = useIsNarrow()
  const hasHeader = title || description || status || actions

  return (
    <DataPage className={cn('layout-browse', className)} style={theme}>
      {topBar && <div className="shrink-0">{topBar}</div>}

      {hasHeader && (
        <DataPage.Header>
          <DataPage.TitleBlock title={title} description={description} status={status} />
          <DataPage.Actions>{actions}</DataPage.Actions>
        </DataPage.Header>
      )}

      <DataPage.Content padding="none" className="flex flex-col overflow-hidden">
        {/* Toolbar row */}
        {(toolbar || isNarrow) && (
          <div className="flex shrink-0 items-center gap-2 border-b px-(--designkit-page-padding-x) py-2">
            {isNarrow && (
              <Sheet>
                <SheetTrigger
                  render={<Button variant="outline" size="sm" className="shrink-0 gap-1.5" />}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  {sidebarTitle}
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col gap-0 p-0">
                  <SheetHeader className="shrink-0 border-b px-4 py-3">
                    <SheetTitle>{sidebarTitle}</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="flex-1">
                    <div className="p-4">{sidebar}</div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            )}
            {toolbar && <div className="flex min-w-0 flex-1 items-center gap-2">{toolbar}</div>}
          </div>
        )}

        {/* Content: sidebar (desktop) + main */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {!isNarrow && (
            <aside className="shrink-0 overflow-hidden border-r" style={{ width: sidebarWidth }}>
              <ScrollArea className="h-full">
                <div className="px-(--designkit-page-padding-x) py-(--designkit-page-padding-y)">
                  {sidebar}
                </div>
              </ScrollArea>
            </aside>
          )}
          <div
            className={cn(
              'min-w-0 flex-1 overflow-hidden px-(--designkit-page-padding-x) py-(--designkit-page-padding-y)',
              '[&_.gridkit-shell]:h-full [&_.gridkit-table-stack]:flex-1 [&_.gridkit-table-stack]:min-h-0',
              '[&_.gridkit-frame]:flex-1 [&_.gridkit-frame]:min-h-0 [&_.gridkit-frame]:overflow-auto',
              contentClassName,
            )}
          >
            {children}
          </div>
        </div>
      </DataPage.Content>

      {footer && <DataPage.Footer>{footer}</DataPage.Footer>}
    </DataPage>
  )
}
