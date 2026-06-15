import React, { type CSSProperties, type ReactNode, useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import { DataPage } from '../datapage/DataPage'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

type ResizeAxis = 'x' | 'y'

export interface WorkbenchBodyTemplateProps {
  theme?: CSSProperties
  className?: string
  contentClassName?: string
  title?: ReactNode
  description?: ReactNode
  topBar?: ReactNode
  /** Right side of the built-in workbench header. Prefer this over toolbar for new code. */
  headerRight?: ReactNode
  /** @deprecated Use headerRight. */
  toolbar?: ReactNode
  actions?: ReactNode
  leftPane?: ReactNode
  mainPane?: ReactNode
  rightPane?: ReactNode
  bottomPane?: ReactNode
  children?: ReactNode
  resizable?: boolean
  leftPaneCollapsed?: boolean
  rightPaneCollapsed?: boolean
  bottomPaneCollapsed?: boolean
  leftPaneWidth?: number
  rightPaneWidth?: number
  bottomPaneHeight?: number
  minLeftPaneWidth?: number
  maxLeftPaneWidth?: number
  minRightPaneWidth?: number
  maxRightPaneWidth?: number
  minBottomPaneHeight?: number
  maxBottomPaneHeight?: number
  leftPaneClassName?: string
  mainPaneClassName?: string
  rightPaneClassName?: string
  bottomPaneClassName?: string
  /** Mobile Sheet label for the left pane trigger */
  leftPaneLabel?: string
  /** Mobile Sheet label for the right pane trigger */
  rightPaneLabel?: string
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function ResizeHandle({
  axis,
  onPointerDown,
  className,
}: {
  axis: ResizeAxis
  onPointerDown: React.PointerEventHandler<HTMLDivElement>
  className?: string
}) {
  return (
    <div
      role="separator"
      aria-orientation={axis === 'x' ? 'vertical' : 'horizontal'}
      className={cn(
        'group/resize relative z-10 shrink-0 touch-none bg-transparent',
        axis === 'x' ? '-mx-1 w-2 cursor-col-resize' : '-my-1 h-2 cursor-row-resize',
        className,
      )}
      onPointerDown={onPointerDown}
    >
      <div
        className={cn(
          'absolute bg-border transition-colors group-hover/resize:bg-muted-foreground/40',
          axis === 'x'
            ? 'left-1/2 top-0 h-full w-px -translate-x-1/2'
            : 'left-0 top-1/2 h-px w-full -translate-y-1/2',
        )}
      />
      <div
        className={cn(
          'absolute rounded-full bg-muted-foreground/35 opacity-0 transition-opacity group-hover/resize:opacity-100',
          axis === 'x'
            ? 'left-1/2 top-1/2 h-10 w-1 -translate-x-1/2 -translate-y-1/2'
            : 'left-1/2 top-1/2 h-1 w-10 -translate-x-1/2 -translate-y-1/2',
        )}
      />
    </div>
  )
}

export function WorkbenchBodyTemplate({
  theme,
  className,
  contentClassName,
  title,
  description,
  topBar,
  headerRight,
  toolbar,
  actions,
  leftPane,
  mainPane,
  rightPane,
  bottomPane,
  children,
  resizable = true,
  leftPaneCollapsed,
  rightPaneCollapsed,
  bottomPaneCollapsed,
  leftPaneWidth = 260,
  rightPaneWidth = 320,
  bottomPaneHeight = 240,
  minLeftPaneWidth = 180,
  maxLeftPaneWidth = 440,
  minRightPaneWidth = 240,
  maxRightPaneWidth = 520,
  minBottomPaneHeight = 120,
  maxBottomPaneHeight = 420,
  leftPaneClassName,
  mainPaneClassName,
  rightPaneClassName,
  bottomPaneClassName,
  leftPaneLabel = 'Panel',
  rightPaneLabel = 'Inspector',
}: WorkbenchBodyTemplateProps) {
  const [leftWidth, setLeftWidth] = useState(leftPaneWidth)
  const [rightWidth, setRightWidth] = useState(rightPaneWidth)
  const [bottomHeight, setBottomHeight] = useState(bottomPaneHeight)

  const startResize = useCallback((
    event: React.PointerEvent,
    axis: ResizeAxis,
    applyDelta: (delta: number) => void,
  ) => {
    if (!resizable) return

    const start = axis === 'x' ? event.clientX : event.clientY
    event.currentTarget.setPointerCapture(event.pointerId)

    const previousCursor = document.body.style.cursor
    const previousUserSelect = document.body.style.userSelect
    document.body.style.cursor = axis === 'x' ? 'col-resize' : 'row-resize'
    document.body.style.userSelect = 'none'

    const onPointerMove = (moveEvent: PointerEvent) => {
      applyDelta((axis === 'x' ? moveEvent.clientX : moveEvent.clientY) - start)
    }

    const onPointerUp = () => {
      document.body.style.cursor = previousCursor
      document.body.style.userSelect = previousUserSelect
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp, { once: true })
  }, [resizable])

  const headerRightContent = headerRight ?? toolbar
  const showHeader = title || description || headerRightContent || actions
  const showLeftPane = leftPane && !leftPaneCollapsed
  const showRightPane = rightPane && !rightPaneCollapsed
  const showBottomPane = bottomPane && !bottomPaneCollapsed

  return (
    <DataPage className={cn('layout-workbench', className)} style={theme}>
      {topBar && <div className="shrink-0">{topBar}</div>}
      {showHeader && (
        <header className="shrink-0 border-b px-(--designkit-page-padding-x) py-[calc(var(--designkit-page-padding-y)*0.75)]">
          <div className="flex min-h-[var(--designkit-toolbar-height)] items-center justify-between gap-3">
            <div className="min-w-0">
              {title && <h1 className="truncate text-sm font-semibold">{title}</h1>}
              {description && <p className="mt-0.5 truncate text-xs text-muted-foreground">{description}</p>}
            </div>
            {(headerRightContent || actions) && (
              <div className="flex shrink-0 items-center gap-2">
                {headerRightContent}
                {actions}
              </div>
            )}
          </div>
        </header>
      )}
      {(showLeftPane || showRightPane) && (
        <div className="flex shrink-0 items-center gap-1.5 border-b px-2 py-1.5 md:hidden">
          {showLeftPane && (
            <Sheet>
              <SheetTrigger render={<Button variant="outline" size="sm" />}>
                {leftPaneLabel}
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col gap-0 p-0">
                <SheetHeader className="shrink-0 border-b px-4 py-3">
                  <SheetTitle>{leftPaneLabel}</SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex-1">{leftPane}</ScrollArea>
              </SheetContent>
            </Sheet>
          )}
          {showRightPane && (
            <Sheet>
              <SheetTrigger render={<Button variant="outline" size="sm" />}>
                {rightPaneLabel}
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col gap-0 p-0">
                <SheetHeader className="shrink-0 border-b px-4 py-3">
                  <SheetTitle>{rightPaneLabel}</SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex-1">{rightPane}</ScrollArea>
              </SheetContent>
            </Sheet>
          )}
        </div>
      )}
      <div className={cn('flex min-h-0 flex-1 overflow-hidden', contentClassName)}>
        {showLeftPane && (
          <>
            <aside
              className={cn('hidden min-h-0 shrink-0 overflow-hidden border-r bg-card/45 md:flex md:flex-col', leftPaneClassName)}
              style={{ width: leftWidth }}
            >
              {leftPane}
            </aside>
            {resizable && (
              <ResizeHandle
                axis="x"
                className="hidden md:flex"
                onPointerDown={(event) => {
                  const start = leftWidth
                  startResize(event, 'x', (delta) => {
                    setLeftWidth(clamp(start + delta, minLeftPaneWidth, maxLeftPaneWidth))
                  })
                }}
              />
            )}
          </>
        )}
        <main className={cn('flex min-w-0 flex-1 flex-col overflow-hidden', mainPaneClassName)}>
          <div className="min-h-0 flex-1 overflow-hidden">
            {mainPane ?? children}
          </div>
          {showBottomPane && (
            <>
              {resizable && (
                <ResizeHandle
                  axis="y"
                  className="hidden md:flex"
                  onPointerDown={(event) => {
                    const start = bottomHeight
                    startResize(event, 'y', (delta) => {
                      setBottomHeight(clamp(start - delta, minBottomPaneHeight, maxBottomPaneHeight))
                    })
                  }}
                />
              )}
              <section
                className={cn('min-h-0 shrink-0 overflow-auto border-t bg-card/40 md:overflow-hidden', bottomPaneClassName)}
                style={{ height: bottomHeight }}
              >
                {bottomPane}
              </section>
            </>
          )}
        </main>
        {showRightPane && (
          <>
            {resizable && (
              <ResizeHandle
                axis="x"
                className="hidden md:flex"
                onPointerDown={(event) => {
                  const start = rightWidth
                  startResize(event, 'x', (delta) => {
                    setRightWidth(clamp(start - delta, minRightPaneWidth, maxRightPaneWidth))
                  })
                }}
              />
            )}
            <aside
              className={cn('hidden min-h-0 shrink-0 overflow-hidden border-l bg-card/45 md:flex md:flex-col', rightPaneClassName)}
              style={{ width: rightWidth }}
            >
              {rightPane}
            </aside>
          </>
        )}
      </div>
    </DataPage>
  )
}
