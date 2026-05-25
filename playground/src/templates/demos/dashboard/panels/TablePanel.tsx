import { useMemo } from 'react'
import { Badge } from '@loykin/designkit'
import { cn } from '@loykin/designkit'
import type { PanelViewerProps, PanelPluginDef } from '@loykin/dashboardkit'

export interface TableColumn<T> {
  key: keyof T
  label: string
  align?: 'left' | 'right' | 'center'
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

export interface TablePanelProps<T extends Record<string, unknown>> {
  columns: TableColumn<T>[]
  rows: T[]
}

export function TablePanel<T extends Record<string, unknown>>({ columns, rows }: TablePanelProps<T>) {
  return (
    <div className="h-full overflow-auto">
      <table className="w-full text-xs border-collapse">
        <thead className="sticky top-0 bg-card z-10">
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  'px-2 py-1.5 font-medium text-muted-foreground whitespace-nowrap',
                  col.align === 'right' && 'text-right',
                  col.align === 'center' && 'text-center',
                  !col.align && 'text-left',
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-border/40 hover:bg-muted/30 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={cn(
                    'px-2 py-1.5 text-card-foreground',
                    col.align === 'right' && 'text-right tabular-nums',
                    col.align === 'center' && 'text-center',
                  )}
                >
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

function makeServiceRows(env: string) {
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

export interface TableColumnDef {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
  /** Rendering hint: 'status' → badge, 'errors' → colored number, 'localeNumber' → toLocaleString */
  type?: 'status' | 'errors' | 'localeNumber'
}

export interface TablePanelOptions extends Record<string, unknown> {
  columns: TableColumnDef[]
}

function TableViewer({ options, variables }: PanelViewerProps<TablePanelOptions, unknown>) {
  const env = (variables.env as string) ?? 'production'
  const rows = useMemo(() => makeServiceRows(env), [env])
  const columns = options.columns.map((col) => ({
    key:   col.key as keyof Record<string, unknown>,
    label: col.label,
    align: col.align,
    render:
      col.type === 'status'      ? (v: unknown) => <StatusBadge value={String(v)} /> :
      col.type === 'errors'      ? (v: unknown) => (
        <span className={Number(v) > 50 ? 'text-destructive font-medium' : undefined}>{String(v)}</span>
      ) :
      col.type === 'localeNumber'? (v: unknown) => Number(v).toLocaleString() :
      undefined,
  }))
  return <TablePanel columns={columns} rows={rows as Record<string, unknown>[]} />
}

export const tablePlugin: PanelPluginDef<TablePanelOptions, unknown> = {
  id: 'table',
  name: 'Table',
  optionsSchema: {},
  viewer: TableViewer,
}

// ── Status badge helper ────────────────────────────────────────────────────────

const statusMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  healthy: 'default',
  ok: 'default',
  warning: 'secondary',
  error: 'destructive',
  critical: 'destructive',
  unknown: 'outline',
}

export function StatusBadge({ value }: { value: string }) {
  const variant = statusMap[value.toLowerCase()] ?? 'outline'
  return (
    <Badge variant={variant} className="text-[10px] px-1.5 py-0 capitalize">
      {value}
    </Badge>
  )
}
