import { useState } from 'react'
import { DataPage } from '@/components/templates/datapage/DataPage'

export interface TabbedTab {
  id: string
  label: string
  count?: number
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
}

export interface TabbedBodyTemplateProps {
  theme?: React.CSSProperties
  title?: string
  description?: React.ReactNode
  breadcrumb?: React.ReactNode
  tabs?: TabbedTab[]
  activeTab?: string
  onTabChange?: (id: string) => void
  renderTab?: (id: string) => React.ReactNode
  toolbarLeft?: React.ReactNode
  toolbarRight?: React.ReactNode
  summary?: React.ReactNode
}

export function TabbedBodyTemplate({
  theme,
  title,
  description,
  breadcrumb,
  tabs = [],
  activeTab: controlledTab,
  onTabChange,
  renderTab,
  toolbarLeft,
  toolbarRight,
  summary,
}: TabbedBodyTemplateProps) {
  const [internalTab, setInternalTab] = useState(tabs[0]?.id ?? '')

  const activeTab = controlledTab ?? internalTab
  const handleTabChange = (id: string) => {
    if (!controlledTab) setInternalTab(id)
    onTabChange?.(id)
  }
  const activeTabConfig = tabs.find((tab) => tab.id === activeTab)

  return (
    <DataPage className="layout-tabbed" style={theme}>
      <DataPage.Header>
        <DataPage.TitleBlock title={title} description={description} breadcrumb={breadcrumb} />
      </DataPage.Header>

      {summary && (
        <div className="px-[var(--dk-page-padding-x)] py-[var(--dk-panel-gap)] border-b shrink-0">{summary}</div>
      )}

      <DataPage.Tabs>
        {tabs.map((tab) => (
          <DataPage.Tab
            key={tab.id}
            active={tab.id === activeTab}
            count={tab.count}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </DataPage.Tab>
        ))}
      </DataPage.Tabs>

      <DataPage.Content>
        <DataPage.Group className="min-h-full">
          <DataPage.GroupHeader
            title={activeTabConfig?.title}
            description={activeTabConfig?.description}
            actions={activeTabConfig?.actions}
          />
          {(toolbarLeft || toolbarRight) && (
            <DataPage.GroupToolbar>
              <div className="flex min-w-0 items-center gap-2">{toolbarLeft}</div>
              <DataPage.Actions>{toolbarRight}</DataPage.Actions>
            </DataPage.GroupToolbar>
          )}
          <DataPage.GroupBody>
            {renderTab?.(activeTab)}
          </DataPage.GroupBody>
        </DataPage.Group>
      </DataPage.Content>
    </DataPage>
  )
}
