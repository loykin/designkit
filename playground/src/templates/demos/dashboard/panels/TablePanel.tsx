import { Badge } from '@loykin/designkit'
import { cn } from '@loykin/designkit'

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
