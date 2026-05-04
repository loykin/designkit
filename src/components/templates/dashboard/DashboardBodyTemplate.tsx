import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TrendingUp, TrendingDown, Activity, Users, AlertCircle, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ─── Public API ───────────────────────────────────────────────────────────────

export interface StatCard {
  label: string; value: string; delta: string; up: boolean; icon: LucideIcon
}

export interface ServiceRow {
  name: string; uptime: number; requests: string; errors: number
}

export interface DashboardBodyTemplateProps {
  theme?:    React.CSSProperties
  title?:    string
  /** Slot: replaces toolbar actions */
  actions?:  React.ReactNode
  stats?:    StatCard[]
  services?: ServiceRow[]
  /** Slot: replaces the bar chart area */
  chart?:    React.ReactNode
  /** Slot: replaces the recent events list */
  events?:   React.ReactNode
}

// ─── Demo defaults ────────────────────────────────────────────────────────────

const demoStats: StatCard[] = [
  { label: 'Total Requests', value: '2.4M',   delta: '+18%',   up: true,  icon: Activity    },
  { label: 'Active Users',   value: '12,847', delta: '+4.2%',  up: true,  icon: Users       },
  { label: 'Error Rate',     value: '0.12%',  delta: '-0.05%', up: true,  icon: AlertCircle },
  { label: 'Avg Latency',    value: '124ms',  delta: '+8ms',   up: false, icon: Zap         },
]

const demoServices: ServiceRow[] = [
  { name: 'api-gateway',    uptime: 99.9, requests: '1.2M', errors: 3   },
  { name: 'ml-inference',   uptime: 99.1, requests: '84k',  errors: 12  },
  { name: 'data-processor', uptime: 97.2, requests: '340k', errors: 89  },
  { name: 'cache-layer',    uptime: 91.4, requests: '2.1M', errors: 210 },
]

const demoEvents = [
  { label: 'Deployed api-gateway v2.1',     status: 'success', time: '2m ago'  },
  { label: 'Alert: cache-layer CPU > 90%',  status: 'error',   time: '14m ago' },
  { label: 'User sarah@acme.com signed up', status: 'info',    time: '1h ago'  },
  { label: 'Backup completed',              status: 'success', time: '3h ago'  },
  { label: 'Rate limit hit on /api/search', status: 'warning', time: '5h ago'  },
]

const bars = [40,65,45,80,55,90,70,85,60,75,95,72,88,65,78,92,68,84,71,89,76,93,67,82]

const dotColor: Record<string, string> = {
  success: 'bg-primary', error: 'bg-destructive', warning: 'bg-yellow-500', info: 'bg-muted-foreground',
}

// ─── Template ─────────────────────────────────────────────────────────────────

export function DashboardBodyTemplate({
  theme,
  title    = 'Overview',
  actions,
  stats    = demoStats,
  services = demoServices,
  chart,
  events,
}: DashboardBodyTemplateProps) {
  return (
    <div className="layout-dashboard h-full overflow-auto bg-background text-foreground" style={theme}>
      <div className="p-6 space-y-6">

        <div className="flex items-center justify-between">
          <h1 className="text-sm font-semibold">{title}</h1>
          {actions ?? <Button variant="outline" size="sm" className="h-8 text-xs">Export Report</Button>}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4">
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

        {/* Chart + Events */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="col-span-2">
            <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm">Request Volume</CardTitle>
              <div className="flex gap-1">
                {['1h','6h','24h','7d'].map((t) => (
                  <button key={t} className={[
                    'px-2 py-0.5 text-xs rounded-[--radius] transition-colors',
                    t === '24h' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent',
                  ].join(' ')}>{t}</button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              {chart ?? (
                <>
                  <div className="flex items-end gap-0.5 h-28">
                    {bars.map((h, i) => (
                      <div key={i}
                        className="flex-1 rounded-t-[--radius] bg-primary/20 hover:bg-primary/50 transition-colors"
                        style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                    <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recent Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {events ?? demoEvents.map((e, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${dotColor[e.status]}`} />
                  <div className="min-w-0">
                    <p className="text-xs leading-snug truncate">{e.label}</p>
                    <p className="text-[10px] text-muted-foreground">{e.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Service table */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Services</CardTitle></CardHeader>
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
                      <Badge variant={s.uptime > 98 ? 'default' : s.uptime > 95 ? 'secondary' : 'outline'} className="text-xs">
                        {s.uptime > 98 ? 'Healthy' : s.uptime > 95 ? 'Degraded' : 'Critical'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
