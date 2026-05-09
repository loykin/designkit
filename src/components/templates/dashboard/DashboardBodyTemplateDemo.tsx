import { DashboardBodyTemplate, type StatCard, type ServiceRow } from './DashboardBodyTemplate'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Activity, Users, AlertCircle, Zap } from 'lucide-react'

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
  success: 'bg-primary',
  error: 'bg-destructive',
  warning: 'bg-yellow-500',
  info: 'bg-muted-foreground',
}

function DemoChart() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm">Request Volume</CardTitle>
        <div className="flex gap-1">
          {['1h', '6h', '24h', '7d'].map((t) => (
            <button
              key={t}
              className={[
                'px-2 py-0.5 text-xs rounded-[var(--radius)] transition-colors',
                t === '24h'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent',
              ].join(' ')}
            >
              {t}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-0.5 h-28">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-[var(--radius)] bg-primary/20 hover:bg-primary/50 transition-colors"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
          <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
        </div>
      </CardContent>
    </Card>
  )
}

function DemoEvents() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Recent Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {demoEvents.map((e, i) => (
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
  )
}

export function DashboardBodyTemplateDemo({ theme }: { theme?: React.CSSProperties }) {
  return (
    <DashboardBodyTemplate
      theme={theme}
      breadcrumb="Pages / Dashboard"
      title="Overview"
      description="Operational metrics and service health"
      actions={<Button variant="outline" size="sm" className="h-8 text-xs">Export Report</Button>}
      stats={demoStats}
      services={demoServices}
      chart={<DemoChart />}
      events={<DemoEvents />}
    />
  )
}
