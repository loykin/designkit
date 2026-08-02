import { useState, type CSSProperties } from 'react'
import {
  DataGridInfinity,
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
}

const seedUsers: User[] = [
  { id: '1', name: 'Sarah Kim', email: 'sarah@acme.com', role: 'Admin', status: 'active' },
  { id: '2', name: 'Marcus Lee', email: 'marcus@acme.com', role: 'Editor', status: 'active' },
  { id: '3', name: 'Ji-Yeon Park', email: 'jiyeon@acme.com', role: 'Viewer', status: 'inactive' },
  { id: '4', name: 'Alex Chen', email: 'alex@acme.com', role: 'Editor', status: 'active' },
  { id: '5', name: 'Dana White', email: 'dana@acme.com', role: 'Viewer', status: 'pending' },
]

const users = Array.from({ length: 120 }, (_, index) => {
  const source = seedUsers[index % seedUsers.length]
  const id = String(index + 1)
  return { ...source, id, name: `${source.name} ${id}`, email: source.email.replace('@', `+${id}@`) }
})

const statusVariant = { active: 'default', pending: 'secondary', inactive: 'outline' } as const

const columns: DataGridColumnDef<User>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  { id: 'email', accessorKey: 'email', header: 'Email' },
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

export function InfiniteDataGridDemo({
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
  const [visibleCount, setVisibleCount] = useState(40)
  const [isFetching, setIsFetching] = useState(false)
  const visibleUsers = users.slice(0, visibleCount)
  const hasNextPage = visibleCount < users.length

  const fetchNextPage = () => {
    if (isFetching || !hasNextPage) return
    setIsFetching(true)
    window.setTimeout(() => {
      setVisibleCount((count) => Math.min(count + 30, users.length))
      setIsFetching(false)
    }, 250)
  }

  return (
    <DataBodyTemplate
      theme={theme}
      className="layout-table-infinity"
      topBar={
        topBarShow !== undefined || topBarVariant !== undefined || topBarBg !== undefined
          ? buildTopBar({ topBarShow, topBarVariant, topBarBg, left: 'Data / Table / Infinite Scroll' })
          : <PageTopBar left="Data / Table / Infinite Scroll" />
      }
      title="Users"
      description="gridkit DataGridInfinity"
      contentClassName="pb-(--designkit-page-padding-x)"
    >
      <DataBodyTemplate.Body>
        <DataGridInfinity
          data={visibleUsers}
          columns={columns}
          getRowId={(row) => row.id}
          tableWidthMode="fill-last"
          headerLeft={headerLeft}
          headerRight={headerRight}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetching}
          fetchNextPage={fetchNextPage}
          tableKey="table-infinity-template"
          fillParent
        />
      </DataBodyTemplate.Body>
    </DataBodyTemplate>
  )
}
