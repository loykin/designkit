import { type ReactNode, type CSSProperties, forwardRef } from 'react'
import { GripHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DataPage } from '../datapage/DataPage'

// ─── Panel ────────────────────────────────────────────────────────────────────

export interface DashboardPanelProps {
  title?: string
  description?: string
  loading?: boolean
  error?: string | null
  transparent?: boolean
  /** Edit mode — shows drag handle and grab cursor on the header */
  editable?: boolean
  className?: string
  style?: CSSProperties
  children?: ReactNode
  headerRight?: ReactNode
}

export const DashboardPanel = forwardRef<HTMLDivElement, DashboardPanelProps>(function DashboardPanel({
  title,
  description,
  loading,
  error,
  transparent,
  editable,
  className,
  style,
  children,
  headerRight,
}, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'group flex h-full flex-col overflow-hidden',
        transparent ? '' : 'rounded-(--radius) border bg-card text-card-foreground',
        editable && 'ring-1 ring-border/60 ring-inset',
        className,
      )}
      style={style}
    >
      {(title || headerRight || editable) && (
        <div className="flex shrink-0 items-center gap-2 pl-3 pr-1.5 py-2">
          {editable && (
            <div className="shrink-0 cursor-grab active:cursor-grabbing select-none text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors -ml-1 px-0.5">
              <GripHorizontal className="h-3.5 w-3.5" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            {title && (
              <p className="truncate text-xs font-medium text-card-foreground">{title}</p>
            )}
            {description && (
              <p className="truncate text-[11px] text-muted-foreground">{description}</p>
            )}
          </div>
          {headerRight && (
            <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              {headerRight}
            </div>
          )}
        </div>
      )}

      <div className="relative flex-1 min-h-0 p-3">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/70 z-10">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
        {error && (
          <div className="flex h-full items-center justify-center">
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}
        {!error && children}
      </div>
    </div>
  )
})

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface DashboardBodyTemplateProps {
  theme?: CSSProperties
  className?: string
  title?: ReactNode
  description?: ReactNode
  topBar?: ReactNode
  toolbar?: ReactNode
  /** Variable bar — rendered as a separate strip between the header and content */
  variableBar?: ReactNode
  children?: ReactNode
  contentClassName?: string
}

export function DashboardBodyTemplate({
  theme,
  className,
  title,
  description,
  topBar,
  toolbar,
  variableBar,
  children,
  contentClassName,
}: DashboardBodyTemplateProps) {
  return (
    <DataPage className={cn('layout-dashboard', className)} style={theme}>
      {topBar && <div className="shrink-0">{topBar}</div>}
      {(title || toolbar) && (
        <header className="shrink-0 border-b px-(--designkit-page-padding-x) py-(--designkit-page-padding-y)">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              {title && (
                <h1 className="text-sm font-semibold truncate">{title}</h1>
              )}
              {description && (
                <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
              )}
            </div>
            {toolbar && (
              <div className="flex items-center gap-2 shrink-0">{toolbar}</div>
            )}
          </div>
        </header>
      )}
      {variableBar && (
        <div className="shrink-0 flex flex-wrap items-center gap-2 px-(--designkit-page-padding-x) py-1.5">
          {variableBar}
        </div>
      )}
      <div className={cn('flex-1 min-h-0 overflow-auto px-[calc(var(--designkit-page-padding-x)-0.5rem)] pt-0 pb-(--designkit-page-padding-y)', contentClassName)}>
        {children}
      </div>
    </DataPage>
  )
}
