import { DataPage } from '@/components/templates/datapage/DataPage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export interface TypographyBodyTemplateProps {
  theme?: React.CSSProperties
  breadcrumb?: React.ReactNode
}

const scaleRows = [
  { label: 'Page title', className: 'text-xl font-semibold', sample: 'Customer Operations' },
  { label: 'Section title', className: 'text-base font-medium', sample: 'Service Health' },
  { label: 'Body', className: 'text-sm', sample: 'Review active incidents, service status, and recent deployments.' },
  { label: 'Caption', className: 'text-xs text-muted-foreground', sample: 'Updated 4 minutes ago' },
]

export function TypographyBodyTemplate({ theme, breadcrumb }: TypographyBodyTemplateProps) {
  return (
    <DataPage className="layout-typography" style={theme}>
      <DataPage.Header>
        <DataPage.TitleBlock
          breadcrumb={breadcrumb}
          title="Typography"
          description="Global type scale preview for shell, template, and grid content"
        />
      </DataPage.Header>

      <DataPage.Content className="grid gap-[var(--dk-panel-gap)] lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          <Card className="rounded-lg border border-border ring-0">
            <CardHeader>
              <CardTitle>Scale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scaleRows.map((row) => (
                <div key={row.label} className="grid grid-cols-[8rem_1fr] items-baseline gap-4">
                  <span className="text-xs text-muted-foreground">{row.label}</span>
                  <p className={row.className}>{row.sample}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-lg border border-border ring-0">
            <CardHeader>
              <CardTitle>Dense Interface</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Input className="h-8 max-w-64 text-sm" value="Search deployments" readOnly />
                <Button size="sm" className="h-8 text-xs">Apply</Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">Reset</Button>
              </div>
              <Separator />
              <div className="grid gap-2">
                {['API Gateway', 'Billing Worker', 'Notification Queue'].map((item, index) => (
                  <div key={item} className="flex items-center justify-between rounded-lg border px-3 py-2">
                    <div>
                      <p className="text-sm font-medium">{item}</p>
                      <p className="text-xs text-muted-foreground">p95 latency {42 + index * 18}ms</p>
                    </div>
                    <Badge variant={index === 1 ? 'secondary' : 'outline'} className="text-xs">
                      {index === 1 ? 'Watching' : 'Healthy'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-lg border border-border ring-0">
          <CardHeader>
            <CardTitle>Sidebar Sample</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {['Dashboard', 'Table', 'Infinite Scroll', 'Card List', 'Typography'].map((item, index) => (
              <div
                key={item}
                className={[
                  'flex h-8 items-center rounded-[var(--radius)] px-2 text-sm',
                  index === 4 ? 'bg-accent font-medium text-foreground' : 'text-muted-foreground',
                ].join(' ')}
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </DataPage.Content>
    </DataPage>
  )
}
