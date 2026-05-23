import { Children, useMemo, useState } from 'react'
import { DataPage } from '@/components/templates/datapage/DataPage'

export interface TabbedBodyTemplateTabProps {
  id: string
  label: React.ReactNode
  count?: number
  disabled?: boolean
  children?: React.ReactNode
}

export interface TabbedBodyTemplateSummaryProps {
  children?: React.ReactNode
}

export interface TabbedBodyTemplateProps {
  theme?: React.CSSProperties
  title?: React.ReactNode
  description?: React.ReactNode
  breadcrumb?: React.ReactNode
  actions?: React.ReactNode
  toolbarLeft?: React.ReactNode
  toolbarRight?: React.ReactNode
  activeTab?: string
  defaultTab?: string
  onTabChange?: (id: string) => void
  children?: React.ReactNode
}

function Tab(_props: TabbedBodyTemplateTabProps) {
  return null
}

function Summary(_props: TabbedBodyTemplateSummaryProps) {
  return null
}

function isTab(node: React.ReactNode): node is React.ReactElement<TabbedBodyTemplateTabProps> {
  return Boolean(node && typeof node === 'object' && 'type' in node && node.type === Tab)
}

function isSummary(node: React.ReactNode): node is React.ReactElement<TabbedBodyTemplateSummaryProps> {
  return Boolean(node && typeof node === 'object' && 'type' in node && node.type === Summary)
}

function Root({
  theme,
  title,
  description,
  breadcrumb,
  actions,
  toolbarLeft,
  toolbarRight,
  activeTab: controlledTab,
  defaultTab,
  onTabChange,
  children,
}: TabbedBodyTemplateProps) {
  const childArray = useMemo(() => Children.toArray(children), [children])
  const tabs = childArray.filter(isTab)
  const summaryEl = childArray.find(isSummary)

  const [internalTab, setInternalTab] = useState(defaultTab ?? tabs[0]?.props.id ?? '')
  const activeTab = controlledTab ?? internalTab
  const activeTabNode = tabs.find((t) => t.props.id === activeTab) ?? tabs[0]

  const handleTabChange = (id: string) => {
    if (controlledTab === undefined) setInternalTab(id)
    onTabChange?.(id)
  }

  return (
    <DataPage className="layout-tabbed" style={theme}>
      <DataPage.Header>
        <DataPage.TitleBlock title={title} description={description} breadcrumb={breadcrumb} />
        <DataPage.Actions>{actions}</DataPage.Actions>
      </DataPage.Header>

      {summaryEl && (
        <div className="shrink-0 border-b px-[var(--dk-page-padding-x)] py-[var(--dk-panel-gap)]">
          {summaryEl.props.children}
        </div>
      )}

      {tabs.length > 0 && (
        <DataPage.Tabs>
          {tabs.map((tab) => (
            <DataPage.Tab
              key={tab.props.id}
              active={tab.props.id === activeTabNode?.props.id}
              count={tab.props.count}
              disabled={tab.props.disabled}
              onClick={() => handleTabChange(tab.props.id)}
            >
              {tab.props.label}
            </DataPage.Tab>
          ))}
        </DataPage.Tabs>
      )}

      <DataPage.Content>
        <DataPage.Group>
          {(toolbarLeft || toolbarRight) && (
            <DataPage.GroupToolbar>
              <div className="flex min-w-0 items-center gap-2">{toolbarLeft}</div>
              <DataPage.Actions>{toolbarRight}</DataPage.Actions>
            </DataPage.GroupToolbar>
          )}
          <DataPage.GroupBody>
            {activeTabNode?.props.children}
          </DataPage.GroupBody>
        </DataPage.Group>
      </DataPage.Content>
    </DataPage>
  )
}

export const TabbedBodyTemplate = Object.assign(Root, {
  Tab,
  Summary,
})
