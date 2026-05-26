import React, { useState, useMemo } from 'react'
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
import { createDashboardEngine } from '@loykin/dashboardkit'
import { useLoadDashboard, useVariable, DashboardGrid } from '@loykin/dashboardkit/react'
import type { PanelViewerProps, CoreEngineAPI, DashboardConfig } from '@loykin/dashboardkit'
import { RefreshCw, Clock, PencilLine, Check, MoreVertical } from 'lucide-react'
import { statPlugin } from './panels/StatPanel'
import { timeSeriesPlugin } from './panels/TimeSeriesPanel'
import { barChartPlugin } from './panels/BarChartPanel'
import { tablePlugin } from './panels/TablePanel'
import type { TemplateCodeContext } from '../../code'

// ─── Engine (module-level, stable reference) ──────────────────────────────────

const engine = createDashboardEngine()
engine.registerPanel(statPlugin)
engine.registerPanel(timeSeriesPlugin)
engine.registerPanel(barChartPlugin)
engine.registerPanel(tablePlugin)

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
      options: { values: ['production', 'staging', 'development'] },
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
      options: { values: ['5m', '1h', '6h', '24h'] },
      dataRequest: undefined,
      permissions: [],
    },
  ],
  panels: [
    {
      id: 'req-rate', type: 'stat', title: 'Request Rate', description: '',
      gridPos: { x: 0, y: 0, w: 6, h: 4 },
      dataRequests: [], isRow: false, collapsed: false, repeatDirection: 'h', links: [], transparent: false, permissions: [],
      options: {
        unit: 'req/s',
        dataByEnv: {
          production:  { value: 12840, change: 4.2,  changeLabel: 'vs yesterday' },
          staging:     { value: 3201,  change: -1.3, changeLabel: 'vs yesterday' },
          development: { value: 3201,  change: -1.3, changeLabel: 'vs yesterday' },
        },
      },
    },
    {
      id: 'error-rate', type: 'stat', title: 'Error Rate', description: '',
      gridPos: { x: 6, y: 0, w: 6, h: 4 },
      dataRequests: [], isRow: false, collapsed: false, repeatDirection: 'h', links: [], transparent: false, permissions: [],
      options: {
        unit: '%',
        threshold: { value: 1, color: 'oklch(0.577 0.245 27)' },
        dataByEnv: {
          production:  { value: 0.38, change: -0.05, changeLabel: 'vs yesterday' },
          staging:     { value: 1.12, change: 0.3,   changeLabel: 'vs yesterday' },
          development: { value: 1.12, change: 0.3,   changeLabel: 'vs yesterday' },
        },
      },
    },
    {
      id: 'p99-latency', type: 'stat', title: 'P99 Latency', description: '',
      gridPos: { x: 12, y: 0, w: 6, h: 4 },
      dataRequests: [], isRow: false, collapsed: false, repeatDirection: 'h', links: [], transparent: false, permissions: [],
      options: {
        unit: 'ms',
        threshold: { value: 200, color: 'oklch(0.65 0.2 50)' },
        dataByEnv: {
          production:  { value: 142, change: -8,  changeLabel: 'vs yesterday' },
          staging:     { value: 218, change: 12,  changeLabel: 'vs yesterday' },
          development: { value: 218, change: 12,  changeLabel: 'vs yesterday' },
        },
      },
    },
    {
      id: 'active-svcs', type: 'stat', title: 'Active Services', description: '',
      gridPos: { x: 18, y: 0, w: 6, h: 4 },
      dataRequests: [], isRow: false, collapsed: false, repeatDirection: 'h', links: [], transparent: false, permissions: [],
      options: {
        unit: 'services',
        dataByEnv: {
          production: { value: 5 }, staging: { value: 5 }, development: { value: 5 },
        },
      },
    },
    {
      id: 'latency-ts', type: 'timeseries', title: 'Latency over Time', description: '',
      gridPos: { x: 0, y: 4, w: 16, h: 10 },
      dataRequests: [], isRow: false, collapsed: false, repeatDirection: 'h', links: [], transparent: false, permissions: [],
      options: {
        unit: 'ms',
        series: [
          { key: 'p50', label: 'P50', color: 'oklch(0.6 0.15 220)' },
          { key: 'p95', label: 'P95', color: 'oklch(0.65 0.2 50)' },
          { key: 'p99', label: 'P99', color: 'oklch(0.55 0.25 27)' },
        ],
      },
    },
    {
      id: 'req-by-svc', type: 'bar', title: 'Requests by Service', description: '',
      gridPos: { x: 16, y: 4, w: 8, h: 10 },
      dataRequests: [], isRow: false, collapsed: false, repeatDirection: 'h', links: [], transparent: false, permissions: [],
      options: {
        unit: ' req',
        data: [
          { label: 'api-gw',    value: 4820 },
          { label: 'auth',      value: 2130 },
          { label: 'pipeline',  value: 3410 },
          { label: 'scheduler', value: 980 },
          { label: 'notifier',  value: 1500 },
        ],
      },
    },
    {
      id: 'svc-table', type: 'table', title: 'Service Health', description: '',
      gridPos: { x: 0, y: 14, w: 24, h: 9 },
      dataRequests: [], isRow: false, collapsed: false, repeatDirection: 'h', links: [], transparent: false, permissions: [],
      options: {
        columns: [
          { key: 'service',  label: 'Service' },
          { key: 'status',   label: 'Status',      type: 'status' },
          { key: 'requests', label: 'Requests/s',  align: 'right', type: 'localeNumber' },
          { key: 'p99ms',    label: 'P99 (ms)',    align: 'right' },
          { key: 'errors',   label: 'Errors',      align: 'right', type: 'errors' },
          { key: 'uptime',   label: 'Uptime',      align: 'right' },
        ],
      },
    },
  ],
  layout: { cols: 24, rowHeight: 30 },
  timeRange: { from: 'now-6h', to: 'now' },
  refresh: '',
  links: [],
  permissions: [],
  annotations: [],
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
  useLoadDashboard(engine, DASHBOARD_CONFIG)

  const envVar      = useVariable(engine, 'env')
  const intervalVar = useVariable(engine, 'interval')
  const variables   = useMemo<Record<string, string | string[]>>(() => ({
    env:      (envVar.value      as string) ?? 'production',
    interval: (intervalVar.value as string) ?? '1h',
  }), [envVar.value, intervalVar.value])

  const [editable, setEditable] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(() => new Date())
  const refresh = () => setLastRefresh(new Date())

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
                <span className="text-xs">
                  {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
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
        {({ panelType, config, data, rawData, loading, error, ref }) => {
          const plugin = engine.getPanelPlugin(panelType)
          const Viewer = plugin?.viewer as React.FC<PanelViewerProps<unknown, unknown>> | undefined
          return (
            <DashboardPanel
              ref={ref}
              title={config.title}
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
              {Viewer && (
                <Viewer
                  panel={config}
                  options={config.options}
                  data={data}
                  rawData={rawData}
                  width={0}
                  height={0}
                  loading={loading}
                  error={error}
                  variables={variables}
                />
              )}
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
    `import { createDashboardEngine } from '@loykin/dashboardkit'`,
    `import { useLoadDashboard, useVariable, DashboardGrid } from '@loykin/dashboardkit/react'`,
    `import type { PanelViewerProps } from '@loykin/dashboardkit'`,
    `import '@loykin/designkit/styles'`,
    `import '@loykin/dashboardkit/styles'`,
    ``,
    `// Register panel plugins once at module level`,
    `const engine = createDashboardEngine()`,
    `engine.registerPanel(statPlugin)`,
    `engine.registerPanel(timeSeriesPlugin)`,
    `// ... register more panel types`,
    ``,
    `export function MyDashboard() {`,
    `  useLoadDashboard(engine, config)`,
    `  const envVar = useVariable(engine, 'env')`,
    `  const variables = { env: envVar.value ?? 'production' }`,
    `  const [editable, setEditable] = useState(false)`,
    ``,
    `  return (`,
    `    <DashboardBodyTemplate${themeProp}`,
    `      className="${layoutClassName}"`,
    `      topBar={<PageTopBar left="My Dashboard" right={/* edit / refresh */} />}`,
    `      variableBar={/* <VariableSelect> components */}`,
    `    >`,
    `      <DashboardGrid engine={engine} editable={editable}>`,
    `        {({ panelType, config, data, rawData, loading, error, ref }) => {`,
    `          const plugin = engine.getPanelPlugin(panelType)`,
    `          const Viewer = plugin?.viewer as React.FC<PanelViewerProps<unknown, unknown>> | undefined`,
    `          return (`,
    `            <DashboardPanel ref={ref} title={config.title} loading={loading}`,
    `              error={error ?? undefined} editable={editable} style={{ height: '100%' }}>`,
    `              {Viewer && <Viewer panel={config} options={config.options}`,
    `                data={data} rawData={rawData} width={0} height={0}`,
    `                loading={loading} error={error} variables={variables} />}`,
    `            </DashboardPanel>`,
    `          )`,
    `        }}`,
    `      </DashboardGrid>`,
    `    </DashboardBodyTemplate>`,
    `  )`,
    `}`,
  ].join('\n')
}
