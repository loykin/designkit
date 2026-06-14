import React, { useEffect, useState } from 'react'
import {
  DataGrid,
  DataGridInfinity,
  DataGridDrag,
  DataGridCard,
  DataGridPaginationCompact,
  GlobalSearch,
  DragHandleCell,
  type DataGridColumnDef,
} from '@loykin/gridkit'
import type { Row, Table as TanStackTable } from '@tanstack/react-table'
import { DataBodyTemplate, PageTopBar, buildTopBar } from '@loykin/designkit'
import { Badge, Button, Card, CardContent } from '@loykin/designkit'
import { Download, Plus } from 'lucide-react'
import type { TemplateCodeContext } from '../../code'

export type DataGridTemplateVariant = 'standard' | 'infinity' | 'drag' | 'card' | 'card-list'

export interface DataGridTemplateDemoProps {
  theme?: React.CSSProperties
  variant?: DataGridTemplateVariant
  layoutClassName?: string
  topBar?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  topBarShow?: string
  topBarVariant?: string
  topBarBg?: string
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

const demoInfiniteData: DemoRow[] = Array.from({ length: 120 }, (_, index) => {
  const source = demoData[index % demoData.length]
  const id = String(index + 1)
  return { ...source, id, name: `${source.name} ${id}`, email: source.email.replace('@', `+${id}@`) }
})

const statusVariant = { active: 'default', pending: 'secondary', inactive: 'outline' } as const

const demoColumns: DataGridColumnDef<DemoRow>[] = [
  {
    id: 'name', accessorKey: 'name', header: 'Name',
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    id: 'email', accessorKey: 'email', header: 'Email',
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
  },
  {
    id: 'role', accessorKey: 'role', header: 'Role',
    cell: ({ row }) => <Badge variant="outline" className="text-xs font-normal">{row.original.role}</Badge>,
  },
  {
    id: 'status', accessorKey: 'status', header: 'Status',
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]} className="text-xs capitalize">
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: 'joined', accessorKey: 'joined', header: 'Joined',
    cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.joined}</span>,
  },
]

const dragColumns: DataGridColumnDef<DemoRow>[] = [
  {
    id: 'drag', size: 28, minSize: 28, maxSize: 28,
    enableResizing: false, enableSorting: false,
    header: () => null,
    cell: () => <DragHandleCell />,
    meta: { align: 'center' },
  },
  ...demoColumns,
]

const headerLeft = (table: TanStackTable<DemoRow>) => (
  <GlobalSearch table={table} placeholder="Search..." />
)

const headerRight = () => (
  <div className="flex items-center gap-2">
    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
      <Download className="h-3.5 w-3.5" />
      Export
    </Button>
    <Button size="sm" className="h-8 gap-1.5 text-xs">
      <Plus className="h-3.5 w-3.5" />
      Add User
    </Button>
  </div>
)

function renderCard(variant: DataGridTemplateVariant) {
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
              <Badge variant={statusVariant[user.status]} className="text-xs capitalize">{user.status}</Badge>
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
            <Badge variant={statusVariant[user.status]} className="text-xs capitalize">{user.status}</Badge>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div><p className="text-muted-foreground">Role</p><p className="mt-0.5 font-medium">{user.role}</p></div>
            <div><p className="text-muted-foreground">Joined</p><p className="mt-0.5 font-medium">{user.joined}</p></div>
          </div>
        </CardContent>
      </Card>
    )
  }
}

function GridContent({
  variant,
  visibleData,
  hasNextPage,
  isFetching,
  fetchNextPage,
  orderedData,
  setOrderedData,
}: {
  variant: DataGridTemplateVariant
  visibleData: DemoRow[]
  hasNextPage: boolean
  isFetching: boolean
  fetchNextPage: () => void
  orderedData: DemoRow[]
  setOrderedData: (rows: DemoRow[]) => void
}) {
  if (variant === 'infinity') {
    return (
      <DataGridInfinity
        data={visibleData}
        columns={demoColumns}
        getRowId={(row) => row.id}
        tableWidthMode="fill-last"
        headerLeft={headerLeft}
        headerRight={headerRight}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetching}
        fetchNextPage={fetchNextPage}
        tableKey="table-infinity-template"
      />
    )
  }

  if (variant === 'drag') {
    return (
      <DataGridDrag
        data={orderedData}
        columns={dragColumns}
        getRowId={(row) => row.id}
        onRowReorder={setOrderedData}
        tableWidthMode="fill-last"
        columnSizing={{ drag: 28 }}
        headerLeft={headerLeft}
        headerRight={headerRight}
        classNames={{ cell: '[&[data-col-id=drag]]:px-1', headerCell: '[&[data-col-id=drag]]:px-1' }}
      />
    )
  }

  if (variant === 'card' || variant === 'card-list') {
    return (
      <DataGridCard
        data={demoData}
        columns={demoColumns}
        getRowId={(row) => row.id}
        tableWidthMode="fill-last"
        headerLeft={headerLeft}
        headerRight={headerRight}
        cardColumns={variant === 'card-list' ? 1 : undefined}
        minCardWidth={220}
        minColumns={variant === 'card-list' ? 1 : 2}
        renderCard={renderCard(variant)}
      />
    )
  }

  return (
    <DataGrid
      data={demoData}
      columns={demoColumns}
      getRowId={(row) => row.id}
      tableWidthMode="fill-last"
      headerLeft={headerLeft}
      headerRight={headerRight}
      pagination={{ pageSize: 10 }}
      footer={(table: TanStackTable<DemoRow>) => (
        <div className="flex h-9 items-center justify-between px-1 text-xs text-muted-foreground">
          <span>{demoData.length} results</span>
          <DataGridPaginationCompact table={table} />
        </div>
      )}
    />
  )
}

export function DataGridTemplateDemo({
  theme,
  variant = 'standard',
  layoutClassName,
  topBar,
  title = 'Users',
  description,
  topBarShow,
  topBarVariant,
  topBarBg,
}: DataGridTemplateDemoProps) {
  const resolvedTopBar =
    topBarShow !== undefined || topBarVariant !== undefined || topBarBg !== undefined
      ? buildTopBar({ topBarShow, topBarVariant, topBarBg, left: 'Data / Table' })
      : topBar ?? <PageTopBar left="Data / Table" />

  const [visibleCount, setVisibleCount] = useState(40)
  const [isFetching, setIsFetching] = useState(false)
  const [orderedData, setOrderedData] = useState(demoData)
  const visibleData = demoInfiniteData.slice(0, visibleCount)
  const hasNextPage = visibleCount < demoInfiniteData.length

  useEffect(() => { setVisibleCount(40) }, [variant])

  const fetchNextPage = () => {
    if (isFetching || !hasNextPage) return
    setIsFetching(true)
    window.setTimeout(() => {
      setVisibleCount((c) => Math.min(c + 30, demoInfiniteData.length))
      setIsFetching(false)
    }, 250)
  }

  return (
    <DataBodyTemplate
      theme={{ '--gridkit-card-padding': '0px', ...theme } as React.CSSProperties}
      className={layoutClassName}
      topBar={resolvedTopBar}
      title={title}
      description={description}
      contentClassName={variant === 'infinity' ? 'pb-0' : undefined}
    >
      <DataBodyTemplate.Body className="[&_.gridkit-shell]:h-full [&_.gridkit-frame]:min-h-0 [&_.gridkit-frame]:flex-1">
        <GridContent
          variant={variant}
          visibleData={visibleData}
          hasNextPage={hasNextPage}
          isFetching={isFetching}
          fetchNextPage={fetchNextPage}
          orderedData={orderedData}
          setOrderedData={setOrderedData}
        />
      </DataBodyTemplate.Body>
    </DataBodyTemplate>
  )
}

export function buildDataGridTemplateCode({
  definition,
  themeProp,
  layoutClassName,
}: TemplateCodeContext) {
  const variant = definition.preview?.variant as DataGridTemplateVariant | undefined
  const isCard = variant === 'card' || variant === 'card-list'
  const cN = 'className'

  const componentName =
    variant === 'infinity' ? 'DataGridInfinity'
    : variant === 'drag' ? 'DataGridDrag'
    : isCard ? 'DataGridCard'
    : 'DataGrid'

  const cardRenderCode = isCard
    ? [
        '',
        `function renderCard(row: { original: User }) {`,
        `  const user = row.original`,
        `  return (`,
        `    <div ${cN}="rounded-lg border bg-card p-3 text-card-foreground">`,
        `      <p ${cN}="text-sm font-medium">{user.name}</p>`,
        `      <p ${cN}="text-xs text-muted-foreground">{user.email}</p>`,
        `    </div>`,
        `  )`,
        `}`,
      ].join('\n')
    : ''

  const cardProp = isCard ? `\n        renderCard={renderCard}` : ''
  const cardColumnsProp = variant === 'card-list' ? `\n        cardColumns={1}` : ''

  return [
    `import { DataBodyTemplate, PageTopBar } from '@loykin/designkit'`,
    `import { ${componentName}, type DataGridColumnDef } from '@loykin/gridkit'`,
    `import '@loykin/designkit/styles'`,
    '',
    `type User = Record<string, unknown> & { id: string; name: string; email: string }`,
    ``,
    `const data: User[] = []`,
    `const columns: DataGridColumnDef<User>[] = [`,
    `  { id: 'name', accessorKey: 'name', header: 'Name' },`,
    `  { id: 'email', accessorKey: 'email', header: 'Email' },`,
    `]`,
    cardRenderCode,
    '',
    `export function MyPage() {`,
    `  return (`,
    `    <DataBodyTemplate${themeProp}`,
    `      className="${layoutClassName}"`,
    `      topBar={<PageTopBar left="Data / Users" />}`,
    `      title="Users"`,
    `    >`,
    `      <DataBodyTemplate.Body>`,
    `        <${componentName}`,
    `          data={data}`,
    `          columns={columns}`,
    `          getRowId={(row) => row.id}${cardProp}${cardColumnsProp}`,
    `          tableHeight={420}`,
    `        />`,
    `      </DataBodyTemplate.Body>`,
    `    </DataBodyTemplate>`,
    `  )`,
    `}`,
  ]
    .filter(Boolean)
    .join('\n')
}
