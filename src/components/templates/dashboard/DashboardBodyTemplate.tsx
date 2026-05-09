import { DataPage } from '@/components/templates/datapage/DataPage'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface StatCard {
  label: string
  value: string
  delta: string
  up: boolean
  icon: LucideIcon
}

export interface ServiceRow {
  name: string
  uptime: number
  requests: string
  errors: number
}

export interface DashboardBodyTemplateProps {
  theme?: React.CSSProperties
  title?: string
  description?: React.ReactNode
  breadcrumb?: React.ReactNode
  actions?: React.ReactNode
  stats?: StatCard[]
  services?: ServiceRow[]
  chart?: React.ReactNode
  events?: React.ReactNode
}

export function DashboardBodyTemplate({
  theme,
  title = 'Overview',
  description,
  breadcrumb,
  actions,
  stats,
  services,
  chart,
  events,
}: DashboardBodyTemplateProps) {
  return (
    <DataPage className="layout-dashboard" style={theme}>
      <DataPage.Header>
        <DataPage.TitleBlock title={title} description={description} breadcrumb={breadcrumb} />
        <DataPage.Actions>{actions}</DataPage.Actions>
      </DataPage.Header>

      <DataPage.Content>
        <div className="space-y-[var(--dk-panel-gap)] pb-[var(--dk-panel-gap)]">
          {stats && stats.length > 0 && (
            <div className="grid grid-cols-4 gap-[var(--dk-panel-gap)]">
              {stats.map((s) => (
                <Card key={s.label}>
                  <CardContent className="p-[var(--dk-panel-gap)]">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <s.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <p className="text-xl font-bold tabular-nums">{s.value}</p>
                    <p className={['text-xs mt-1 flex items-center gap-1', s.up ? 'text-primary' : 'text-destructive'].join(' ')}>
                      {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {s.delta} vs last week
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {(chart || events) && (
            <div className="grid grid-cols-3 gap-[var(--dk-panel-gap)]">
              {chart && <div className="col-span-2">{chart}</div>}
              {events && <div>{events}</div>}
            </div>
          )}

          {services && services.length > 0 && (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Uptime</TableHead>
                      <TableHead>Requests</TableHead>
                      <TableHead>Errors</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((s) => (
                      <TableRow key={s.name}>
                        <TableCell className="font-mono text-xs">{s.name}</TableCell>
                        <TableCell className="tabular-nums text-xs">{s.uptime}%</TableCell>
                        <TableCell className="tabular-nums text-xs">{s.requests}</TableCell>
                        <TableCell className="tabular-nums text-xs">{s.errors}</TableCell>
                        <TableCell>
                          <Badge
                            variant={s.uptime > 98 ? 'default' : s.uptime > 95 ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {s.uptime > 98 ? 'Healthy' : s.uptime > 95 ? 'Degraded' : 'Critical'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </DataPage.Content>
    </DataPage>
  )
}
