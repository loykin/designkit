import { useEffect, useMemo, useState } from 'react'
import {
  DataGrid,
  DataGridCard,
  DataGridDrag,
  DataGridInfinity,
  DragHandleCell,
  type DataGridColumnDef,
} from '@loykin/gridkit'
import type { Row, Table as TanStackTable } from '@tanstack/react-table'

export type DataGridViewVariant = 'standard' | 'infinity' | 'drag' | 'card' | 'card-list'
export type DataGridViewFilter<T> = (table: TanStackTable<T>) => React.ReactNode

export interface DataGridViewInfinityProps<T> {
  data?: T[]
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  tableKey?: string
}

export interface DataGridViewDragProps<T> {
  onRowReorder?: (rows: T[]) => void
  dragColumnSize?: number
}

export interface DataGridViewCardProps<T> {
  renderCard?: (row: Row<T>) => React.ReactNode
  cardColumns?: number
  minCardWidth?: number
  minColumns?: number
}

export interface DataGridViewProps<T extends Record<string, unknown>> {
  data: T[]
  columns: DataGridColumnDef<T>[]
  getRowId?: (row: T, index: number) => string
  variant?: DataGridViewVariant
  tableHeight?: string | number
  rowHeight?: number
  tableWidthMode?: 'spacer' | 'fill-last' | 'independent'
  enableSorting?: boolean
  enableColumnFilters?: boolean
  emptyMessage?: string
  leftFilters?: DataGridViewFilter<T>
  rightFilters?: DataGridViewFilter<T>
  pagination?: { pageSize?: number } | false
  footer?: (table: TanStackTable<T>) => React.ReactNode
  infinity?: DataGridViewInfinityProps<T>
  drag?: DataGridViewDragProps<T>
  card?: DataGridViewCardProps<T>
}

export type { DataGridColumnDef }

export function DataGridView<T extends Record<string, unknown>>({
  data,
  columns,
  getRowId = (_row, index) => String(index),
  variant = 'standard',
  tableHeight = '100%',
  rowHeight = 36,
  tableWidthMode = 'fill-last',
  enableSorting = true,
  enableColumnFilters,
  emptyMessage = 'No rows found',
  leftFilters,
  rightFilters,
  pagination,
  footer,
  infinity,
  drag,
  card,
}: DataGridViewProps<T>) {
  const [orderedData, setOrderedData] = useState<T[]>(data)

  useEffect(() => {
    setOrderedData(data)
  }, [data])

  const dragColumnSize = drag?.dragColumnSize ?? 28
  const dragColumns = useMemo<DataGridColumnDef<T>[]>(() => ([
    {
      id: 'drag',
      size: dragColumnSize,
      minSize: dragColumnSize,
      maxSize: dragColumnSize,
      enableResizing: false,
      enableSorting: false,
      header: () => null,
      cell: () => <DragHandleCell />,
      meta: { align: 'center' },
    },
    ...columns,
  ]), [columns, dragColumnSize])

  const handleRowReorder = (rows: T[]) => {
    setOrderedData(rows)
    drag?.onRowReorder?.(rows)
  }

  if (variant === 'infinity') {
    return (
      <DataGridInfinity
        data={infinity?.data ?? data}
        columns={columns}
        getRowId={getRowId}
        tableHeight={tableHeight}
        rowHeight={rowHeight}
        enableSorting={enableSorting}
        enableColumnFilters={enableColumnFilters}
        tableWidthMode={tableWidthMode}
        leftFilters={leftFilters}
        rightFilters={rightFilters}
        hasNextPage={infinity?.hasNextPage ?? false}
        isFetchingNextPage={infinity?.isFetchingNextPage ?? false}
        fetchNextPage={infinity?.fetchNextPage ?? (() => undefined)}
        emptyMessage={emptyMessage}
        tableKey={infinity?.tableKey}
      />
    )
  }

  if (variant === 'drag') {
    return (
      <DataGridDrag
        data={orderedData}
        columns={dragColumns}
        getRowId={getRowId}
        onRowReorder={handleRowReorder}
        tableHeight={tableHeight}
        rowHeight={rowHeight}
        columnSizing={{ drag: dragColumnSize }}
        tableWidthMode={tableWidthMode}
        leftFilters={leftFilters}
        rightFilters={rightFilters}
        emptyMessage={emptyMessage}
        classNames={{
          cell: '[&[data-col-id=drag]]:px-1',
          headerCell: '[&[data-col-id=drag]]:px-1',
        }}
      />
    )
  }

  if (variant === 'card' || variant === 'card-list') {
    if (!card?.renderCard) {
      throw new Error('DataGridView card variants require card.renderCard.')
    }

    return (
      <DataGridCard
        data={data}
        columns={columns}
        getRowId={getRowId}
        tableHeight={tableHeight}
        rowHeight={rowHeight}
        enableSorting={enableSorting}
        enableColumnFilters={enableColumnFilters}
        tableWidthMode={tableWidthMode}
        leftFilters={leftFilters}
        rightFilters={rightFilters}
        cardColumns={card?.cardColumns ?? (variant === 'card-list' ? 1 : undefined)}
        minCardWidth={card?.minCardWidth ?? 220}
        minColumns={card?.minColumns ?? (variant === 'card-list' ? 1 : 2)}
        renderCard={card.renderCard}
      />
    )
  }

  return (
    <DataGrid
      data={data}
      columns={columns}
      getRowId={getRowId}
      tableHeight={tableHeight}
      rowHeight={rowHeight}
      enableSorting={enableSorting}
      enableColumnFilters={enableColumnFilters}
      tableWidthMode={tableWidthMode}
      leftFilters={leftFilters}
      rightFilters={rightFilters}
      pagination={pagination === false ? undefined : pagination}
      footer={footer}
      emptyMessage={emptyMessage}
    />
  )
}
