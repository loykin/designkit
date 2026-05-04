import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StatCard {
  label: string
  value: string
  delta: string
  up: boolean
  icon: LucideIcon
}

export interface DashboardBodyTemplateProps {
  title?: string
  actions?: React.ReactNode
  stats?: StatCard[]
  /** Primary content (charts, tables, etc.) */
  primary?: React.ReactNode
  /** Secondary content (sidebar-style widgets) */
  secondary?: React.ReactNode
}

// ─── Demo defaults ────────────────────────────────────────────────────────────

import { Activity, Users, AlertCircle, Zap } from 'lucide-react'

const demoStats: StatCard[] = [
  { label: 'Total Requests', value: '2.4M',   delta: '+18%',   up: true,  icon: Activity    },
  { label: 'Active Users',   value: '12,847', delta: '+4.2%',  up: true,  icon: Users       },
  { label: 'Error Rate',     value: '0.12%',  delta: '-0.05%', up: true,  icon: AlertCircle },
  { label: 'Avg Latency',    value: '124ms',  delta: '+8ms',   up: false, icon: Zap         },
]

const demoActivity = [
  { label: 'Deployed api-gateway v2.1',      time: '2 min ago',  color: 'bg-emerald-500' },
  { label: 'Alert: cache-layer CPU > 90%',   time: '14 min ago', color: 'bg-red-500'     },
  { label: 'User sarah@acme.com signed up',  time: '1 hr ago',   color: 'bg-blue-500'    },
  { label: 'Backup completed successfully',  time: '3 hr ago',   color: 'bg-emerald-500' },
  { label: 'Rate limit hit on /api/search',  time: '5 hr ago',   color: 'bg-yellow-500'  },
]

const demoServices = [
  { name: 'api-gateway',    health: 98, color: 'bg-emerald-500' },
  { name: 'ml-inference',   health: 91, color: 'bg-emerald-500' },
  { name: 'data-processor', health: 64, color: 'bg-yellow-500'  },
  { name: 'cache-layer',    health: 23, color: 'bg-red-500'     },
]

function DemoPrimary() {
  return (
    <Card className="flex-1">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Request Volume</CardTitle>
          <div className="flex gap-1">
            {['1h', '6h', '24h', '7d'].map((t) => (
              <button key={t} className={`px-2 py-0.5 text-xs rounded-[--radius] transition-colors ${t === '24h' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}>{t}</button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Fake bar chart */}
        <div className="flex items-end gap-1 h-32">
          {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 72, 88, 65, 78, 92, 68, 84, 71, 89, 76, 93, 67, 82].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-[calc(var(--radius)*0.5)] bg-primary/20 hover:bg-primary/40 transition-colors cursor-pointer" style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
        </div>
      </CardContent>
    </Card>
  )
}

function DemoSecondary() {
  return (
    <div className="flex flex-col gap-4 w-72 shrink-0">
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Service Health</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {demoServices.map((s) => (
            <div key={s.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-mono">{s.name}</span>
                <span className={s.health > 80 ? 'text-emerald-600' : s.health > 50 ? 'text-yellow-600' : 'text-red-600'}>{s.health}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.health}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader className="pb-2"><CardTitle className="text-sm">Activity</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {demoActivity.map((a, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${a.color}`} />
              <div>
                <p className="text-xs leading-tight">{a.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Template ─────────────────────────────────────────────────────────────────

export function DashboardBodyTemplate({
  title = 'Overview',
  actions,
  stats = demoStats,
  primary,
  secondary,
}: DashboardBodyTemplateProps) {
  return (
    <div className="h-full flex flex-col gap-4 p-6 overflow-auto">
      {/* Toolbar */}
      <div className="flex items-center gap-3 shrink-0">
        <h1 className="text-lg font-semibold mr-auto">{title}</h1>
        {actions ?? (
          <Button variant="outline" size="sm">Export Report</Button>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className={`text-xs mt-1 flex items-center gap-1 ${s.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {s.delta}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Primary + Secondary */}
      <div className="flex gap-4 flex-1 min-h-0">
        {primary ?? <DemoPrimary />}
        {secondary ?? <DemoSecondary />}
      </div>
    </div>
  )
}
