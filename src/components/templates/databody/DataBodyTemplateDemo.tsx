import {
  DataGrid,
  DataGridCard,
  DataGridPaginationCompact,
  GlobalSearch,
  type DataGridColumnDef,
} from '@loykin/gridkit'
import type { Table as TanStackTable } from '@tanstack/react-table'
import { DataBodyTemplate } from './DataBodyTemplate'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'

export interface DataBodyTemplateDemoProps {
  theme?: React.CSSProperties
}

type User = {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  joined: string
}

const users: User[] = [
  { id: '1', name: 'Sarah Kim', email: 'sarah@acme.com', role: 'Admin', status: 'active', joined: 'Jan 12, 2024' },
  { id: '2', name: 'Marcus Lee', email: 'marcus@acme.com', role: 'Editor', status: 'active', joined: 'Feb 3, 2024' },
  { id: '3', name: 'Ji-Yeon Park', email: 'jiyeon@acme.com', role: 'Viewer', status: 'inactive', joined: 'Mar 18, 2024' },
  { id: '4', name: 'Alex Chen', email: 'alex@acme.com', role: 'Editor', status: 'pending', joined: 'Apr 7, 2024' },
]

const statusVariant = { active: 'default', pending: 'secondary', inactive: 'outline' } as const

const userColumns: DataGridColumnDef<User>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <Badge variant="outline" className="text-xs font-normal">{row.original.role}</Badge>,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]} className="text-xs capitalize">
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: 'joined',
    accessorKey: 'joined',
    header: 'Joined',
    cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.joined}</span>,
  },
]

const leftFilters = (table: TanStackTable<User>) => (
  <GlobalSearch table={table} placeholder="Search..." />
)

const rightFilters = () => (
  <Button size="sm" className="h-8 gap-1.5 text-xs">
    <Plus className="h-3.5 w-3.5" />
    Add User
  </Button>
)

function UserTable() {
  return (
    <DataGrid
      data={users}
      columns={userColumns}
      getRowId={(row) => row.id}
      tableHeight={420}
      rowHeight={36}
      enableSorting
      tableWidthMode="fill-last"
      leftFilters={leftFilters}
      rightFilters={rightFilters}
      pagination={{ pageSize: 10 }}
      footer={(table) => (
        <div className="flex h-9 items-center justify-between px-1 text-xs text-muted-foreground">
          <span>{users.length} results</span>
          <DataGridPaginationCompact table={table} />
        </div>
      )}
    />
  )
}

function UserCards() {
  return (
    <DataGridCard
      data={users}
      columns={userColumns}
      getRowId={(row) => row.id}
      tableHeight={420}
      rowHeight={36}
      enableSorting
      tableWidthMode="fill-last"
      leftFilters={leftFilters}
      rightFilters={rightFilters}
      minCardWidth={220}
      minColumns={2}
      renderCard={(row) => (
        <Card size="sm" className="h-full rounded-lg border border-border shadow-sm ring-0">
          <CardContent className="py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{row.original.name}</p>
                <p className="truncate text-xs text-muted-foreground">{row.original.email}</p>
              </div>
              <Badge variant={statusVariant[row.original.status]} className="text-xs capitalize">
                {row.original.status}
              </Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-muted-foreground">Role</p>
                <p className="mt-0.5 font-medium">{row.original.role}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Joined</p>
                <p className="mt-0.5 font-medium">{row.original.joined}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    />
  )
}

function CustomContent() {
  return (
    <Card className="rounded-lg border border-border ring-0">
      <CardContent className="grid gap-3 p-4 md:grid-cols-3">
        {['Header', 'Tabs', 'Content'].map((label) => (
          <div key={label} className="rounded-lg border bg-muted/30 p-3">
            <p className="text-sm font-medium">{label}</p>
            <p className="mt-1 text-xs text-muted-foreground">ReactNode slot</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function DataBodyTemplateDemo({ theme }: DataBodyTemplateDemoProps) {
  return (
    <DataBodyTemplate
      theme={theme}
      breadcrumb="Design / Body Template"
      title="Body Template"
      description="Compound body shell with optional tabs and arbitrary content"
    >
      <DataBodyTemplate.Tab id="table" label="Table" count={users.length}>
        <UserTable />
      </DataBodyTemplate.Tab>
      <DataBodyTemplate.Tab id="cards" label="Cards" count={users.length}>
        <UserCards />
      </DataBodyTemplate.Tab>
      <DataBodyTemplate.Tab id="custom" label="Custom">
        <CustomContent />
      </DataBodyTemplate.Tab>
    </DataBodyTemplate>
  )
}
