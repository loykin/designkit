import { Children, useMemo, useState } from 'react'
import { DataPage } from '@/components/templates/datapage/DataPage'
import { cn } from '@/lib/utils'

export interface SectionedBodyTemplateSection {
  id: string
  label: React.ReactNode
  description?: React.ReactNode
  disabled?: boolean
}

export interface SectionedBodyTemplatePanelProps {
  id: string
  children?: React.ReactNode
}

export interface SectionedBodyTemplateProps {
  theme?: React.CSSProperties
  className?: string
  breadcrumb?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  sections: SectionedBodyTemplateSection[]
  activeSection?: string
  defaultSection?: string
  onSectionChange?: (id: string) => void
  children?: React.ReactNode
}

function Panel(_props: SectionedBodyTemplatePanelProps) {
  return null
}

function isPanel(node: React.ReactNode): node is React.ReactElement<SectionedBodyTemplatePanelProps> {
  return Boolean(node && typeof node === 'object' && 'type' in node && node.type === Panel)
}

function Root({
  theme,
  className,
  breadcrumb,
  title,
  description,
  actions,
  sections,
  activeSection: controlledSection,
  defaultSection,
  onSectionChange,
  children,
}: SectionedBodyTemplateProps) {
  const panels = useMemo(() => Children.toArray(children).filter(isPanel), [children])
  const firstEnabled = sections.find((section) => !section.disabled)
  const [internalSection, setInternalSection] = useState(defaultSection ?? firstEnabled?.id ?? sections[0]?.id ?? '')
  const activeSection = controlledSection ?? internalSection
  const activePanel = panels.find((panel) => panel.props.id === activeSection) ?? panels[0]

  const handleSectionChange = (id: string) => {
    if (controlledSection === undefined) setInternalSection(id)
    onSectionChange?.(id)
  }

  return (
    <DataPage className={cn('layout-sectioned', className)} style={theme}>
      <DataPage.Header>
        <DataPage.TitleBlock breadcrumb={breadcrumb} title={title} description={description} />
        <DataPage.Actions>{actions}</DataPage.Actions>
      </DataPage.Header>

      <DataPage.Content>
        <div className="grid gap-[var(--dk-panel-gap)] lg:grid-cols-[16rem_minmax(0,1fr)]">
          <nav className="space-y-1">
            {sections.map((section) => {
              const active = section.id === activeSection
              return (
                <button
                  key={section.id}
                  type="button"
                  disabled={section.disabled}
                  className={cn(
                    'block w-full rounded-[var(--radius)] px-3 py-2 text-left transition-colors',
                    active ? 'bg-accent text-accent-foreground' : 'hover:bg-muted',
                    section.disabled && 'pointer-events-none opacity-50',
                  )}
                  onClick={() => handleSectionChange(section.id)}
                >
                  <span className="block text-sm font-medium">{section.label}</span>
                  {section.description && (
                    <span className="mt-0.5 block text-xs text-muted-foreground">{section.description}</span>
                  )}
                </button>
              )
            })}
          </nav>
          <div className="min-w-0 space-y-[var(--dk-panel-gap)]">
            {activePanel?.props.children}
          </div>
        </div>
      </DataPage.Content>
    </DataPage>
  )
}

export const SectionedBodyTemplate = Object.assign(Root, {
  Panel,
})
