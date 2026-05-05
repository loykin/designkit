import { useMemo } from 'react'
import {
  DataGrid,
  DataGridPaginationPages,
  type DataGridColumnDef,
} from '@loykin/gridkit'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Download } from 'lucide-react'

// ─── Public API ───────────────────────────────────────────────────────────────

export interface TableColumn<T> {
  key:     keyof T & string
  label:   string
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

export interface TableBodyTemplateProps<T extends Record<string, unknown> = DemoRow> {
  /** CSS custom properties applied to root — use to configure theme tokens */
  theme?:      React.CSSProperties
  title?:      string
  actions?:    React.ReactNode
  columns?:    TableColumn<T>[]
  data?:       T[]
  rowKey?:     keyof T & string
  totalCount?: number
  pagination?: React.ReactNode
}

// ─── Demo defaults ────────────────────────────────────────────────────────────

type DemoRow = {
  id: string; name: string; email: string
  role: string; status: 'active' | 'inactive' | 'pending'; joined: string
}

const demoData: DemoRow[] = [
  { id: '1',  name: 'Sarah Kim',    email: 'sarah@acme.com',   role: 'Admin',  status: 'active',   joined: 'Jan 12, 2024' },
  { id: '2',  name: 'Marcus Lee',   email: 'marcus@acme.com',  role: 'Editor', status: 'active',   joined: 'Feb 3, 2024'  },
  { id: '3',  name: 'Ji-Yeon Park', email: 'jiyeon@acme.com',  role: 'Viewer', status: 'inactive', joined: 'Mar 18, 2024' },
  { id: '4',  name: 'Alex Chen',    email: 'alex@acme.com',    role: 'Editor', status: 'active',   joined: 'Apr 7, 2024'  },
  { id: '5',  name: 'Dana White',   email: 'dana@acme.com',    role: 'Viewer', status: 'pending',  joined: 'Apr 29, 2024' },
  { id: '6',  name: 'Leo Torres',   email: 'leo@acme.com',     role: 'Admin',  status: 'inactive', joined: 'May 1, 2024'  },
  { id: '7',  name: 'Mina Seo',     email: 'mina@acme.com',    role: 'Editor', status: 'active',   joined: 'May 2, 2024'  },
  { id: '8',  name: 'Ryan Patel',   email: 'ryan@acme.com',    role: 'Viewer', status: 'active',   joined: 'May 15, 2024' },
  { id: '9',  name: 'Yuna Choi',    email: 'yuna@acme.com',    role: 'Editor', status: 'pending',  joined: 'Jun 3, 2024'  },
  { id: '10', name: 'Tom Fischer',  email: 'tom@acme.com',     role: 'Viewer', status: 'active',   joined: 'Jun 20, 2024' },
]

const statusVariant = { active: 'default', pending: 'secondary', inactive: 'outline' } as const

const demoColumns: TableColumn<DemoRow>[] = [
  { key: 'name',   label: 'Name',   render: (v) => <span className="font-medium">{v as string}</span> },
  { key: 'email',  label: 'Email',  render: (v) => <span className="text-muted-foreground">{v as string}</span> },
  { key: 'role',   label: 'Role',   render: (v) => <Badge variant="outline" className="text-xs font-normal">{v as string}</Badge> },
  { key: 'status', label: 'Status', render: (v) => (
    <Badge variant={statusVariant[v as DemoRow['status']]} className="text-xs capitalize">{v as string}</Badge>
  )},
  { key: 'joined', label: 'Joined', render: (v) => <span className="text-muted-foreground text-xs">{v as string}</span> },
]

// ─── Template ─────────────────────────────────────────────────────────────────

export function TableBodyTemplate<T extends Record<string, unknown> = DemoRow>({
  theme,
  title      = 'Users',
  actions,
  columns    = demoColumns as unknown as TableColumn<T>[],
  data       = demoData as unknown as T[],
  rowKey     = 'id' as keyof T & string,
  totalCount,
  pagination,
}: TableBodyTemplateProps<T>) {
  const gridColumns = useMemo<DataGridColumnDef<T>[]>(() => (
    columns.map((col) => ({
      accessorKey: col.key,
      header: col.label,
      cell: (ctx) => {
        const row = ctx.row.original
        const value = row[col.key]
        return col.render ? col.render(value, row) : String(value ?? '')
      },
    }))
  ), [columns])

  return (
    <div className="layout-table h-full flex flex-col bg-background text-foreground" style={theme}>
      <div className="flex items-center gap-2 px-6 py-3 border-b shrink-0">
        <h1 className="text-sm font-semibold mr-auto">{title}</h1>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search…" className="pl-8 h-8 w-52 text-xs" />
        </div>
        {actions ?? (
          <>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <Download className="h-3.5 w-3.5" />Export
            </Button>
            <Button size="sm" className="h-8 gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" />Add User
            </Button>
          </>
        )}
      </div>

      <div className="flex-1 overflow-hidden p-6">
        <DataGrid
          data={data}
          columns={gridColumns}
          getRowId={(row, index) => String(row[rowKey] ?? index)}
          tableHeight="100%"
          rowHeight={36}
          bordered
          enableSorting
          tableWidthMode="fill-last"
          pagination={{ pageSize: 10 }}
          footer={(table) => (
            pagination ?? (
              <div className="flex h-10 items-center justify-between border-t px-3 text-xs text-muted-foreground">
                <span>{totalCount ?? data.length} results</span>
                <DataGridPaginationPages table={table} />
              </div>
            )
          )}
        />
      </div>
    </div>
  )
}
