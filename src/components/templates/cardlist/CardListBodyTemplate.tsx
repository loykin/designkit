import { DataPage } from '@/components/templates/datapage/DataPage'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export interface CardItem {
  id: string
  title: string
  description: string
  tags?: string[]
  meta?: { label: string; icon?: React.ReactNode }[]
  badge?: string
  badgeColor?: string
  footer?: React.ReactNode
}

export interface CardListBodyTemplateProps {
  theme?: React.CSSProperties
  title?: string
  description?: React.ReactNode
  breadcrumb?: React.ReactNode
  actions?: React.ReactNode
  items?: CardItem[]
  columns?: 2 | 3 | 4
  toolbarLeft?: React.ReactNode
  toolbarRight?: React.ReactNode
}

const colClass: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 xl:grid-cols-3',
  4: 'grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
}

export function CardListBodyTemplate({
  theme,
  title,
  description,
  breadcrumb,
  actions,
  items = [],
  columns = 3,
  toolbarLeft,
  toolbarRight,
}: CardListBodyTemplateProps) {
  return (
    <DataPage className="layout-cardlist" style={theme}>
      <DataPage.Header>
        <DataPage.TitleBlock title={title} description={description} breadcrumb={breadcrumb} />
        <DataPage.Actions>{actions}</DataPage.Actions>
      </DataPage.Header>

      <DataPage.Content>
        <DataPage.Group>
          {(toolbarLeft || toolbarRight) && (
            <DataPage.GroupToolbar>
              <div className="flex min-w-0 items-center gap-2">{toolbarLeft}</div>
              <DataPage.Actions>{toolbarRight}</DataPage.Actions>
            </DataPage.GroupToolbar>
          )}
          <DataPage.GroupBody>
            <div className={`grid gap-[var(--dk-panel-gap)] ${colClass[columns]}`}>
              {items.map((item) => (
                <Card key={item.id} className="flex flex-col hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-[var(--dk-panel-gap)] flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-semibold truncate">{item.title}</p>
                      {item.badge && (
                        <div className="flex items-center gap-1 shrink-0">
                          {item.badgeColor && (
                            <div className="h-2 w-2 rounded-full" style={{ background: item.badgeColor }} />
                          )}
                          <span className="text-[10px] text-muted-foreground">{item.badge}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                      {item.description}
                    </p>
                    {item.tags && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  {(item.meta || item.footer) && (
                    <CardFooter className="border-t px-[var(--dk-panel-gap)] py-[calc(var(--dk-panel-gap)*0.75)] flex items-center gap-[calc(var(--dk-panel-gap)*0.75)] text-[10px] text-muted-foreground">
                      {item.footer ?? item.meta?.map((m, i) => (
                        <span
                          key={i}
                          className={['flex items-center gap-1', i === (item.meta!.length - 1) ? 'ml-auto' : ''].join(' ')}
                        >
                          {m.icon}{m.label}
                        </span>
                      ))}
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          </DataPage.GroupBody>
        </DataPage.Group>
      </DataPage.Content>
    </DataPage>
  )
}
