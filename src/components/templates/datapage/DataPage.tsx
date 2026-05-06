import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface DataPageProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export interface DataPageHeaderProps {
  children?: React.ReactNode
  className?: string
}

export interface DataPageTitleBlockProps {
  title?: React.ReactNode
  description?: React.ReactNode
  breadcrumb?: React.ReactNode
  className?: string
}

export interface DataPageActionsProps {
  children?: React.ReactNode
  className?: string
}

export interface DataPageTabsProps {
  children?: React.ReactNode
  className?: string
}

export interface DataPageTabProps {
  active?: boolean
  count?: number
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export interface DataPageContentProps {
  children?: React.ReactNode
  className?: string
  padding?: 'none' | 'compact' | 'default'
}

export interface DataPageGroupProps {
  children?: React.ReactNode
  className?: string
  surface?: 'none' | 'bordered' | 'card'
}

export interface DataPageGroupHeaderProps {
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export interface DataPageGroupToolbarProps {
  children?: React.ReactNode
  className?: string
}

export interface DataPageGroupBodyProps {
  children?: React.ReactNode
  className?: string
}

export interface DataPageFooterProps {
  children?: React.ReactNode
  className?: string
}

function Root({ children, className, style }: DataPageProps) {
  return (
    <div
      data-slot="data-page"
      className={cn('designkit-theme h-full min-h-0 flex flex-col bg-background text-foreground', className)}
      style={style}
    >
      {children}
    </div>
  )
}

function Header({ children, className }: DataPageHeaderProps) {
  return (
    <header
      data-slot="data-page-header"
      className={cn('shrink-0 px-6 pb-2 pt-4', className)}
    >
      <div className="flex min-h-8 items-end justify-between gap-4">
        {children}
      </div>
    </header>
  )
}

function TitleBlock({ title, description, breadcrumb, className }: DataPageTitleBlockProps) {
  if (!title && !description && !breadcrumb) return null

  return (
    <div data-slot="data-page-title-block" className={cn('min-w-0 flex-1', className)}>
      {breadcrumb && <div className="mb-1 text-xs text-muted-foreground">{breadcrumb}</div>}
      {title && <h1 className="truncate text-sm font-semibold">{title}</h1>}
      {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}

function Actions({ children, className }: DataPageActionsProps) {
  if (!children) return null

  return (
    <div data-slot="data-page-actions" className={cn('flex shrink-0 items-center gap-2', className)}>
      {children}
    </div>
  )
}

function Tabs({ children, className }: DataPageTabsProps) {
  if (!children) return null

  return (
    <div data-slot="data-page-tabs" className={cn('shrink-0 border-b px-6', className)}>
      <div className="flex items-center gap-0 overflow-x-auto">
        {children}
      </div>
    </div>
  )
}

function Tab({ active, count, children, onClick, disabled, className }: DataPageTabProps) {
  return (
    <button
      type="button"
      data-slot="data-page-tab"
      data-active={active ? 'true' : 'false'}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex h-10 shrink-0 items-center gap-1.5 border-b-2 px-3 text-xs font-medium transition-colors',
        active
          ? 'border-primary text-foreground'
          : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      <span>{children}</span>
      {count !== undefined && (
        <Badge variant="secondary" className="h-4 px-1.5 py-0 text-[10px]">
          {count}
        </Badge>
      )}
    </button>
  )
}

function Content({ children, className, padding = 'default' }: DataPageContentProps) {
  return (
    <div
      data-slot="data-page-content"
      className={cn(
        'min-h-0 flex-1 overflow-auto',
        padding === 'default' && 'p-6',
        padding === 'compact' && 'p-4',
        padding === 'none' && 'p-0',
        className,
      )}
    >
      {children}
    </div>
  )
}

function Group({ children, className, surface = 'none' }: DataPageGroupProps) {
  return (
    <section
      data-slot="data-page-group"
      data-surface={surface}
      className={cn(
        'min-h-0',
        surface === 'bordered' && 'overflow-hidden rounded-[--radius] border bg-background',
        surface === 'card' && 'overflow-hidden rounded-[--radius] border bg-card text-card-foreground shadow-sm',
        className,
      )}
    >
      {children}
    </section>
  )
}

function GroupHeader({
  title,
  description,
  actions,
  children,
  className,
}: DataPageGroupHeaderProps) {
  if (!title && !description && !actions && !children) return null

  return (
    <div
      data-slot="data-page-group-header"
      className={cn('flex items-start justify-between gap-4 px-0 pb-3', className)}
    >
      <div className="min-w-0">
        {title && <h2 className="text-sm font-medium">{title}</h2>}
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        {children}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}

function GroupToolbar({ children, className }: DataPageGroupToolbarProps) {
  if (!children) return null

  return (
    <div
      data-slot="data-page-group-toolbar"
      className={cn('flex items-center justify-between gap-3 pb-3', className)}
    >
      {children}
    </div>
  )
}

function GroupBody({ children, className }: DataPageGroupBodyProps) {
  return (
    <div data-slot="data-page-group-body" className={cn('min-h-0', className)}>
      {children}
    </div>
  )
}

function Footer({ children, className }: DataPageFooterProps) {
  if (!children) return null

  return (
    <footer data-slot="data-page-footer" className={cn('shrink-0 border-t px-6 py-3', className)}>
      {children}
    </footer>
  )
}

export const DataPage = Object.assign(Root, {
  Header,
  TitleBlock,
  Actions,
  Tabs,
  Tab,
  Content,
  Group,
  GroupHeader,
  GroupToolbar,
  GroupBody,
  Footer,
})
