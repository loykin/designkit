import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TabItem {
  id: string
  label: string
  badge?: string | number
  content: React.ReactNode
}

export interface TabbedBodyTemplateProps {
  title?: string
  actions?: React.ReactNode
  tabs?: TabItem[]
  defaultTab?: string
}

// ─── Demo defaults ────────────────────────────────────────────────────────────

const demoOverviewContent = (
  <div className="space-y-4">
    <div className="grid grid-cols-3 gap-4">
      {[
        { label: 'Total Revenue',  value: '$48,320', delta: '+12.1%', up: true  },
        { label: 'Orders',         value: '1,429',   delta: '+8.3%',  up: true  },
        { label: 'Refund Rate',    value: '2.4%',    delta: '-0.3%',  up: true  },
      ].map((s) => (
        <Card key={s.label}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
            <p className={`text-xs mt-1 ${s.up ? 'text-emerald-600' : 'text-red-500'}`}>{s.delta} this month</p>
          </CardContent>
        </Card>
      ))}
    </div>
    <Card>
      <CardContent className="p-4">
        <p className="text-sm font-medium mb-3">Recent Orders</p>
        <div className="space-y-2">
          {[
            { id: '#4821', customer: 'Sarah Kim',   amount: '$234', status: 'Shipped'   },
            { id: '#4820', customer: 'Marcus Lee',  amount: '$89',  status: 'Pending'   },
            { id: '#4819', customer: 'Alex Chen',   amount: '$412', status: 'Delivered' },
            { id: '#4818', customer: 'Dana White',  amount: '$156', status: 'Shipped'   },
          ].map((o) => (
            <div key={o.id} className="flex items-center gap-3 py-2 border-b last:border-0 text-sm">
              <span className="font-mono text-muted-foreground">{o.id}</span>
              <span className="flex-1">{o.customer}</span>
              <span className="font-medium">{o.amount}</span>
              <Badge variant={o.status === 'Delivered' ? 'default' : 'outline'} className="text-xs">{o.status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
)

const demoAnalyticsContent = (
  <Card>
    <CardContent className="p-6">
      <p className="text-sm font-medium mb-4">Traffic Sources</p>
      <div className="space-y-3">
        {[
          { label: 'Organic Search', value: 45, color: 'bg-primary' },
          { label: 'Direct',         value: 28, color: 'bg-blue-400' },
          { label: 'Social',         value: 15, color: 'bg-emerald-400' },
          { label: 'Referral',       value: 12, color: 'bg-amber-400' },
        ].map((s) => (
          <div key={s.label}>
            <div className="flex justify-between text-sm mb-1">
              <span>{s.label}</span><span className="text-muted-foreground">{s.value}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

const demoSettingsContent = (
  <Card>
    <CardContent className="p-6 space-y-4">
      {[
        { label: 'Site Name',   value: 'My Store',      type: 'text'  },
        { label: 'Email',       value: 'admin@shop.com', type: 'email' },
        { label: 'Currency',    value: 'USD',            type: 'text'  },
      ].map((f) => (
        <div key={f.label} className="flex items-center gap-4">
          <label className="text-sm font-medium w-24 shrink-0">{f.label}</label>
          <input
            type={f.type}
            defaultValue={f.value}
            className="flex-1 h-9 rounded-[--radius] border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      ))}
      <Separator />
      <Button size="sm">Save Changes</Button>
    </CardContent>
  </Card>
)

const demoTabs: TabItem[] = [
  { id: 'overview',  label: 'Overview',  badge: undefined, content: demoOverviewContent  },
  { id: 'analytics', label: 'Analytics', badge: undefined, content: demoAnalyticsContent },
  { id: 'orders',    label: 'Orders',    badge: 12,        content: <p className="text-muted-foreground text-sm p-4">Order management content goes here.</p> },
  { id: 'settings',  label: 'Settings',  badge: undefined, content: demoSettingsContent  },
]

// ─── Template ─────────────────────────────────────────────────────────────────

export function TabbedBodyTemplate({
  title = 'My Store',
  actions,
  tabs = demoTabs,
  defaultTab,
}: TabbedBodyTemplateProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id)
  const current = tabs.find((t) => t.id === active) ?? tabs[0]

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Page header */}
      <div className="px-6 pt-6 pb-0 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">{title}</h1>
          {actions ?? <Button size="sm">New Order</Button>}
        </div>

        {/* Tab bar */}
        <div className="flex gap-0 border-b">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={[
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                t.id === active
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              {t.label}
              {t.badge !== undefined && (
                <Badge variant={t.id === active ? 'default' : 'secondary'} className="text-xs h-4 px-1 min-w-4">
                  {t.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto p-6">
        {current?.content}
      </div>
    </div>
  )
}
