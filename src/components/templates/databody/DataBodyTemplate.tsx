import { Children, Fragment, useMemo, useState } from 'react'
import { DataPage } from '@/components/templates/datapage/DataPage'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// ─── Tab ──────────────────────────────────────────────────────────────────────

export interface DataBodyTabProps {
  id: string
  label: React.ReactNode
  count?: number
  disabled?: boolean
  children: React.ReactNode
}

function DataBodyTab(_props: DataBodyTabProps) { return null }

function isDataBodyTab(node: React.ReactNode): node is React.ReactElement<DataBodyTabProps> {
  return Boolean(node && typeof node === 'object' && 'type' in node && node.type === DataBodyTab)
}

// ─── Section ──────────────────────────────────────────────────────────────────

export interface DataBodySectionProps {
  id: string
  label: React.ReactNode
  description?: React.ReactNode
  disabled?: boolean
  children?: React.ReactNode
}

function DataBodySection(_props: DataBodySectionProps) { return null }

function isDataBodySection(node: React.ReactNode): node is React.ReactElement<DataBodySectionProps> {
  return Boolean(node && typeof node === 'object' && 'type' in node && node.type === DataBodySection)
}

// ─── Summary ──────────────────────────────────────────────────────────────────

export interface DataBodySummaryProps {
  children?: React.ReactNode
}

function DataBodySummary(_props: DataBodySummaryProps) { return null }

function isDataBodySummary(node: React.ReactNode): node is React.ReactElement<DataBodySummaryProps> {
  return Boolean(node && typeof node === 'object' && 'type' in node && node.type === DataBodySummary)
}

// ─── Group ────────────────────────────────────────────────────────────────────

export type GroupLayout  = 'stacked' | 'horizontal' | 'inline' | 'split'
export type GroupVariant = 'card' | 'plain' | 'bordered'

const layoutDefaultVariant: Record<GroupLayout, GroupVariant> = {
  stacked:    'plain',
  horizontal: 'card',
  inline:     'bordered',
  split:      'bordered',
}

export interface DataBodyGroupProps {
  layout?: GroupLayout
  variant?: GroupVariant
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  danger?: boolean
  children?: React.ReactNode
}

function DataBodyGroup(props: DataBodyGroupProps) {
  return renderGroupProps(props)
}

function isDataBodyGroup(node: React.ReactNode): node is React.ReactElement<DataBodyGroupProps> {
  return Boolean(node && typeof node === 'object' && 'type' in node && node.type === DataBodyGroup)
}

function GroupWrapper({ layout, variant, children }: {
  layout: GroupLayout
  variant: GroupVariant
  children: React.ReactNode
}) {
  if (variant === 'card') {
    return <Card><CardContent className="p-[var(--dk-panel-gap)]">{children}</CardContent></Card>
  }
  if (variant === 'bordered') {
    if (layout === 'inline') {
      return <div className="overflow-hidden rounded-[var(--radius)] border divide-y">{children}</div>
    }
    return <div className="rounded-[var(--radius)] border p-[var(--dk-panel-gap)]">{children}</div>
  }
  return <>{children}</>
}

function renderGroups(nodes: React.ReactNode): React.ReactNode {
  const childArray = Children.toArray(nodes)
  if (!childArray.some(isDataBodyGroup)) return nodes
  return (
    <>
      {childArray.map((child, i) => (
        <Fragment key={i}>
          {isDataBodyGroup(child) ? renderGroup(child) : child}
        </Fragment>
      ))}
    </>
  )
}

function renderGroup(group: React.ReactElement<DataBodyGroupProps>) {
  return renderGroupProps(group.props)
}

function renderGroupProps(props: DataBodyGroupProps) {
  const { layout = 'stacked', variant: variantProp, title, description, actions, danger, children } = props
  const variant = variantProp ?? layoutDefaultVariant[layout]

  if (layout === 'split') {
    const panes = Children.toArray(children)
    return (
      <div className="py-[var(--dk-panel-gap)]">
        {(title || description || actions) && (
          <div className="mb-3 flex items-start justify-between">
            <div>
              {title && <h2 className={cn('text-sm font-semibold', danger && 'text-destructive')}>{title}</h2>}
              {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
            </div>
            {actions && <div>{actions}</div>}
          </div>
        )}
        <div className="grid min-h-[26rem] gap-[var(--dk-panel-gap)] lg:grid-cols-[20rem_minmax(0,1fr)]">
          {panes.map((pane, i) => (
            <GroupWrapper key={i} layout={layout} variant={variant}>{pane}</GroupWrapper>
          ))}
        </div>
      </div>
    )
  }

  if (layout === 'horizontal') {
    return (
      <div className="grid grid-cols-3 gap-[calc(var(--dk-panel-gap)*2)] py-[var(--dk-panel-gap)]">
        <div>
          <p className={cn('text-sm font-medium', danger && 'text-destructive')}>{title}</p>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
          {actions && <div className="mt-2">{actions}</div>}
        </div>
        <div className="col-span-2">
          <GroupWrapper layout={layout} variant={variant}>{children}</GroupWrapper>
        </div>
      </div>
    )
  }

  if (layout === 'inline') {
    return (
      <div className="py-[var(--dk-panel-gap)]">
        {(title || description) && (
          <div className="mb-2 flex items-start justify-between">
            <div>
              {title && <h2 className={cn('text-sm font-semibold', danger && 'text-destructive')}>{title}</h2>}
              {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
            </div>
            {actions && <div>{actions}</div>}
          </div>
        )}
        <GroupWrapper layout={layout} variant={variant}>{children}</GroupWrapper>
      </div>
    )
  }

  // stacked (default)
  return (
    <div className="py-[var(--dk-panel-gap)]">
      <div className="flex items-start justify-between">
        <div>
          <h2 className={cn('text-sm font-semibold', danger && 'text-destructive')}>{title}</h2>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <div className="mt-4">
        <GroupWrapper layout={layout} variant={variant}>{children}</GroupWrapper>
      </div>
    </div>
  )
}

// ─── Field (read-only display) ────────────────────────────────────────────────

export interface DataBodyFieldProps {
  label: string
  description?: string
  children?: React.ReactNode
}

function DataBodyField({ label, description, children }: DataBodyFieldProps) {
  return (
    <div
      className="grid items-start gap-x-4 px-4 py-3"
      style={{ gridTemplateColumns: 'var(--dk-form-label-w, 11rem) 1fr' }}
    >
      <div className="pt-0.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        {description && <p className="mt-0.5 text-xs text-muted-foreground/60">{description}</p>}
      </div>
      <div className="min-w-0 text-sm">{children}</div>
    </div>
  )
}

// ─── Row ──────────────────────────────────────────────────────────────────────

export interface DataBodyRowProps {
  label: string
  description?: string
  required?: boolean
  children?: React.ReactNode
}

function DataBodyRow({ label, description, required, children }: DataBodyRowProps) {
  return (
    <div
      className="grid items-start gap-x-4 px-4 py-3"
      style={{ gridTemplateColumns: 'var(--dk-form-label-w, 11rem) 1fr' }}
    >
      <div className="pt-1">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">{label}</span>
          {required && <span className="text-destructive text-xs leading-none">*</span>}
        </div>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className={cn('min-w-0', !description && 'flex items-center')}>
        {children}
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface DataBodyTemplateProps {
  theme?: React.CSSProperties
  className?: string
  breadcrumb?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  toolbarLeft?: React.ReactNode
  toolbarRight?: React.ReactNode
  activeTab?: string
  defaultTab?: string
  onTabChange?: (id: string) => void
  children?: React.ReactNode
  contentClassName?: string
}

function Root({
  theme,
  className,
  breadcrumb,
  title,
  description,
  actions,
  toolbarLeft,
  toolbarRight,
  activeTab: controlledActive,
  defaultTab,
  onTabChange,
  children,
  contentClassName,
}: DataBodyTemplateProps) {
  const childArray    = useMemo(() => Children.toArray(children), [children])
  const tabs          = childArray.filter(isDataBodyTab)
  const sections      = childArray.filter(isDataBodySection)
  const summaryEl     = childArray.find(isDataBodySummary)
  const bodyChildren  = childArray.filter((c) => !isDataBodyTab(c) && !isDataBodySummary(c) && !isDataBodySection(c))
  const rest          = bodyChildren.filter((c) => !isDataBodyGroup(c))

  const hasTabs     = tabs.length > 0
  const hasSections = sections.length > 0
  const hasGroups   = bodyChildren.some(isDataBodyGroup)

  const navItems = hasSections ? sections : tabs
  const [internalActive, setInternalActive] = useState(defaultTab ?? navItems[0]?.props.id ?? '')
  const activeId   = controlledActive ?? internalActive
  const handleChange = (id: string) => {
    if (controlledActive === undefined) setInternalActive(id)
    onTabChange?.(id)
  }

  // ── Sectioned layout (left nav) ───────────────────────────────────────────
  if (hasSections) {
    const activeSection = sections.find((s) => s.props.id === activeId) ?? sections[0]
    return (
      <DataPage className={cn('layout-sectioned', className)} style={theme}>
        <DataPage.Header>
          <DataPage.TitleBlock breadcrumb={breadcrumb} title={title} description={description} />
          <DataPage.Actions>{actions}</DataPage.Actions>
        </DataPage.Header>

        {summaryEl && (
          <div className="shrink-0 border-b px-[var(--dk-page-padding-x)] py-[var(--dk-panel-gap)]">
            {summaryEl.props.children}
          </div>
        )}

        <DataPage.Content className={contentClassName}>
          <div className="grid gap-[var(--dk-panel-gap)] lg:grid-cols-[16rem_minmax(0,1fr)]">
            <nav className="space-y-1">
              {sections.map((section) => {
                const active = section.props.id === activeSection?.props.id
                return (
                  <button
                    key={section.props.id}
                    type="button"
                    disabled={section.props.disabled}
                    className={cn(
                      'block w-full rounded-[var(--radius)] px-3 py-2 text-left transition-colors',
                      active ? 'bg-accent text-accent-foreground' : 'hover:bg-muted',
                      section.props.disabled && 'pointer-events-none opacity-50',
                    )}
                    onClick={() => handleChange(section.props.id)}
                  >
                    <span className="block text-sm font-medium">{section.props.label}</span>
                    {section.props.description && (
                      <span className="mt-0.5 block text-xs text-muted-foreground">{section.props.description}</span>
                    )}
                  </button>
                )
              })}
            </nav>
            <div className="min-w-0 space-y-[var(--dk-panel-gap)]">
              {renderGroups(activeSection?.props.children)}
            </div>
          </div>
        </DataPage.Content>
      </DataPage>
    )
  }

  // ── Tabbed / plain layout ─────────────────────────────────────────────────
  const activeTabNode = tabs.find((tab) => tab.props.id === activeId) ?? tabs[0]

  return (
    <DataPage className={cn('layout-databody', className)} style={theme}>
      <DataPage.Header>
        <DataPage.TitleBlock breadcrumb={breadcrumb} title={title} description={description} />
        <DataPage.Actions>{actions}</DataPage.Actions>
      </DataPage.Header>

      {summaryEl && (
        <div className="shrink-0 border-b px-(--dk-page-padding-x) py-(--dk-panel-gap)">
          {summaryEl.props.children}
        </div>
      )}

      {hasTabs && (
        <DataPage.Tabs>
          {tabs.map((tab) => (
            <DataPage.Tab
              key={tab.props.id}
              active={tab.props.id === activeTabNode?.props.id}
              count={tab.props.count}
              disabled={tab.props.disabled}
              onClick={() => handleChange(tab.props.id)}
            >
              {tab.props.label}
            </DataPage.Tab>
          ))}
        </DataPage.Tabs>
      )}

      <DataPage.Content className={contentClassName}>
        {(toolbarLeft || toolbarRight) && (
          <DataPage.GroupToolbar>
            <div className="flex min-w-0 items-center gap-2">{toolbarLeft}</div>
            <DataPage.Actions>{toolbarRight}</DataPage.Actions>
          </DataPage.GroupToolbar>
        )}
        {hasTabs ? (
          <DataPage.GroupBody className="min-h-full">
            {renderGroups(activeTabNode?.props.children)}
          </DataPage.GroupBody>
        ) : hasGroups ? (
          <DataPage.GroupBody>
            {bodyChildren.map((child, i) => (
              <Fragment key={i}>
                {isDataBodyGroup(child) ? renderGroup(child) : child}
              </Fragment>
            ))}
          </DataPage.GroupBody>
        ) : (
          <DataPage.GroupBody className="min-h-full">
            <>{rest}</>
          </DataPage.GroupBody>
        )}
      </DataPage.Content>
    </DataPage>
  )
}

export const DataBodyTemplate = Object.assign(Root, {
  Tab:     DataBodyTab,
  Section: DataBodySection,
  Summary: DataBodySummary,
  Group:   DataBodyGroup,
  Row:     DataBodyRow,
  Field:   DataBodyField,
})
