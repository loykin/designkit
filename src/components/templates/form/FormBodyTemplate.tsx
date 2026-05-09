import { DataPage } from '@/components/templates/datapage/DataPage'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export interface FormSection {
  key: string
  title: string
  description?: string
  danger?: boolean
  content: React.ReactNode
}

export interface FormBodyTemplateProps {
  theme?: React.CSSProperties
  title?: string
  description?: React.ReactNode
  breadcrumb?: React.ReactNode
  actions?: React.ReactNode
  sections?: FormSection[]
}

export function FormBodyTemplate({
  theme,
  title,
  description,
  breadcrumb,
  actions,
  sections = [],
}: FormBodyTemplateProps) {
  return (
    <DataPage className="layout-form" style={theme}>
      <DataPage.Header>
        <DataPage.TitleBlock title={title} description={description} breadcrumb={breadcrumb} />
        <DataPage.Actions>{actions}</DataPage.Actions>
      </DataPage.Header>

      <DataPage.Content>
        {sections.map((section, i) => (
          <div key={section.key}>
            {i > 0 && <Separator />}
            <div className="grid grid-cols-3 gap-[calc(var(--dk-panel-gap)*2)] py-[var(--dk-panel-gap)]">
              <div>
                <p className={['text-sm font-medium', section.danger ? 'text-destructive' : ''].join(' ')}>
                  {section.title}
                </p>
                {section.description && (
                  <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                )}
              </div>
              <div className="col-span-2">
                <Card>
                  <CardContent className="p-[var(--dk-panel-gap)]">{section.content}</CardContent>
                </Card>
              </div>
            </div>
          </div>
        ))}
      </DataPage.Content>
    </DataPage>
  )
}
