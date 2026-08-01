import React, { Children, Fragment, useMemo, useState } from 'react'
import { DataPage } from '@/components/templates/datapage/DataPage'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const DataBodyTemplateContext = React.createContext(false)

function useDataBodyTemplateParent(component: string) {
  if (!React.useContext(DataBodyTemplateContext)) {
    throw new Error(
      `[DesignKit] <DataBodyTemplate.${component}> must be rendered inside <DataBodyTemplate>. ` +
        `Wrap it like: <DataBodyTemplate><DataBodyTemplate.${component}>...</DataBodyTemplate.${component}></DataBodyTemplate>.`,
    )
  }
}

// ─── Tab ──────────────────────────────────────────────────────────────────────

/**
 * Defines one tab inside `DataBodyTemplate`.
 *
 * Must be rendered beneath a `DataBodyTemplate` root. Do not mix `Tab`, `Section`,
 * and `Body` as sibling layout modes in the same root.
 */
export interface DataBodyTabProps {
  id: string
  label: React.ReactNode
  count?: number
  disabled?: boolean
  /** Search and filter controls scoped to this tab. */
  toolbarLeft?: React.ReactNode
  /** Actions scoped to this tab, such as resource creation and export. */
  toolbarRight?: React.ReactNode
  /** Content rendered beneath the active tab body, such as pagination. */
  footer?: React.ReactNode
  children: React.ReactNode
}

function DataBodyTab(_props: DataBodyTabProps) {
  useDataBodyTemplateParent('Tab')
  return null
}

function isDataBodyTab(node: React.ReactNode): node is React.ReactElement<DataBodyTabProps> {
  return Boolean(node && typeof node === 'object' && 'type' in node && node.type === DataBodyTab)
}

// ─── Body (single pane) ───────────────────────────────────────────────────────

/**
 * Defines the single-pane body of `DataBodyTemplate`.
 *
 * Must be rendered beneath a `DataBodyTemplate` root. Use this instead of `Tab`
 * or `Section` when the page has one full-height content pane.
 */
export interface DataBodyBodyProps {
  children?: React.ReactNode
  className?: string
}

function DataBodyBody(_props: DataBodyBodyProps) {
  useDataBodyTemplateParent('Body')
  return null
}

function isDataBodyBody(node: React.ReactNode): node is React.ReactElement<DataBodyBodyProps> {
  return Boolean(node && typeof node === 'object' && 'type' in node && node.type === DataBodyBody)
}

// ─── Section ──────────────────────────────────────────────────────────────────

/**
 * Defines one section in the left-navigation layout of `DataBodyTemplate`.
 *
 * Must be rendered beneath a `DataBodyTemplate` root. Do not combine sections
 * with `Tab` or `Body` siblings in the same root.
 */
export interface DataBodySectionProps {
  id: string
  label: React.ReactNode
  description?: React.ReactNode
  disabled?: boolean
  children?: React.ReactNode
}

function DataBodySection(_props: DataBodySectionProps) {
  useDataBodyTemplateParent('Section')
  return null
}

function isDataBodySection(
  node: React.ReactNode,
): node is React.ReactElement<DataBodySectionProps> {
  return Boolean(
    node && typeof node === 'object' && 'type' in node && node.type === DataBodySection,
  )
}

// ─── Summary ──────────────────────────────────────────────────────────────────

/** Adds summary content beneath the header of a `DataBodyTemplate` root. */
export interface DataBodySummaryProps {
  children?: React.ReactNode
}

function DataBodySummary(_props: DataBodySummaryProps) {
  useDataBodyTemplateParent('Summary')
  return null
}

function isDataBodySummary(
  node: React.ReactNode,
): node is React.ReactElement<DataBodySummaryProps> {
  return Boolean(
    node && typeof node === 'object' && 'type' in node && node.type === DataBodySummary,
  )
}

// ─── Resource ─────────────────────────────────────────────────────────────────

/**
 * Keeps controls, async status, data content, and pagination in one resource boundary.
 * Render it inside a `Tab` or `Body` when those controls are scoped to that content.
 */
export interface DataBodyResourceProps {
  toolbarLeft?: React.ReactNode
  toolbarRight?: React.ReactNode
  refreshing?: boolean
  refreshingLabel?: string
  notice?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
  className?: string
  bodyClassName?: string
}

function DataBodyResource({
  toolbarLeft,
  toolbarRight,
  refreshing,
  refreshingLabel = 'Refreshing',
  notice,
  footer,
  children,
  className,
  bodyClassName,
}: DataBodyResourceProps) {
  useDataBodyTemplateParent('Resource')

  return (
    <section
      data-slot="data-body-resource"
      data-refreshing={refreshing ? 'true' : 'false'}
      className={cn('flex min-h-0 flex-col', className)}
    >
      {(toolbarLeft || toolbarRight || refreshing) && (
        <DataPage.GroupToolbar>
          <div className="flex min-w-0 flex-wrap items-center gap-2">{toolbarLeft}</div>
          <div className="flex shrink-0 items-center gap-2">
            {refreshing && (
              <span
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
                role="status"
              >
                <span className="size-3 animate-spin rounded-full border-2 border-muted border-t-primary" />
                {refreshingLabel}
              </span>
            )}
            <DataPage.Actions>{toolbarRight}</DataPage.Actions>
          </div>
        </DataPage.GroupToolbar>
      )}
      {notice && <div className="mb-3 shrink-0">{notice}</div>}
      <DataPage.GroupBody className={cn('min-h-0 flex-1', bodyClassName)}>
        {children}
      </DataPage.GroupBody>
      {footer && (
        <div
          className="mt-3 shrink-0 border-t border-border pt-3"
          data-slot="data-body-resource-footer"
        >
          {footer}
        </div>
      )}
    </section>
  )
}

// ─── Group ────────────────────────────────────────────────────────────────────

export type GroupLayout = 'stacked' | 'horizontal' | 'inline' | 'split'
export type GroupVariant = 'card' | 'plain' | 'bordered'

const layoutDefaultVariant: Record<GroupLayout, GroupVariant> = {
  stacked: 'plain',
  horizontal: 'card',
  inline: 'bordered',
  split: 'bordered',
}

/**
 * Groups related content inside `DataBodyTemplate`.
 *
 * `DataBodyTemplate.Group` is a compound child and must never be rendered as a
 * standalone page component. Wrap it in `DataBodyTemplate`, optionally inside a
 * `Tab`, `Section`, or `Body`.
 */
export interface DataBodyGroupProps {
  /** Visual arrangement of the group. @defaultValue `'stacked'` */
  layout?: GroupLayout
  /** Surface treatment. Defaults depend on `layout`. */
  variant?: GroupVariant
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  danger?: boolean
  className?: string
  children?: React.ReactNode
}

function DataBodyGroup(props: DataBodyGroupProps) {
  useDataBodyTemplateParent('Group')
  return renderGroupProps(props)
}

function isDataBodyGroup(node: React.ReactNode): node is React.ReactElement<DataBodyGroupProps> {
  return Boolean(node && typeof node === 'object' && 'type' in node && node.type === DataBodyGroup)
}

function GroupWrapper({
  layout,
  variant,
  children,
}: {
  layout: GroupLayout
  variant: GroupVariant
  children: React.ReactNode
}) {
  if (variant === 'card') {
    return (
      <Card>
        <CardContent className="p-(--designkit-panel-gap)">{children}</CardContent>
      </Card>
    )
  }
  if (variant === 'bordered') {
    if (layout === 'inline') {
      return (
        <div className="overflow-hidden rounded-(--radius) border border-border divide-y divide-border">
          {children}
        </div>
      )
    }
    return (
      <div className="rounded-(--radius) border border-border p-(--designkit-panel-gap)">
        {children}
      </div>
    )
  }
  return <>{children}</>
}

function renderGroups(nodes: React.ReactNode): React.ReactNode {
  const childArray = Children.toArray(nodes)
  if (!childArray.some(isDataBodyGroup)) return nodes
  return (
    <>
      {childArray.map((child, i) => (
        <Fragment key={i}>{isDataBodyGroup(child) ? renderGroup(child) : child}</Fragment>
      ))}
    </>
  )
}

function renderGroup(group: React.ReactElement<DataBodyGroupProps>) {
  return renderGroupProps(group.props)
}

function renderGroupProps(props: DataBodyGroupProps) {
  const {
    layout = 'stacked',
    variant: variantProp,
    title,
    description,
    actions,
    danger,
    className,
    children,
  } = props
  const variant = variantProp ?? layoutDefaultVariant[layout]

  if (layout === 'split') {
    const panes = Children.toArray(children)
    return (
      <div className={cn('py-(--designkit-panel-gap)', className)}>
        {(title || description || actions) && (
          <div className="mb-3 flex items-start justify-between">
            <div>
              {title && (
                <h2 className={cn('text-sm font-semibold', danger && 'text-destructive')}>
                  {title}
                </h2>
              )}
              {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
            </div>
            {actions && <div>{actions}</div>}
          </div>
        )}
        <div className="grid min-h-104 gap-(--designkit-panel-gap) lg:grid-cols-[20rem_minmax(0,1fr)]">
          {panes.map((pane, i) => (
            <GroupWrapper key={i} layout={layout} variant={variant}>
              {pane}
            </GroupWrapper>
          ))}
        </div>
      </div>
    )
  }

  if (layout === 'horizontal') {
    return (
      <div
        className={cn(
          'grid grid-cols-1 gap-(--designkit-panel-gap) py-(--designkit-panel-gap) sm:grid-cols-3 sm:gap-[calc(var(--designkit-panel-gap)*2)]',
          className,
        )}
      >
        <div>
          <p className={cn('text-sm font-medium', danger && 'text-destructive')}>{title}</p>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
          {actions && <div className="mt-2">{actions}</div>}
        </div>
        <div className="sm:col-span-2">
          <GroupWrapper layout={layout} variant={variant}>
            {children}
          </GroupWrapper>
        </div>
      </div>
    )
  }

  if (layout === 'inline') {
    return (
      <div className={cn('py-(--designkit-panel-gap)', className)}>
        {(title || description) && (
          <div className="mb-2 flex items-start justify-between">
            <div>
              {title && (
                <h2 className={cn('text-sm font-semibold', danger && 'text-destructive')}>
                  {title}
                </h2>
              )}
              {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
            </div>
            {actions && <div>{actions}</div>}
          </div>
        )}
        <GroupWrapper layout={layout} variant={variant}>
          {children}
        </GroupWrapper>
      </div>
    )
  }

  // stacked (default)
  return (
    <div className={cn('py-(--designkit-panel-gap)', className)}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className={cn('text-sm font-semibold', danger && 'text-destructive')}>{title}</h2>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <div className="mt-4">
        <GroupWrapper layout={layout} variant={variant}>
          {children}
        </GroupWrapper>
      </div>
    </div>
  )
}

// ─── Field (read-only display) ────────────────────────────────────────────────

/** Read-only label/value content for a `DataBodyTemplate.Group`. */
export interface DataBodyFieldProps {
  label: string
  description?: string
  children?: React.ReactNode
}

function DataBodyField({ label, description, children }: DataBodyFieldProps) {
  useDataBodyTemplateParent('Field')
  return (
    <div
      className="flex flex-col gap-y-1 px-4 py-3 sm:grid sm:items-start sm:gap-x-4 sm:gap-y-0"
      style={{ gridTemplateColumns: 'var(--designkit-form-label-w, 11rem) 1fr' }}
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

/** Form label/control content for a `DataBodyTemplate.Group`. */
export interface DataBodyRowProps {
  label: string
  description?: string
  required?: boolean
  children?: React.ReactNode
}

function DataBodyRow({ label, description, required, children }: DataBodyRowProps) {
  useDataBodyTemplateParent('Row')
  return (
    <div
      className="flex flex-col gap-y-1.5 px-4 py-3 sm:grid sm:items-start sm:gap-x-4 sm:gap-y-0"
      style={{ gridTemplateColumns: 'var(--designkit-form-label-w, 11rem) 1fr' }}
    >
      <div className="pt-1">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">{label}</span>
          {required && <span className="text-destructive text-xs leading-none">*</span>}
        </div>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className={cn('min-w-0', !description && 'flex items-center')}>{children}</div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

/**
 * Props for the required root of the `DataBodyTemplate` compound component.
 *
 * Choose one primary child mode: direct content/groups, `Tab`, `Section`, or
 * `Body`. Do not combine those layout modes in the same root.
 */
export interface DataBodyTemplateProps {
  theme?: React.CSSProperties
  className?: string
  topBar?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  status?: React.ReactNode
  actions?: React.ReactNode
  toolbarLeft?: React.ReactNode
  toolbarRight?: React.ReactNode
  activeTab?: string
  defaultTab?: string
  onTabChange?: (id: string) => void
  children?: React.ReactNode
  contentClassName?: string
}

function TopBarSlot({ topBar }: { topBar?: React.ReactNode }) {
  if (!topBar) return null
  return <div className="shrink-0">{topBar}</div>
}

function RootContent({
  theme,
  className,
  topBar,
  title,
  description,
  status,
  actions,
  toolbarLeft,
  toolbarRight,
  activeTab: controlledActive,
  defaultTab,
  onTabChange,
  children,
  contentClassName,
}: DataBodyTemplateProps) {
  const childArray = useMemo(() => Children.toArray(children), [children])
  const tabs = childArray.filter(isDataBodyTab)
  const sections = childArray.filter(isDataBodySection)
  const bodySlots = childArray.filter(isDataBodyBody)
  const summaryEl = childArray.find(isDataBodySummary)
  const bodyChildren = childArray.filter(
    (c) =>
      !isDataBodyTab(c) && !isDataBodySummary(c) && !isDataBodySection(c) && !isDataBodyBody(c),
  )

  const hasTabs = tabs.length > 0
  const hasSections = sections.length > 0
  const hasBody = bodySlots.length > 0
  bodyChildren.some(isDataBodyGroup)
  const navItems = hasSections ? sections : tabs
  const [internalActive, setInternalActive] = useState(defaultTab ?? navItems[0]?.props.id ?? '')
  const activeId = controlledActive ?? internalActive
  const handleChange = (id: string) => {
    if (controlledActive === undefined) setInternalActive(id)
    onTabChange?.(id)
  }

  // ── Single-pane body layout ───────────────────────────────────────────────
  if (hasBody) {
    const bodyEl = bodySlots[0]
    return (
      <DataPage className={cn('layout-databody', className)} style={theme}>
        <TopBarSlot topBar={topBar} />
        <DataPage.Header>
          <DataPage.TitleBlock title={title} description={description} status={status} />
          <DataPage.Actions>{actions}</DataPage.Actions>
        </DataPage.Header>

        {summaryEl && (
          <div className="shrink-0 border-b border-border px-(--designkit-page-padding-x) py-(--designkit-panel-gap)">
            {summaryEl.props.children}
          </div>
        )}

        <DataPage.Content className={contentClassName}>
          <DataPage.Group className="flex h-full flex-col">
            {(toolbarLeft || toolbarRight) && (
              <DataPage.GroupToolbar>
                <div className="flex min-w-0 items-center gap-2">{toolbarLeft}</div>
                <DataPage.Actions>{toolbarRight}</DataPage.Actions>
              </DataPage.GroupToolbar>
            )}
            <DataPage.GroupBody className={cn('min-h-0 flex-1', bodyEl.props.className)}>
              {bodyEl.props.children}
            </DataPage.GroupBody>
          </DataPage.Group>
        </DataPage.Content>
      </DataPage>
    )
  }

  // ── Sectioned layout (left nav) ───────────────────────────────────────────
  if (hasSections) {
    const activeSection = sections.find((s) => s.props.id === activeId) ?? sections[0]
    return (
      <DataPage className={cn('layout-sectioned', className)} style={theme}>
        <TopBarSlot topBar={topBar} />
        <DataPage.Header>
          <DataPage.TitleBlock title={title} description={description} status={status} />
          <DataPage.Actions>{actions}</DataPage.Actions>
        </DataPage.Header>

        {summaryEl && (
          <div className="shrink-0 border-b border-border px-(--designkit-page-padding-x) py-(--designkit-panel-gap)">
            {summaryEl.props.children}
          </div>
        )}

        <DataPage.Content className={contentClassName}>
          <div className="grid gap-(--designkit-panel-gap) lg:grid-cols-[16rem_minmax(0,1fr)]">
            <nav className="space-y-1">
              {sections.map((section) => {
                const active = section.props.id === activeSection?.props.id
                return (
                  <button
                    key={section.props.id}
                    type="button"
                    disabled={section.props.disabled}
                    className={cn(
                      'block w-full rounded-(--radius) px-3 py-2 text-left transition-colors',
                      active ? 'bg-accent text-accent-foreground' : 'hover:bg-muted',
                      section.props.disabled && 'pointer-events-none opacity-50',
                    )}
                    onClick={() => handleChange(section.props.id)}
                  >
                    <span className="block text-sm font-medium">{section.props.label}</span>
                    {section.props.description && (
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {section.props.description}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
            <div className="min-w-0 space-y-(--designkit-panel-gap)">
              {renderGroups(activeSection?.props.children)}
            </div>
          </div>
        </DataPage.Content>
      </DataPage>
    )
  }

  // ── Tabbed / plain layout ─────────────────────────────────────────────────
  const activeTabNode = tabs.find((tab) => tab.props.id === activeId) ?? tabs[0]
  const activeToolbarLeft = activeTabNode?.props.toolbarLeft ?? toolbarLeft
  const activeToolbarRight = activeTabNode?.props.toolbarRight ?? toolbarRight

  return (
    <DataPage className={cn('layout-databody', className)} style={theme}>
      <TopBarSlot topBar={topBar} />
      <DataPage.Header>
        <DataPage.TitleBlock title={title} description={description} status={status} />
        <DataPage.Actions>{actions}</DataPage.Actions>
      </DataPage.Header>

      {summaryEl && (
        <div className="shrink-0 border-b border-border px-(--designkit-page-padding-x) py-(--designkit-panel-gap)">
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
        {(activeToolbarLeft || activeToolbarRight) && (
          <DataPage.GroupToolbar>
            <div className="flex min-w-0 items-center gap-2">{activeToolbarLeft}</div>
            <DataPage.Actions>{activeToolbarRight}</DataPage.Actions>
          </DataPage.GroupToolbar>
        )}
        {hasTabs ? (
          <DataPage.GroupBody className="min-h-full">
            {renderGroups(activeTabNode?.props.children)}
          </DataPage.GroupBody>
        ) : (
          <DataPage.GroupBody>
            {bodyChildren.map((child, i) => (
              <Fragment key={i}>{isDataBodyGroup(child) ? renderGroup(child) : child}</Fragment>
            ))}
          </DataPage.GroupBody>
        )}
      </DataPage.Content>
      {activeTabNode?.props.footer && (
        <DataPage.Footer>{activeTabNode.props.footer}</DataPage.Footer>
      )}
    </DataPage>
  )
}

function Root(props: DataBodyTemplateProps) {
  return (
    <DataBodyTemplateContext.Provider value>
      <RootContent {...props} />
    </DataBodyTemplateContext.Provider>
  )
}

/**
 * Page-level template for data, list, tab, form, and settings experiences.
 *
 * Compound members such as `DataBodyTemplate.Resource`, `Group`, `Tab`, `Section`,
 * `Body`, `Row`, and `Field` must be rendered beneath this root. Rendering a compound
 * member without the root throws a descriptive runtime error.
 *
 * @example
 * ```tsx
 * <DataBodyTemplate title="Settings">
 *   <DataBodyTemplate.Group title="Profile">
 *     <DataBodyTemplate.Row label="Name">
 *       <Input />
 *     </DataBodyTemplate.Row>
 *   </DataBodyTemplate.Group>
 * </DataBodyTemplate>
 * ```
 */
export const DataBodyTemplate = Object.assign(Root, {
  Body: DataBodyBody,
  Tab: DataBodyTab,
  Section: DataBodySection,
  Summary: DataBodySummary,
  Resource: DataBodyResource,
  Group: DataBodyGroup,
  Row: DataBodyRow,
  Field: DataBodyField,
})
