import { useMemo } from 'react'
import { DataGrid, type DataGridColumnDef } from '@loykin/gridkit'
import { Badge } from '@loykin/designkit'
import type { PanelViewerProps, PanelPluginDef } from '@loykin/dashboardkit'

// ─── Data ─────────────────────────────────────────────────────────────────────

type ServiceRow = {
  service:  string
  status:   string
  requests: number
  p99ms:    number
  errors:   number
  uptime:   string
}

function makeServiceRows(env: string): ServiceRow[] {
  const services = ['api-gateway', 'auth-service', 'data-pipeline', 'scheduler', 'notifier']
  const statusByEnv: Record<string, string[]> = {
    production:  ['healthy', 'healthy', 'warning', 'healthy', 'healthy'],
    staging:     ['healthy', 'healthy', 'healthy', 'error',   'healthy'],
    development: ['healthy', 'warning', 'healthy', 'healthy', 'healthy'],
  }
  const statuses = statusByEnv[env] ?? statusByEnv['production']
  return services.map((name, i) => ({
    service:  name,
    status:   statuses[i],
    requests: Math.round(800 + Math.random() * 4000),
    p99ms:    Math.round(40 + Math.random() * 160),
    errors:   Math.round(Math.random() * (statuses[i] === 'error' ? 200 : 8)),
    uptime:   statuses[i] === 'error' ? '96.2%' : statuses[i] === 'warning' ? '99.1%' : '99.9%',
  }))
}

// ─── Columns ──────────────────────────────────────────────────────────────────

const statusMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  healthy: 'default', ok: 'default',
  warning: 'secondary',
  error: 'destructive', critical: 'destructive',
  unknown: 'outline',
}

const SERVICE_COLUMNS: DataGridColumnDef<ServiceRow>[] = [
  {
    id: 'service', accessorKey: 'service', header: 'Service',
    cell: ({ row }) => <span className="font-medium">{row.original.service}</span>,
  },
  {
    id: 'status', accessorKey: 'status', header: 'Status',
    cell: ({ row }) => {
      const v = row.original.status
      return (
        <Badge variant={statusMap[v.toLowerCase()] ?? 'outline'} className="text-[10px] px-1.5 py-0 capitalize">
          {v}
        </Badge>
      )
    },
  },
  {
    id: 'requests', accessorKey: 'requests', header: 'Requests/s',
    meta: { align: 'right' },
    cell: ({ row }) => row.original.requests.toLocaleString(),
  },
  {
    id: 'p99ms', accessorKey: 'p99ms', header: 'P99 (ms)',
    meta: { align: 'right' },
    cell: ({ row }) => row.original.p99ms,
  },
  {
    id: 'errors', accessorKey: 'errors', header: 'Errors',
    meta: { align: 'right' },
    cell: ({ row }) => (
      <span className={row.original.errors > 50 ? 'text-destructive font-medium' : undefined}>
        {row.original.errors}
      </span>
    ),
  },
  {
    id: 'uptime', accessorKey: 'uptime', header: 'Uptime',
    meta: { align: 'right' },
    cell: ({ row }) => row.original.uptime,
  },
]

// ─── Plugin ───────────────────────────────────────────────────────────────────

export interface TablePanelOptions extends Record<string, unknown> {
  columns: { key: string; label: string; align?: string; type?: string }[]
}

function TableViewer({ variables }: PanelViewerProps<TablePanelOptions, unknown>) {
  const env = (variables.env as string) ?? 'production'
  const rows = useMemo(() => makeServiceRows(env), [env])
  return (
    <div style={{ '--gridkit-container-border': 'transparent', '--gridkit-radius': '0px', '--gridkit-header-background': 'transparent' } as React.CSSProperties} className="h-full">
      <DataGrid<ServiceRow>
        data={rows}
        columns={SERVICE_COLUMNS}
        getRowId={(row) => row.service}
        fillParent
        rowHeight={36}
        styles={{ header: { borderTop: '1px solid var(--border)' } }}
      />
    </div>
  )
}

export const tablePlugin: PanelPluginDef<TablePanelOptions, unknown> = {
  id: 'table',
  name: 'Table',
  optionsSchema: {},
  viewer: TableViewer,
}
