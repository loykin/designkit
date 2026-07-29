import { useState, type CSSProperties } from 'react'
import {
  DataGridDrag,
  DragHandleCell,
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

type Service = {
  id: string
  name: string
  owner: string
  tier: string
  status: 'active' | 'inactive' | 'pending'
}

const initialServices: Service[] = [
  { id: '1', name: 'Authentication', owner: 'Sarah Kim', tier: 'Critical', status: 'active' },
  { id: '2', name: 'Billing API', owner: 'Marcus Lee', tier: 'Critical', status: 'active' },
  { id: '3', name: 'Email worker', owner: 'Ji-Yeon Park', tier: 'Standard', status: 'inactive' },
  { id: '4', name: 'Search indexer', owner: 'Alex Chen', tier: 'Standard', status: 'active' },
  { id: '5', name: 'Data exporter', owner: 'Dana White', tier: 'Standard', status: 'pending' },
]

const statusVariant = { active: 'default', pending: 'secondary', inactive: 'outline' } as const

const columns: DataGridColumnDef<Service>[] = [
  {
    id: 'drag',
    size: 28,
    minSize: 28,
    maxSize: 28,
    enableResizing: false,
    enableSorting: false,
    header: () => null,
    cell: () => <DragHandleCell />,
    meta: { align: 'center' },
  },
  { id: 'name', accessorKey: 'name', header: 'Service' },
  { id: 'owner', accessorKey: 'owner', header: 'Owner' },
  {
    id: 'tier',
    accessorKey: 'tier',
    header: 'Tier',
    cell: ({ row }) => <Badge variant="outline">{row.original.tier}</Badge>,
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

const headerLeft = (table: TanStackTable<Service>) => (
  <GlobalSearch table={table} placeholder="Search..." />
)

const headerRight = () => (
  <div className="flex items-center gap-2">
    <Button variant="outline" size="sm"><Download />Export</Button>
    <Button size="sm"><Plus />Add Service</Button>
  </div>
)

export function DraggableDataGridDemo({
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
  const [services, setServices] = useState(initialServices)

  return (
    <DataBodyTemplate
      theme={theme}
      className="layout-table-drag"
      topBar={
        topBarShow !== undefined || topBarVariant !== undefined || topBarBg !== undefined
          ? buildTopBar({ topBarShow, topBarVariant, topBarBg, left: 'Data / Table / Row Drag' })
          : <PageTopBar left="Data / Table / Row Drag" />
      }
      title="Services"
      description="gridkit DataGridDrag"
    >
      <DataBodyTemplate.Body>
        <DataGridDrag
          data={services}
          columns={columns}
          getRowId={(row) => row.id}
          onRowReorder={setServices}
          tableWidthMode="fill-last"
          columnSizing={{ drag: 28 }}
          headerLeft={headerLeft}
          headerRight={headerRight}
          classNames={{
            cell: '[&[data-col-id=drag]]:px-1',
            headerCell: '[&[data-col-id=drag]]:px-1',
          }}
        />
      </DataBodyTemplate.Body>
    </DataBodyTemplate>
  )
}
