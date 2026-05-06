import { useEffect, useMemo, useState } from 'react'
import {
  DataGrid,
  DataGridCard,
  DataGridDrag,
  DataGridInfinity,
  DataGridPaginationCompact,
  DragHandleCell,
  type DataGridColumnDef,
} from '@loykin/gridkit'
import { DataPage } from '@/components/templates/datapage/DataPage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, Plus, Download } from 'lucide-react'

// ─── Public API ───────────────────────────────────────────────────────────────

export interface TableColumn<T> {
  key:     keyof T & string
  label:   string
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

export type TableBodyVariant = 'standard' | 'infinity' | 'drag' | 'card' | 'card-list'

export interface TableVariantTab {
  id: TableBodyVariant
  label: string
  count?: number
}

export interface TableBodyTemplateProps<T extends Record<string, unknown> = DemoRow> {
  /** CSS custom properties applied to root — use to configure theme tokens */
  theme?:      React.CSSProperties
  title?:      string
  description?: React.ReactNode
  actions?:    React.ReactNode
  columns?:    TableColumn<T>[]
  data?:       T[]
  rowKey?:     keyof T & string
  totalCount?: number
  pagination?: React.ReactNode
  variant?:    TableBodyVariant
  layoutClassName?: string
  tabs?:       TableVariantTab[] | false
  activeTab?:  TableBodyVariant
  onTabChange?: (id: TableBodyVariant) => void
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
  description,
  actions,
  columns    = demoColumns as unknown as TableColumn<T>[],
  data       = demoData as unknown as T[],
  rowKey     = 'id' as keyof T & string,
  totalCount,
  pagination,
  variant    = 'standard',
  layoutClassName,
  tabs       = false,
  activeTab: controlledTab,
  onTabChange,
}: TableBodyTemplateProps<T>) {
  const [internalVariant, setInternalVariant] = useState<TableBodyVariant>(variant)
  const [visibleCount, setVisibleCount] = useState(40)
  const [isFetching, setIsFetching] = useState(false)
  const [orderedData, setOrderedData] = useState<T[]>(data)

  useEffect(() => {
    setInternalVariant(variant)
  }, [variant])

  useEffect(() => {
    setOrderedData(data)
    setVisibleCount(Math.min(40, data.length || 40))
  }, [data])

  const activeVariant = controlledTab ?? internalVariant
  const rootClassName = layoutClassName ?? (
    activeVariant === 'standard' ? 'layout-table' : `layout-table-${activeVariant}`
  )
  const gridColumns = useMemo<DataGridColumnDef<T>[]>(() => (
    columns.map((col) => ({
      id: col.key,
      accessorKey: col.key,
      header: col.label,
      cell: (ctx) => {
        const row = ctx.row.original
        const value = row[col.key]
        return col.render ? col.render(value, row) : String(value ?? '')
      },
    }))
  ), [columns])

  const dragColumns = useMemo<DataGridColumnDef<T>[]>(() => ([
    {
      id: 'drag',
      size: 28,
      enableResizing: false,
      enableSorting: false,
      header: () => null,
      cell: () => <DragHandleCell />,
    },
    ...gridColumns,
  ]), [gridColumns])

  const handleVariantTab = (id: TableBodyVariant) => {
    if (!controlledTab) setInternalVariant(id)
    onTabChange?.(id)
  }

  const infinityData = (data.length > demoData.length ? data : demoInfiniteData as unknown as T[])
  const visibleData = infinityData.slice(0, visibleCount)
  const hasNextPage = visibleCount < infinityData.length

  const fetchNextPage = () => {
    if (isFetching || !hasNextPage) return
    setIsFetching(true)
    window.setTimeout(() => {
      setVisibleCount((count) => Math.min(count + 30, infinityData.length))
      setIsFetching(false)
    }, 250)
  }

  const tableTabs = tabs || []

  const grid = (() => {
    if (activeVariant === 'infinity') {
      return (
        <DataGridInfinity
          data={visibleData}
          columns={gridColumns}
          getRowId={(row, index) => String(row[rowKey] ?? index)}
          tableHeight="100%"
          rowHeight={36}
          enableSorting
          enableColumnFilters
          tableWidthMode="fill-last"
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetching}
          fetchNextPage={fetchNextPage}
          emptyMessage="No rows found"
          tableKey="table-infinity-template"
        />
      )
    }

    if (activeVariant === 'drag') {
      return (
        <DataGridDrag
          data={orderedData}
          columns={dragColumns}
          getRowId={(row, index) => String(row[rowKey] ?? index)}
          onRowReorder={setOrderedData}
          tableHeight="100%"
          rowHeight={36}
          tableWidthMode="fill-last"
          emptyMessage="No rows found"
        />
      )
    }

    if (activeVariant === 'card' || activeVariant === 'card-list') {
      return (
        <DataGridCard
          data={data}
          columns={gridColumns}
          getRowId={(row, index) => String(row[rowKey] ?? index)}
          tableHeight="100%"
          rowHeight={36}
          enableSorting
          enableColumnFilters
          tableWidthMode="fill-last"
          cardColumns={activeVariant === 'card-list' ? 1 : undefined}
          minCardWidth={220}
          minColumns={activeVariant === 'card-list' ? 1 : 2}
          renderCard={(row) => {
            const original = row.original
            if (activeVariant === 'card-list') {
              return (
                <Card size="sm" className="rounded-[var(--radius)] border border-border shadow-sm ring-0">
                  <CardContent className="flex items-center justify-between gap-4 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{String(original.name ?? original[rowKey] ?? 'Untitled')}</p>
                      <p className="truncate text-xs text-muted-foreground">{String(original.email ?? '')}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-4 text-xs">
                      <span className="text-muted-foreground">{String(original.role ?? '-')}</span>
                      {'status' in original && (
                        <Badge variant={statusVariant[original.status as DemoRow['status']] ?? 'outline'} className="text-xs capitalize">
                          {String(original.status)}
                        </Badge>
                      )}
                      <span className="w-20 text-right text-muted-foreground">{String(original.joined ?? '-')}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            }

            return (
              <Card size="sm" className="h-full rounded-[var(--radius)] border border-border shadow-sm ring-0">
                <CardContent className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{String(original.name ?? original[rowKey] ?? 'Untitled')}</p>
                      <p className="truncate text-xs text-muted-foreground">{String(original.email ?? original.role ?? '')}</p>
                    </div>
                    {'status' in original && (
                      <Badge variant={statusVariant[original.status as DemoRow['status']] ?? 'outline'} className="text-xs capitalize">
                        {String(original.status)}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-muted-foreground">Role</p>
                      <p className="mt-0.5 font-medium">{String(original.role ?? '-')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Joined</p>
                      <p className="mt-0.5 font-medium">{String(original.joined ?? '-')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          }}
        />
      )
    }

    return (
      <DataGrid
        data={data}
        columns={gridColumns}
        getRowId={(row, index) => String(row[rowKey] ?? index)}
        tableHeight="100%"
        rowHeight={36}
        enableSorting
        tableWidthMode="fill-last"
        pagination={{ pageSize: 10 }}
        footer={(table) => (
          pagination ?? (
            <div className="flex h-9 items-center justify-between px-1 text-xs text-muted-foreground">
              <span>{totalCount ?? data.length} results</span>
              <DataGridPaginationCompact table={table} />
            </div>
          )
        )}
      />
    )
  })()

  return (
    <DataPage className={rootClassName} style={theme}>
      <DataPage.Header>
        <DataPage.TitleBlock title={title} description={description} />
      </DataPage.Header>

      {tableTabs.length > 0 && (
        <DataPage.Tabs>
          {tableTabs.map((tab) => (
            <DataPage.Tab
              key={tab.id}
              active={tab.id === activeVariant}
              count={tab.count}
              onClick={() => handleVariantTab(tab.id)}
            >
              {tab.label}
            </DataPage.Tab>
          ))}
        </DataPage.Tabs>
      )}

      <DataPage.Content className={activeVariant === 'infinity' ? 'px-6 pb-0 pt-1' : 'px-6 pb-6 pt-1'}>
        <DataPage.Group className="h-full">
          <DataPage.GroupToolbar>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search…" className="pl-8 h-8 w-52 text-xs" />
            </div>
            <DataPage.Actions>
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
            </DataPage.Actions>
          </DataPage.GroupToolbar>

          <DataPage.GroupBody className="h-[calc(100%-2.75rem)]">
            {grid}
          </DataPage.GroupBody>
        </DataPage.Group>
      </DataPage.Content>
    </DataPage>
  )
}
