import { Children, useMemo, useState } from 'react'
import { DataPage } from '@/components/templates/datapage/DataPage'
import { cn } from '@/lib/utils'

export interface DataBodyTabProps {
  id: string
  label: React.ReactNode
  count?: number
  disabled?: boolean
  children: React.ReactNode
}

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

function DataBodyTab(_props: DataBodyTabProps) {
  return null
}

function isDataBodyTab(node: React.ReactNode): node is React.ReactElement<DataBodyTabProps> {
  return Boolean(
    node &&
    typeof node === 'object' &&
    'type' in node &&
    node.type === DataBodyTab,
  )
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
  activeTab: controlledTab,
  defaultTab,
  onTabChange,
  children,
  contentClassName,
}: DataBodyTemplateProps) {
  const childArray = useMemo(() => Children.toArray(children), [children])
  const tabs = childArray.filter(isDataBodyTab)
  const hasTabs = tabs.length > 0
  const [internalTab, setInternalTab] = useState(defaultTab ?? tabs[0]?.props.id ?? '')
  const activeTab = controlledTab ?? internalTab
  const activeTabNode = tabs.find((tab) => tab.props.id === activeTab) ?? tabs[0]

  const handleTabChange = (id: string) => {
    if (controlledTab === undefined) setInternalTab(id)
    onTabChange?.(id)
  }

  return (
    <DataPage className={cn('layout-databody', className)} style={theme}>
      <DataPage.Header>
        <DataPage.TitleBlock
          breadcrumb={breadcrumb}
          title={title}
          description={description}
        />
        <DataPage.Actions>{actions}</DataPage.Actions>
      </DataPage.Header>

      {hasTabs && (
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

      <DataPage.Content className={contentClassName}>
        {(toolbarLeft || toolbarRight) && (
          <DataPage.GroupToolbar>
            <div className="flex min-w-0 items-center gap-2">{toolbarLeft}</div>
            <DataPage.Actions>{toolbarRight}</DataPage.Actions>
          </DataPage.GroupToolbar>
        )}
        <DataPage.GroupBody className="min-h-full">
          {hasTabs ? activeTabNode?.props.children : children}
        </DataPage.GroupBody>
      </DataPage.Content>
    </DataPage>
  )
}

export const DataBodyTemplate = Object.assign(Root, {
  Tab: DataBodyTab,
})
