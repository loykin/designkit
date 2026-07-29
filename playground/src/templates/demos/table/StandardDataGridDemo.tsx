import type { CSSProperties } from 'react'
import {
  DataGrid,
  DataGridPaginationCompact,
  GlobalSearch,
  type DataGridColumnDef,
} from '@loykin/gridkit'
import type { Table as TanStackTable } from '@tanstack/react-table'
import {
  Badge,
  Button,
  DataBodyTemplate,
  PageTopBar,
  buildTopBar,
} from '@loykin/designkit'
import { Download, Plus } from 'lucide-react'

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
  { id: '4', name: 'Alex Chen', email: 'alex@acme.com', role: 'Editor', status: 'active', joined: 'Apr 7, 2024' },
  { id: '5', name: 'Dana White', email: 'dana@acme.com', role: 'Viewer', status: 'pending', joined: 'Apr 29, 2024' },
  { id: '6', name: 'Leo Torres', email: 'leo@acme.com', role: 'Admin', status: 'inactive', joined: 'May 1, 2024' },
  { id: '7', name: 'Mina Seo', email: 'mina@acme.com', role: 'Editor', status: 'active', joined: 'May 2, 2024' },
  { id: '8', name: 'Ryan Patel', email: 'ryan@acme.com', role: 'Viewer', status: 'active', joined: 'May 15, 2024' },
  { id: '9', name: 'Yuna Choi', email: 'yuna@acme.com', role: 'Editor', status: 'pending', joined: 'Jun 3, 2024' },
  { id: '10', name: 'Tom Fischer', email: 'tom@acme.com', role: 'Viewer', status: 'active', joined: 'Jun 20, 2024' },
]

const statusVariant = { active: 'default', pending: 'secondary', inactive: 'outline' } as const

const columns: DataGridColumnDef<User>[] = [
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
    cell: ({ row }) => <Badge variant="outline">{row.original.role}</Badge>,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]} className="capitalize">
        {row.original.status}
      </Badge>
    ),
  },
  { id: 'joined', accessorKey: 'joined', header: 'Joined' },
]

const headerLeft = (table: TanStackTable<User>) => (
  <GlobalSearch table={table} placeholder="Search..." />
)

const headerRight = () => (
  <div className="flex items-center gap-2">
    <Button variant="outline" size="sm"><Download />Export</Button>
    <Button size="sm"><Plus />Add User</Button>
  </div>
)

export function StandardDataGridDemo({
  theme,
  topBarShow,
  topBarVariant,
  topBarBg,
}: {
  theme?: CSSProperties
  topBarShow?: string
  topBarVariant?: string
  topBarBg?: string
}) {
  return (
    <DataBodyTemplate
      theme={theme}
      className="layout-table"
      topBar={
        topBarShow !== undefined || topBarVariant !== undefined || topBarBg !== undefined
          ? buildTopBar({ topBarShow, topBarVariant, topBarBg, left: 'Data / Table' })
          : <PageTopBar left="Data / Table" />
      }
      title="Users"
    >
      <DataBodyTemplate.Body>
        <DataGrid
          data={users}
          columns={columns}
          getRowId={(row) => row.id}
          tableWidthMode="fill-last"
          headerLeft={headerLeft}
          headerRight={headerRight}
          pagination={{ pageSize: 10 }}
          footer={(table: TanStackTable<User>) => (
            <div className="flex h-9 items-center justify-between px-1 text-xs text-muted-foreground">
              <span>{users.length} results</span>
              <DataGridPaginationCompact table={table} />
            </div>
          )}
        />
      </DataBodyTemplate.Body>
    </DataBodyTemplate>
  )
}
