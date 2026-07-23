import React, { type CSSProperties, type ReactNode, useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { DataPage } from '../datapage/DataPage'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

type ResizeAxis = 'x' | 'y'

export interface WorkbenchResizeState {
  leftPaneWidth: number
  rightPaneWidth: number
  bottomPaneHeight: number
}

export interface WorkbenchBodyTemplateProps {
  theme?: CSSProperties
  className?: string
  contentClassName?: string
  title?: ReactNode
  description?: ReactNode
  status?: ReactNode
  topBar?: ReactNode
  /** Right side of the built-in workbench header. */
  headerRight?: ReactNode
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
  onResize?: (state: WorkbenchResizeState) => void
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
  label,
  min,
  max,
  value,
  onPointerDown,
  onKeyDown,
  className,
}: {
  axis: ResizeAxis
  label: string
  min: number
  max: number
  value: number
  onPointerDown: React.PointerEventHandler<HTMLDivElement>
  onKeyDown: React.KeyboardEventHandler<HTMLDivElement>
  className?: string
}) {
  return (
    <div
      role="separator"
      tabIndex={0}
      aria-label={label}
      aria-orientation={axis === 'x' ? 'vertical' : 'horizontal'}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn(
        'group/resize relative z-10 shrink-0 touch-none bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        axis === 'x' ? '-mx-1 w-2 cursor-col-resize' : '-my-1 h-2 cursor-row-resize',
        className,
      )}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
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
  status,
  topBar,
  headerRight,
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
  onResize,
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

  useEffect(() => {
    setLeftWidth(leftPaneWidth)
  }, [leftPaneWidth])

  useEffect(() => {
    setRightWidth(rightPaneWidth)
  }, [rightPaneWidth])

  useEffect(() => {
    setBottomHeight(bottomPaneHeight)
  }, [bottomPaneHeight])

  const updateResizeState = useCallback(
    (patch: Partial<WorkbenchResizeState>) => {
      const next = {
        leftPaneWidth: leftWidth,
        rightPaneWidth: rightWidth,
        bottomPaneHeight: bottomHeight,
        ...patch,
      }

      if (patch.leftPaneWidth !== undefined) setLeftWidth(patch.leftPaneWidth)
      if (patch.rightPaneWidth !== undefined) setRightWidth(patch.rightPaneWidth)
      if (patch.bottomPaneHeight !== undefined) setBottomHeight(patch.bottomPaneHeight)

      onResize?.(next)
    },
    [bottomHeight, leftWidth, onResize, rightWidth],
  )

  const updateLeftWidth = useCallback(
    (next: number) => {
      updateResizeState({
        leftPaneWidth: clamp(next, minLeftPaneWidth, maxLeftPaneWidth),
      })
    },
    [maxLeftPaneWidth, minLeftPaneWidth, updateResizeState],
  )

  const updateRightWidth = useCallback(
    (next: number) => {
      updateResizeState({
        rightPaneWidth: clamp(next, minRightPaneWidth, maxRightPaneWidth),
      })
    },
    [maxRightPaneWidth, minRightPaneWidth, updateResizeState],
  )

  const updateBottomHeight = useCallback(
    (next: number) => {
      updateResizeState({
        bottomPaneHeight: clamp(next, minBottomPaneHeight, maxBottomPaneHeight),
      })
    },
    [maxBottomPaneHeight, minBottomPaneHeight, updateResizeState],
  )

  const handleResizeKey = useCallback(
    (
      event: React.KeyboardEvent,
      options: {
        value: number
        min: number
        max: number
        decreaseKeys: string[]
        increaseKeys: string[]
        update: (next: number) => void
      },
    ) => {
      const step = event.shiftKey ? 48 : 12
      if (options.decreaseKeys.includes(event.key)) {
        event.preventDefault()
        options.update(options.value - step)
        return
      }
      if (options.increaseKeys.includes(event.key)) {
        event.preventDefault()
        options.update(options.value + step)
        return
      }
      if (event.key === 'Home') {
        event.preventDefault()
        options.update(options.min)
        return
      }
      if (event.key === 'End') {
        event.preventDefault()
        options.update(options.max)
      }
    },
    [],
  )

  const startResize = useCallback(
    (event: React.PointerEvent, axis: ResizeAxis, applyDelta: (delta: number) => void) => {
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
    },
    [resizable],
  )

  const showHeader = title || description || status || headerRight || actions
  const showLeftPane = leftPane && !leftPaneCollapsed
  const showRightPane = rightPane && !rightPaneCollapsed
  const showBottomPane = bottomPane && !bottomPaneCollapsed

  return (
    <DataPage className={cn('layout-workbench', className)} style={theme}>
      {topBar && <div className="shrink-0">{topBar}</div>}
      {showHeader && (
        <header className="shrink-0 border-b border-border px-(--designkit-page-padding-x) py-[calc(var(--designkit-page-padding-y)*0.75)]">
          <div className="flex min-h-[var(--designkit-toolbar-height)] items-center justify-between gap-3">
            <div className="min-w-0">
              {(title || status) && (
                <div className="flex min-w-0 items-center gap-2">
                  {title && <h1 className="min-w-0 truncate text-sm font-semibold">{title}</h1>}
                  {status && <span className="shrink-0">{status}</span>}
                </div>
              )}
              {description && (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{description}</p>
              )}
            </div>
            {(headerRight || actions) && (
              <div className="flex shrink-0 items-center gap-2">
                {headerRight}
                {actions}
              </div>
            )}
          </div>
        </header>
      )}
      {(showLeftPane || showRightPane) && (
        <div className="flex shrink-0 items-center gap-1.5 border-b border-border px-2 py-1.5 md:hidden">
          {showLeftPane && (
            <Sheet>
              <SheetTrigger render={<Button variant="outline" size="sm" />}>
                {leftPaneLabel}
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col gap-0 p-0">
                <SheetHeader className="shrink-0 border-b border-border px-4 py-3">
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
                <SheetHeader className="shrink-0 border-b border-border px-4 py-3">
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
              className={cn(
                'hidden min-h-0 shrink-0 overflow-hidden border-r border-border bg-card/45 md:flex md:flex-col',
                leftPaneClassName,
              )}
              style={{ width: leftWidth }}
            >
              {leftPane}
            </aside>
            {resizable && (
              <ResizeHandle
                axis="x"
                label="Resize left pane"
                min={minLeftPaneWidth}
                max={maxLeftPaneWidth}
                value={leftWidth}
                className="hidden md:flex"
                onPointerDown={(event) => {
                  const start = leftWidth
                  startResize(event, 'x', (delta) => {
                    updateLeftWidth(start + delta)
                  })
                }}
                onKeyDown={(event) =>
                  handleResizeKey(event, {
                    value: leftWidth,
                    min: minLeftPaneWidth,
                    max: maxLeftPaneWidth,
                    decreaseKeys: ['ArrowLeft'],
                    increaseKeys: ['ArrowRight'],
                    update: updateLeftWidth,
                  })
                }
              />
            )}
          </>
        )}
        <main className={cn('flex min-w-0 flex-1 flex-col overflow-hidden', mainPaneClassName)}>
          <div className="min-h-0 flex-1 overflow-auto">{mainPane ?? children}</div>
          {showBottomPane && (
            <>
              {resizable && (
                <ResizeHandle
                  axis="y"
                  label="Resize bottom pane"
                  min={minBottomPaneHeight}
                  max={maxBottomPaneHeight}
                  value={bottomHeight}
                  className="hidden md:flex"
                  onPointerDown={(event) => {
                    const start = bottomHeight
                    startResize(event, 'y', (delta) => {
                      updateBottomHeight(start - delta)
                    })
                  }}
                  onKeyDown={(event) =>
                    handleResizeKey(event, {
                      value: bottomHeight,
                      min: minBottomPaneHeight,
                      max: maxBottomPaneHeight,
                      decreaseKeys: ['ArrowDown'],
                      increaseKeys: ['ArrowUp'],
                      update: updateBottomHeight,
                    })
                  }
                />
              )}
              <section
                className={cn(
                  'min-h-0 shrink-0 overflow-auto border-t border-border bg-card/40 md:overflow-hidden',
                  bottomPaneClassName,
                )}
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
                label="Resize right pane"
                min={minRightPaneWidth}
                max={maxRightPaneWidth}
                value={rightWidth}
                className="hidden md:flex"
                onPointerDown={(event) => {
                  const start = rightWidth
                  startResize(event, 'x', (delta) => {
                    updateRightWidth(start - delta)
                  })
                }}
                onKeyDown={(event) =>
                  handleResizeKey(event, {
                    value: rightWidth,
                    min: minRightPaneWidth,
                    max: maxRightPaneWidth,
                    decreaseKeys: ['ArrowRight'],
                    increaseKeys: ['ArrowLeft'],
                    update: updateRightWidth,
                  })
                }
              />
            )}
            <aside
              className={cn(
                'hidden min-h-0 shrink-0 overflow-hidden border-l border-border bg-card/45 md:flex md:flex-col',
                rightPaneClassName,
              )}
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
