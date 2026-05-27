import React, { Children, Fragment, useMemo, useState } from 'react'
import { DataPage } from '@/components/templates/datapage/DataPage'
import { cn } from '@/lib/utils'

export type DetailBodyVariant = 'media' | 'record' | 'full'

export interface DetailBodyTemplateProps {
  variant?: DetailBodyVariant
  theme?: React.CSSProperties
  className?: string
  topBar?: React.ReactNode
  header?: React.ReactNode
  lead?: React.ReactNode
  eyebrow?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  status?: React.ReactNode
  actions?: React.ReactNode
  media?: React.ReactNode
  aside?: React.ReactNode
  summary?: React.ReactNode
  stickyAside?: boolean
  contentClassName?: string
  mediaClassName?: string
  asideClassName?: string
  children?: React.ReactNode
}

export interface DetailBodyHeaderProps {
  eyebrow?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  status?: React.ReactNode
  actions?: React.ReactNode
  compact?: boolean
  className?: string
}

function DetailBodyHeader({
  eyebrow,
  title,
  description,
  status,
  actions,
  compact,
  className,
}: DetailBodyHeaderProps) {
  return (
    <DataPage.Header className={className}>
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </div>
        )}
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {title && (
            <h1 className={cn('min-w-0 truncate font-semibold', compact ? 'text-base' : 'text-lg')}>
              {title}
            </h1>
          )}
          {status && <div className="shrink-0">{status}</div>}
        </div>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <DataPage.Actions>{actions}</DataPage.Actions>
    </DataPage.Header>
  )
}

export interface DetailBodyTabProps {
  id: string
  label: React.ReactNode
  count?: number
  disabled?: boolean
  children?: React.ReactNode
}

function DetailBodyTab(_props: DetailBodyTabProps) {
  return null
}

function isDetailBodyTab(node: React.ReactNode): node is React.ReactElement<DetailBodyTabProps> {
  return Boolean(node && typeof node === 'object' && 'type' in node && node.type === DetailBodyTab)
}

export interface DetailBodySectionProps {
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  surface?: 'plain' | 'card' | 'bordered'
  className?: string
  children?: React.ReactNode
}

function DetailBodySection({
  title,
  description,
  actions,
  surface = 'plain',
  className,
  children,
}: DetailBodySectionProps) {
  return (
    <section
      className={cn(
        'min-h-0',
        surface === 'card' && 'rounded-(--radius) border bg-card p-(--dk-panel-gap) text-card-foreground shadow-sm',
        surface === 'bordered' && 'rounded-(--radius) border p-(--dk-panel-gap)',
        className,
      )}
    >
      {(title || description || actions) && (
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-semibold">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

function renderChildren(nodes: React.ReactNode) {
  return Children.toArray(nodes).map((child, i) => (
    <Fragment key={i}>{child}</Fragment>
  ))
}

function DetailBodyTemplateRoot({
  variant = 'record',
  theme,
  className,
  topBar,
  header,
  lead,
  eyebrow,
  title,
  description,
  status,
  actions,
  media,
  aside,
  summary,
  stickyAside = true,
  contentClassName,
  mediaClassName,
  asideClassName,
  children,
}: DetailBodyTemplateProps) {
  const childArray = useMemo(() => Children.toArray(children), [children])
  const tabs = childArray.filter(isDetailBodyTab)
  const hasTabs = tabs.length > 0
  const [activeTab, setActiveTab] = useState(() => tabs[0]?.props.id ?? '')
  const selectedTab = tabs.find((tab) => tab.props.id === activeTab) ?? tabs[0]
  const summarySlot = summary ? (
    <div className="min-h-0 rounded-(--radius) border bg-card p-(--dk-panel-gap) text-card-foreground">
      {summary}
    </div>
  ) : null
  const mediaSlot = media ? (
    <div className={cn('min-h-0 overflow-hidden rounded-(--radius) border bg-card', mediaClassName)}>
      {media}
    </div>
  ) : null
  const leadGridClass = variant === 'media'
    ? 'xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]'
    : 'xl:grid-cols-2'
  const defaultHeader = (eyebrow || title || description || status || actions)
    ? (
      <DetailBodyHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        status={status}
        actions={actions}
      />
    )
    : null
  const defaultLead = (media || summary)
    ? (
      <div className={cn('grid gap-(--dk-panel-gap)', leadGridClass)}>
        {mediaSlot}
        {summarySlot}
      </div>
    )
    : null
  const body = hasTabs ? (
    <div className="min-h-0">
      <DataPage.Tabs>
        {tabs.map((tab) => (
          <DataPage.Tab
            key={tab.props.id}
            active={(selectedTab?.props.id ?? '') === tab.props.id}
            count={tab.props.count}
            disabled={tab.props.disabled}
            onClick={() => setActiveTab(tab.props.id)}
          >
            {tab.props.label}
          </DataPage.Tab>
        ))}
      </DataPage.Tabs>
      <div className="pt-(--dk-panel-gap)">
        {selectedTab?.props.children}
      </div>
    </div>
  ) : (
    <div className="space-y-(--dk-panel-gap)">
      {renderChildren(children)}
    </div>
  )
  const leadSlot = lead ?? defaultLead
  const outsideAsideSlot = variant === 'full' ? null : aside
  const insideAsideSlot = variant === 'full' ? aside : null
  const hasRecordInspector = Boolean(leadSlot)
  const hasFullLeadArea = Boolean(leadSlot || insideAsideSlot)

  const layout = {
    media: (
      <>
        {leadSlot && <div className="mb-(--dk-panel-gap)">{leadSlot}</div>}
        {body}
      </>
    ),
    record: (
      <div
        className={cn(
          'grid gap-(--dk-panel-gap)',
          hasRecordInspector && 'xl:grid-cols-[minmax(28rem,1fr)_minmax(14rem,18rem)]',
        )}
      >
        <div className="min-w-0">{body}</div>
        {hasRecordInspector && (
          <div className="space-y-(--dk-panel-gap)">
            {leadSlot}
          </div>
        )}
      </div>
    ),
    full: (
      <>
        {hasFullLeadArea && (
          <div
            className={cn(
              'mb-(--dk-panel-gap) grid gap-(--dk-panel-gap)',
              insideAsideSlot && 'xl:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]',
            )}
          >
            {leadSlot && <div className="space-y-(--dk-panel-gap)">{leadSlot}</div>}
            {insideAsideSlot && (
              <div className={cn('min-h-0 rounded-(--radius) border bg-card p-(--dk-panel-gap)', asideClassName)}>
                {insideAsideSlot}
              </div>
            )}
          </div>
        )}
        {body}
      </>
    ),
  } satisfies Record<DetailBodyVariant, React.ReactNode>

  return (
    <DataPage className={cn('layout-detail', className)} style={theme} data-detail-variant={variant}>
      {topBar && <div className="shrink-0">{topBar}</div>}
      {header ?? defaultHeader}

      <DataPage.Content padding="none" className="overflow-hidden">
        <div
          className={cn(
            'grid h-full min-h-0 grid-cols-1 overflow-hidden',
            outsideAsideSlot && 'lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]',
          )}
        >
          <main
            className={cn(
              'min-h-0 overflow-auto px-(--dk-page-padding-x) py-(--dk-page-padding-y)',
              contentClassName,
            )}
          >
            {layout[variant]}
          </main>

          {outsideAsideSlot && (
            <aside className={cn('min-h-0 border-t bg-background lg:border-l lg:border-t-0', asideClassName)}>
              <div
                className={cn(
                  'px-(--dk-page-padding-x) py-(--dk-page-padding-y)',
                  stickyAside && 'lg:sticky lg:top-0',
                )}
              >
                {outsideAsideSlot}
              </div>
            </aside>
          )}
        </div>
      </DataPage.Content>
    </DataPage>
  )
}

export const DetailBodyTemplate = Object.assign(DetailBodyTemplateRoot, {
  Header: DetailBodyHeader,
  Tab: DetailBodyTab,
  Section: DetailBodySection,
})
