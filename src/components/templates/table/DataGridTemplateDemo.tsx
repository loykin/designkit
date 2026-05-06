import { useEffect, useState } from 'react'
import {
  DataGridPaginationCompact,
  GlobalSearch,
  type DataGridColumnDef,
} from '@loykin/gridkit'
import type { Row, Table as TanStackTable } from '@tanstack/react-table'
import { DataBodyTemplate } from '@/components/templates/databody/DataBodyTemplate'
import { DataPage } from '@/components/templates/datapage/DataPage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, Plus } from 'lucide-react'
import { DataGridView, type DataGridViewVariant } from './DataGridView'

export interface DataGridTemplateDemoProps {
  theme?: React.CSSProperties
  variant?: DataGridViewVariant
  layoutClassName?: string
  breadcrumb?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
}

type DemoRow = {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  joined: string
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

const demoInfiniteData: DemoRow[] = Array.from({ length: 120 }, (_, index) => {
  const source = demoData[index % demoData.length]
  const id = String(index + 1)
  return {
    ...source,
    id,
    name: `${source.name} ${id}`,
    email: source.email.replace('@', `+${id}@`),
  }
})

const statusVariant = { active: 'default', pending: 'secondary', inactive: 'outline' } as const

const demoColumns: DataGridColumnDef<DemoRow>[] = [
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

const leftFilters = (table: TanStackTable<DemoRow>) => (
  <GlobalSearch table={table} placeholder="Search..." />
)

const rightFilters = () => (
  <div className="flex items-center gap-2">
    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
      <Download className="h-3.5 w-3.5" />Export
    </Button>
    <Button size="sm" className="h-8 gap-1.5 text-xs">
      <Plus className="h-3.5 w-3.5" />Add User
    </Button>
  </div>
)

function renderDemoCard(variant: DataGridViewVariant) {
  return (row: Row<DemoRow>) => {
    const user = row.original

    if (variant === 'card-list') {
      return (
        <Card size="sm" className="rounded-lg border border-border shadow-sm ring-0">
          <CardContent className="flex items-center justify-between gap-4 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex shrink-0 items-center gap-4 text-xs">
              <span className="text-muted-foreground">{user.role}</span>
              <Badge variant={statusVariant[user.status]} className="text-xs capitalize">
                {user.status}
              </Badge>
              <span className="w-20 text-right text-muted-foreground">{user.joined}</span>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card size="sm" className="h-full rounded-lg border border-border shadow-sm ring-0">
        <CardContent className="py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Badge variant={statusVariant[user.status]} className="text-xs capitalize">
              {user.status}
            </Badge>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-muted-foreground">Role</p>
              <p className="mt-0.5 font-medium">{user.role}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Joined</p>
              <p className="mt-0.5 font-medium">{user.joined}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
}

function getDefaultLayoutClassName(variant: DataGridViewVariant) {
  return variant === 'standard' ? 'layout-table' : `layout-table-${variant}`
}

export function DataGridTemplateDemo({
  theme,
  variant = 'standard',
  layoutClassName = getDefaultLayoutClassName(variant),
  breadcrumb = 'Data / Table',
  title = 'Users',
  description,
}: DataGridTemplateDemoProps) {
  const [visibleCount, setVisibleCount] = useState(40)
  const [isFetching, setIsFetching] = useState(false)
  const visibleData = demoInfiniteData.slice(0, visibleCount)
  const hasNextPage = visibleCount < demoInfiniteData.length

  useEffect(() => {
    setVisibleCount(40)
  }, [variant])

  const fetchNextPage = () => {
    if (isFetching || !hasNextPage) return
    setIsFetching(true)
    window.setTimeout(() => {
      setVisibleCount((count) => Math.min(count + 30, demoInfiniteData.length))
      setIsFetching(false)
    }, 250)
  }

  return (
    <DataBodyTemplate
      theme={{ '--dg-card-padding': '0px', ...theme } as React.CSSProperties}
      className={layoutClassName}
      breadcrumb={breadcrumb}
      title={title}
      description={description}
      contentClassName={variant === 'infinity' ? 'pb-0' : undefined}
    >
      <DataPage.Group className="h-full">
        <DataPage.GroupBody className="h-full [&_.dg-shell]:h-full [&_.dg-table-wrapper]:min-h-0 [&_.dg-table-wrapper]:flex-1">
          <DataGridView
            data={variant === 'infinity' ? visibleData : demoData}
            columns={demoColumns}
            getRowId={(row) => row.id}
            variant={variant}
            enableColumnFilters={variant === 'infinity' || variant === 'card' || variant === 'card-list'}
            leftFilters={leftFilters}
            rightFilters={rightFilters}
            pagination={{ pageSize: 10 }}
            footer={(table) => (
              <div className="flex h-9 items-center justify-between px-1 text-xs text-muted-foreground">
                <span>{demoData.length} results</span>
                <DataGridPaginationCompact table={table} />
              </div>
            )}
            infinity={{
              data: visibleData,
              hasNextPage,
              isFetchingNextPage: isFetching,
              fetchNextPage,
              tableKey: 'table-infinity-template',
            }}
            card={{ renderCard: renderDemoCard(variant) }}
          />
        </DataPage.GroupBody>
      </DataPage.Group>
    </DataBodyTemplate>
  )
}
