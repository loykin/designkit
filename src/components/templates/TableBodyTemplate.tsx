import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Search, Plus, Download, MoreHorizontal, ArrowUpDown } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TableColumn<T> {
  key: keyof T
  label: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

export interface TableBodyTemplateProps<T extends Record<string, unknown>> {
  /** Toolbar: title shown on the left */
  title?: string
  /** Toolbar: action buttons on the right */
  actions?: React.ReactNode
  /** Column definitions */
  columns?: TableColumn<T>[]
  /** Row data */
  data?: T[]
  /** Row key field */
  rowKey?: keyof T
}

// ─── Demo defaults ────────────────────────────────────────────────────────────

type DemoRow = { id: string; name: string; email: string; role: string; status: string; joined: string }

const demoColumns: TableColumn<DemoRow>[] = [
  { key: 'name',   label: 'Name' },
  { key: 'email',  label: 'Email',  render: (v) => <span className="text-muted-foreground">{v as string}</span> },
  { key: 'role',   label: 'Role',   render: (v) => <Badge variant="outline">{v as string}</Badge> },
  { key: 'status', label: 'Status', render: (v) => (
    <span className={`inline-flex px-2 py-0.5 rounded-[--radius] text-xs font-medium border ${
      v === 'active' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-300/30'
                     : 'bg-muted text-muted-foreground border-border'}`}>
      {v as string}
    </span>
  )},
  { key: 'joined', label: 'Joined', render: (v) => <span className="text-muted-foreground text-xs">{v as string}</span> },
]

const demoData: DemoRow[] = [
  { id: '1', name: 'Sarah Kim',    email: 'sarah@acme.com',   role: 'Admin',    status: 'active',   joined: 'Jan 12, 2024' },
  { id: '2', name: 'Marcus Lee',   email: 'marcus@acme.com',  role: 'Editor',   status: 'active',   joined: 'Feb 3, 2024'  },
  { id: '3', name: 'Ji-Yeon Park', email: 'jiyeon@acme.com',  role: 'Viewer',   status: 'inactive', joined: 'Mar 18, 2024' },
  { id: '4', name: 'Alex Chen',    email: 'alex@acme.com',    role: 'Editor',   status: 'active',   joined: 'Apr 7, 2024'  },
  { id: '5', name: 'Dana White',   email: 'dana@acme.com',    role: 'Viewer',   status: 'active',   joined: 'Apr 29, 2024' },
  { id: '6', name: 'Leo Torres',   email: 'leo@acme.com',     role: 'Admin',    status: 'inactive', joined: 'May 1, 2024'  },
  { id: '7', name: 'Mina Seo',     email: 'mina@acme.com',    role: 'Editor',   status: 'active',   joined: 'May 2, 2024'  },
]

// ─── Template ─────────────────────────────────────────────────────────────────

export function TableBodyTemplate<T extends Record<string, unknown>>({
  title = 'Users',
  actions,
  columns = demoColumns as unknown as TableColumn<T>[],
  data = demoData as unknown as T[],
  rowKey = 'id' as keyof T,
}: TableBodyTemplateProps<T>) {
  return (
    <div className="h-full flex flex-col gap-4 p-6">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold mr-auto">{title}</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9 h-9 w-56" />
        </div>
        {actions ?? (
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />Export
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />Add User
            </Button>
          </>
        )}
      </div>

      {/* Table */}
      <Card className="flex-1 overflow-hidden">
        <div className="overflow-auto h-full">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 sticky top-0">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" className="rounded" />
                </th>
                {columns.map((col) => (
                  <th key={String(col.key)} className="text-left px-4 py-3 font-medium text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                      {col.label}
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                ))}
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={String(row[rowKey])} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded" />
                  </td>
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3">
                      {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <button className="h-7 w-7 rounded-[--radius] flex items-center justify-center hover:bg-accent transition-colors">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{data.length} results</span>
        <div className="flex items-center gap-1">
          {['Prev', '1', '2', '3', 'Next'].map((p) => (
            <button key={p} className={`px-3 py-1 rounded-[--radius] text-xs transition-colors ${
              p === '1' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
