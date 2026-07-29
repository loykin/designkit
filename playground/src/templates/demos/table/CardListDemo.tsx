import type { CSSProperties } from 'react'
import {
  DataGridCard,
  GlobalSearch,
  type DataGridColumnDef,
} from '@loykin/gridkit'
import type { Row, Table as TanStackTable } from '@tanstack/react-table'
import {
  Badge,
  Button,
  Card,
  CardContent,
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
]

const statusVariant = { active: 'default', pending: 'secondary', inactive: 'outline' } as const

const columns: DataGridColumnDef<User>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  { id: 'email', accessorKey: 'email', header: 'Email' },
  { id: 'role', accessorKey: 'role', header: 'Role' },
  { id: 'status', accessorKey: 'status', header: 'Status' },
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

function renderUserRow(row: Row<User>) {
  const user = row.original
  return (
    <Card size="sm" className="rounded-lg border border-border shadow-sm ring-0">
      <CardContent className="flex items-center justify-between gap-4 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex shrink-0 items-center gap-4 text-xs">
          <span className="text-muted-foreground">{user.role}</span>
          <Badge variant={statusVariant[user.status]} className="capitalize">
            {user.status}
          </Badge>
          <span className="w-20 text-right text-muted-foreground">{user.joined}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function CardListDemo({
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
      className="layout-table-card-list"
      topBar={
        topBarShow !== undefined || topBarVariant !== undefined || topBarBg !== undefined
          ? buildTopBar({ topBarShow, topBarVariant, topBarBg, left: 'Data / Table / Card List' })
          : <PageTopBar left="Data / Table / Card List" />
      }
      title="User Cards"
      description="gridkit DataGridCard list mode"
    >
      <DataBodyTemplate.Body>
        <DataGridCard
          data={users}
          columns={columns}
          getRowId={(row) => row.id}
          tableWidthMode="fill-last"
          headerLeft={headerLeft}
          headerRight={headerRight}
          cardColumns={1}
          minCardWidth={220}
          minColumns={1}
          renderCard={renderUserRow}
          styles={{
            root: { overflow: 'visible' },
            frameInner: { overflow: 'visible' },
            content: { paddingInline: 0 },
          }}
        />
      </DataBodyTemplate.Body>
    </DataBodyTemplate>
  )
}
