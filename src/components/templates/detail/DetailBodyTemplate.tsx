import React, { Children, Fragment, useMemo, useState } from 'react'
import { DataPage } from '@/components/templates/datapage/DataPage'
import { cn } from '@/lib/utils'

export interface DetailBodyTemplateProps {
  theme?: React.CSSProperties
  className?: string
  topBar?: React.ReactNode
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
  theme,
  className,
  topBar,
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

  return (
    <DataPage className={cn('layout-detail', className)} style={theme}>
      {topBar && <div className="shrink-0">{topBar}</div>}

      {(eyebrow || title || description || status || actions) && (
        <DataPage.Header>
          <div className="min-w-0">
            {eyebrow && (
              <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {eyebrow}
              </div>
            )}
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {title && <h1 className="min-w-0 truncate text-lg font-semibold">{title}</h1>}
              {status && <div className="shrink-0">{status}</div>}
            </div>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
          <DataPage.Actions>{actions}</DataPage.Actions>
        </DataPage.Header>
      )}

      <DataPage.Content padding="none" className="overflow-hidden">
        <div
          className={cn(
            'grid h-full min-h-0 grid-cols-1 overflow-hidden',
            aside && 'lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]',
          )}
        >
          <main className={cn('min-h-0 overflow-auto px-(--dk-page-padding-x) py-(--dk-page-padding-y)', contentClassName)}>
            {(media || summary) && (
              <div className="mb-(--dk-panel-gap) grid gap-(--dk-panel-gap) xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
                {media && (
                  <div className={cn('min-h-0 overflow-hidden rounded-(--radius) border bg-card', mediaClassName)}>
                    {media}
                  </div>
                )}
                {summary && (
                  <div className="min-h-0 rounded-(--radius) border bg-card p-(--dk-panel-gap) text-card-foreground">
                    {summary}
                  </div>
                )}
              </div>
            )}

            {hasTabs ? (
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
            )}
          </main>

          {aside && (
            <aside className={cn('min-h-0 border-t bg-background lg:border-l lg:border-t-0', asideClassName)}>
              <div className={cn('px-(--dk-page-padding-x) py-(--dk-page-padding-y)', stickyAside && 'lg:sticky lg:top-0')}>
                {aside}
              </div>
            </aside>
          )}
        </div>
      </DataPage.Content>
    </DataPage>
  )
}

export const DetailBodyTemplate = Object.assign(DetailBodyTemplateRoot, {
  Tab: DetailBodyTab,
  Section: DetailBodySection,
})
