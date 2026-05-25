import React, { useMemo, useRef, useState } from 'react'
import {
  DashboardBodyTemplate,
  DashboardPanel,
  PageTopBar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from '@loykin/designkit'
import { createDashboardEngine, builtinVariableTypes } from '@loykin/dashboardkit'
import { useLoadDashboard, useVariable, DashboardGrid } from '@loykin/dashboardkit/react'
import { RefreshCw, Clock, PencilLine, Check, MoreVertical } from 'lucide-react'
import { StatPanel } from './panels/StatPanel'
import { TimeSeriesPanel } from './panels/TimeSeriesPanel'
import { BarChartPanel } from './panels/BarChartPanel'
import { TablePanel, StatusBadge } from './panels/TablePanel'
import type { DashboardConfig, CoreEngineAPI } from '@loykin/dashboardkit'
import type { TemplateCodeContext } from '../../code'
import type { TimeSeriesPoint } from './panels/TimeSeriesPanel'
import 'react-grid-layout/css/styles.css'

// ─── Mock data generators ─────────────────────────────────────────────────────

function makeTimeSeries(keys: string[], length = 24): TimeSeriesPoint[] {
  return Array.from({ length }, (_, i) => {
    const h = String(i).padStart(2, '0')
    const point: TimeSeriesPoint = { time: `${h}:00` }
    keys.forEach((k) => {
      point[k] = Math.round(20 + Math.random() * 60 + (k === 'p99' ? 40 : 0))
    })
    return point
  })
}

function makeServiceRows(env: string) {
  const services = ['api-gateway', 'auth-service', 'data-pipeline', 'scheduler', 'notifier']
  const statusByEnv: Record<string, string[]> = {
    production: ['healthy', 'healthy', 'warning', 'healthy', 'healthy'],
    staging: ['healthy', 'healthy', 'healthy', 'error', 'healthy'],
    development: ['healthy', 'warning', 'healthy', 'healthy', 'healthy'],
  }
  const statuses = statusByEnv[env] ?? statusByEnv['production']
  return services.map((name, i) => ({
    service: name,
    status: statuses[i],
    requests: Math.round(800 + Math.random() * 4000),
    p99ms: Math.round(40 + Math.random() * 160),
    errors: Math.round(Math.random() * (statuses[i] === 'error' ? 200 : 8)),
    uptime: statuses[i] === 'error' ? '96.2%' : statuses[i] === 'warning' ? '99.1%' : '99.9%',
  }))
}

// ─── Dashboard config ─────────────────────────────────────────────────────────

const DASHBOARD_CONFIG: DashboardConfig = {
  schemaVersion: 1,
  id: 'infra-overview',
  title: 'Infrastructure Overview',
  description: '',
  tags: [],
  variables: [
    {
      name: 'env',
      type: 'custom',
      label: 'Environment',
      defaultValue: 'production',
      multi: false,
      includeAll: false,
      hide: 'none',
      sort: 'none',
      refreshOnTimeRangeChange: false,
      options: {
        values: ['production', 'staging', 'development'],
      },
      dataRequest: undefined,
      permissions: [],
    },
    {
      name: 'interval',
      type: 'custom',
      label: 'Interval',
      defaultValue: '1h',
      multi: false,
      includeAll: false,
      hide: 'none',
      sort: 'none',
      refreshOnTimeRangeChange: false,
      options: {
        values: ['5m', '1h', '6h', '24h'],
      },
      dataRequest: undefined,
      permissions: [],
    },
  ],
  panels: [
    { id: 'req-rate',    type: 'stat',       title: 'Request Rate',    description: '', gridPos: { x: 0,  y: 0, w: 6,  h: 4 },  dataRequests: [], options: {}, isRow: false, collapsed: false, repeatDirection: 'h', links: [], transparent: false, permissions: [] },
    { id: 'error-rate',  type: 'stat',       title: 'Error Rate',      description: '', gridPos: { x: 6,  y: 0, w: 6,  h: 4 },  dataRequests: [], options: {}, isRow: false, collapsed: false, repeatDirection: 'h', links: [], transparent: false, permissions: [] },
    { id: 'p99-latency', type: 'stat',       title: 'P99 Latency',     description: '', gridPos: { x: 12, y: 0, w: 6,  h: 4 },  dataRequests: [], options: {}, isRow: false, collapsed: false, repeatDirection: 'h', links: [], transparent: false, permissions: [] },
    { id: 'active-svcs', type: 'stat',       title: 'Active Services', description: '', gridPos: { x: 18, y: 0, w: 6,  h: 4 },  dataRequests: [], options: {}, isRow: false, collapsed: false, repeatDirection: 'h', links: [], transparent: false, permissions: [] },
    { id: 'latency-ts',  type: 'timeseries', title: 'Latency over Time', description: '', gridPos: { x: 0,  y: 4, w: 16, h: 10 }, dataRequests: [], options: {}, isRow: false, collapsed: false, repeatDirection: 'h', links: [], transparent: false, permissions: [] },
    { id: 'req-by-svc',  type: 'bar',        title: 'Requests by Service', description: '', gridPos: { x: 16, y: 4, w: 8,  h: 10 }, dataRequests: [], options: {}, isRow: false, collapsed: false, repeatDirection: 'h', links: [], transparent: false, permissions: [] },
    { id: 'svc-table',   type: 'table',      title: 'Service Health',  description: '', gridPos: { x: 0,  y: 14, w: 24, h: 9 },  dataRequests: [], options: {}, isRow: false, collapsed: false, repeatDirection: 'h', links: [], transparent: false, permissions: [] },
  ],
  layout: { cols: 24, rowHeight: 30 },
  timeRange: { from: 'now-6h', to: 'now' },
  refresh: '',
  links: [],
  permissions: [],
  annotations: [],
}

// ─── Panel data ───────────────────────────────────────────────────────────────

type PanelData = {
  'req-rate':    { value: number; change: number }
  'error-rate':  { value: number; unit: string; change: number }
  'p99-latency': { value: number; unit: string; change: number }
  'active-svcs': { value: number }
  'latency-ts':  { points: TimeSeriesPoint[]; series: { key: string; label: string; color: string }[] }
  'req-by-svc':  { data: { label: string; value: number }[] }
  'svc-table':   { rows: ReturnType<typeof makeServiceRows> }
}

function buildPanelData(env: string): PanelData {
  const isProd = env === 'production'
  return {
    'req-rate':    { value: isProd ? 12840 : 3201, change: isProd ? +4.2 : -1.3 },
    'error-rate':  { value: isProd ? 0.38 : 1.12, unit: '%', change: isProd ? -0.05 : +0.3 },
    'p99-latency': { value: isProd ? 142 : 218, unit: 'ms', change: isProd ? -8 : +12 },
    'active-svcs': { value: 5 },
    'latency-ts': {
      points: makeTimeSeries(['p50', 'p95', 'p99']),
      series: [
        { key: 'p50', label: 'P50', color: 'oklch(0.6 0.15 220)' },
        { key: 'p95', label: 'P95', color: 'oklch(0.65 0.2 50)' },
        { key: 'p99', label: 'P99', color: 'oklch(0.55 0.25 27)' },
      ],
    },
    'req-by-svc': {
      data: [
        { label: 'api-gw',    value: 4820 },
        { label: 'auth',      value: 2130 },
        { label: 'pipeline',  value: 3410 },
        { label: 'scheduler', value: 980 },
        { label: 'notifier',  value: 1500 },
      ],
    },
    'svc-table': { rows: makeServiceRows(env) },
  }
}

// ─── Panel content renderer ───────────────────────────────────────────────────

function renderPanelContent(panelId: string, data: PanelData): React.ReactNode {
  switch (panelId) {
    case 'req-rate': {
      const d = data['req-rate']
      return <StatPanel value={d.value} unit="req/s" change={d.change} changeLabel="vs yesterday" />
    }
    case 'error-rate': {
      const d = data['error-rate']
      return <StatPanel value={d.value} unit={d.unit} change={d.change} changeLabel="vs yesterday" color={d.value > 1 ? 'oklch(0.577 0.245 27)' : undefined} />
    }
    case 'p99-latency': {
      const d = data['p99-latency']
      return <StatPanel value={d.value} unit={d.unit} change={d.change} changeLabel="vs yesterday" color={d.value > 200 ? 'oklch(0.65 0.2 50)' : undefined} />
    }
    case 'active-svcs': {
      const d = data['active-svcs']
      return <StatPanel value={d.value} unit="services" />
    }
    case 'latency-ts': {
      const d = data['latency-ts']
      return <TimeSeriesPanel data={d.points} series={d.series} unit="ms" />
    }
    case 'req-by-svc': {
      const d = data['req-by-svc']
      return <BarChartPanel data={d.data} unit=" req" />
    }
    case 'svc-table': {
      const d = data['svc-table']
      return (
        <TablePanel
          columns={[
            { key: 'service',  label: 'Service' },
            { key: 'status',   label: 'Status',      render: (v) => <StatusBadge value={String(v)} /> },
            { key: 'requests', label: 'Requests/s',  align: 'right', render: (v) => Number(v).toLocaleString() },
            { key: 'p99ms',    label: 'P99 (ms)',    align: 'right' },
            { key: 'errors',   label: 'Errors',      align: 'right', render: (v) => (
              <span className={Number(v) > 50 ? 'text-destructive font-medium' : undefined}>{String(v)}</span>
            )},
            { key: 'uptime',   label: 'Uptime',      align: 'right' },
          ]}
          rows={d.rows as Record<string, unknown>[]}
        />
      )
    }
    default:
      return null
  }
}

// ─── Variable toolbar ─────────────────────────────────────────────────────────

function VariableSelect({ engine, name, className }: {
  engine: CoreEngineAPI
  name: string
  className?: string
}) {
  const { value, options, setValue } = useVariable(engine, name)
  return (
    <Select value={value as string} onValueChange={(v) => v !== null && setValue(v)}>
      <SelectTrigger className={['h-7 text-xs', className].filter(Boolean).join(' ')}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// ─── Demo component ───────────────────────────────────────────────────────────

export function DashboardBodyTemplateDemo({ theme }: { theme?: React.CSSProperties }) {
  const engineRef = useRef(createDashboardEngine({ variableTypes: builtinVariableTypes }))
  const engine = engineRef.current

  useLoadDashboard(engine, DASHBOARD_CONFIG)

  const envVar = useVariable(engine, 'env')
  const env = (envVar.value as string) ?? 'production'
  const panelData = useMemo(() => buildPanelData(env), [env])

  const [editable, setEditable] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(() => new Date())
  const refresh = () => setLastRefresh(new Date())
  lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return (
    <DashboardBodyTemplate
      theme={theme}
      className="layout-dashboard"
      topBar={
        <PageTopBar
          left="Infrastructure / Overview"
          right={
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-xs">Last 6h</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" onClick={refresh}>
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
              <Button
                variant={editable ? 'default' : 'outline'}
                size="sm"
                className="h-7 gap-1.5 text-xs"
                onClick={() => setEditable((e) => !e)}
              >
                {editable ? <Check className="h-3.5 w-3.5" /> : <PencilLine className="h-3.5 w-3.5" />}
                {editable ? 'Done' : 'Edit'}
              </Button>
            </div>
          }
        />
      }
      variableBar={
        <>
          <span className="text-xs text-muted-foreground">env</span>
          <VariableSelect engine={engine} name="env" className="w-32" />
          <span className="text-xs text-muted-foreground ml-2">interval</span>
          <VariableSelect engine={engine} name="interval" className="w-20" />
        </>
      }
      contentClassName="pb-6"
    >
      <DashboardGrid engine={engine} editable={editable}>
        {({ panelId, loading, error, ref }) => {
          const panel = DASHBOARD_CONFIG.panels.find((p) => p.id === panelId)
          if (!panel) return null
          return (
            <DashboardPanel
              ref={ref}
              title={panel.title}
              loading={loading}
              error={error ?? undefined}
              editable={editable}
              headerRight={
                <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground/60 hover:text-foreground">
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              }
              style={{ height: '100%' }}
            >
              {renderPanelContent(panelId, panelData)}
            </DashboardPanel>
          )
        }}
      </DashboardGrid>
    </DashboardBodyTemplate>
  )
}

export function buildDashboardTemplateCode({ layoutClassName, themeProp }: TemplateCodeContext) {
  return [
    `import { DashboardBodyTemplate, DashboardPanel, PageTopBar } from '@loykin/designkit'`,
    `import { createDashboardEngine, builtinVariableTypes } from '@loykin/dashboardkit'`,
    `import { useLoadDashboard, useVariable, DashboardGrid } from '@loykin/dashboardkit/react'`,
    `import '@loykin/designkit/styles'`,
    `import 'react-grid-layout/css/styles.css'`,
    ``,
    `const engine = createDashboardEngine({ variableTypes: builtinVariableTypes })`,
    ``,
    `export function MyDashboard() {`,
    `  useLoadDashboard(engine, config)`,
    `  const envVar = useVariable(engine, 'env')`,
    `  const [editable, setEditable] = useState(false)`,
    ``,
    `  return (`,
    `    <DashboardBodyTemplate${themeProp}`,
    `      className="${layoutClassName}"`,
    `      topBar={<PageTopBar left="My Dashboard" />}`,
    `      title="Overview"`,
    `      toolbar={/* variable dropdowns, time range, edit/refresh */}`,
    `    >`,
    `      <DashboardGrid engine={engine} editable={editable}>`,
    `        {({ panelId, loading, error }) => (`,
    `          <DashboardPanel title={panelId} loading={loading} error={error ?? undefined}`,
    `            style={{ height: '100%' }}>`,
    `            {/* your panel content */}`,
    `          </DashboardPanel>`,
    `        )}`,
    `      </DashboardGrid>`,
    `    </DashboardBodyTemplate>`,
    `  )`,
    `}`,
  ].join('\n')
}
