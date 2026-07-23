import { useState } from 'react'
import {
  DataGrid,
  DataGridPaginationCompact,
  GlobalSearch,
  type DataGridColumnDef,
} from '@loykin/gridkit'
import type { Table as TanStackTable } from '@tanstack/react-table'
import { Badge, Button, DataBodyTemplate, PageTopBar, useIsMobile } from '@loykin/designkit'
import { MessageSquare, Pencil, Pin } from 'lucide-react'
import type { TemplateCodeContext } from '../../code'

type TopicStatus = 'open' | 'resolved'

interface BoardTopic {
  id: string
  category: string
  title: string
  author: string
  replies: number
  views: number
  updatedAt: string
  pinned?: boolean
  status: TopicStatus
}

const topics: BoardTopic[] = [
  {
    id: 'BRD-1042',
    category: 'Announcements',
    title: 'Design system release notes — July 2026',
    author: 'Mina Seo',
    replies: 18,
    views: 1248,
    updatedAt: '12 min ago',
    pinned: true,
    status: 'open',
  },
  {
    id: 'BRD-1039',
    category: 'Help',
    title: 'How should responsive table columns be prioritized?',
    author: 'Alex Kim',
    replies: 7,
    views: 213,
    updatedAt: '38 min ago',
    status: 'resolved',
  },
  {
    id: 'BRD-1037',
    category: 'Showcase',
    title: 'Sharing our new operations dashboard',
    author: 'Sam Lee',
    replies: 12,
    views: 489,
    updatedAt: '2 hours ago',
    status: 'open',
  },
  {
    id: 'BRD-1031',
    category: 'General',
    title: 'Patterns for keeping long-running jobs observable',
    author: 'Jordan Park',
    replies: 4,
    views: 176,
    updatedAt: 'Yesterday',
    status: 'open',
  },
  {
    id: 'BRD-1028',
    category: 'Help',
    title: 'Dark mode token fallback order',
    author: 'Taylor Ro',
    replies: 9,
    views: 352,
    updatedAt: 'Yesterday',
    status: 'resolved',
  },
  {
    id: 'BRD-1022',
    category: 'General',
    title: 'What are you building this week?',
    author: 'Chris Han',
    replies: 26,
    views: 801,
    updatedAt: 'Jul 22',
    status: 'open',
  },
  {
    id: 'BRD-1018',
    category: 'Showcase',
    title: 'A compact monitoring layout for small screens',
    author: 'Yuna Choi',
    replies: 5,
    views: 298,
    updatedAt: 'Jul 21',
    status: 'open',
  },
]

const columns: DataGridColumnDef<BoardTopic>[] = [
  {
    id: 'topic',
    accessorKey: 'title',
    header: 'Topic',
    meta: { flex: 1, minWidth: 320 },
    cell: ({ row }) => {
      const topic = row.original
      return (
        <div className="flex min-w-0 items-center gap-2">
          {topic.pinned && <Pin className="size-3.5 shrink-0 text-primary" />}
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate font-medium">{topic.title}</span>
              {topic.status === 'resolved' && (
                <Badge variant="secondary" className="hidden text-[10px] sm:inline-flex">
                  Resolved
                </Badge>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground sm:hidden">
              {topic.author} · {topic.replies} replies
            </span>
          </div>
        </div>
      )
    },
  },
  {
    id: 'category',
    accessorKey: 'category',
    header: 'Category',
    size: 130,
    cell: ({ row }) => <Badge variant="outline">{row.original.category}</Badge>,
  },
  {
    id: 'author',
    accessorKey: 'author',
    header: 'Author',
    size: 120,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.author}</span>,
  },
  {
    id: 'replies',
    accessorKey: 'replies',
    header: 'Replies',
    size: 72,
    meta: { align: 'right' },
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-1 tabular-nums">
        <MessageSquare className="size-3 text-muted-foreground" />
        {row.original.replies}
      </span>
    ),
  },
  {
    id: 'views',
    accessorKey: 'views',
    header: 'Views',
    size: 72,
    meta: { align: 'right' },
    cell: ({ row }) => <span className="tabular-nums">{row.original.views.toLocaleString()}</span>,
  },
  {
    id: 'updatedAt',
    accessorKey: 'updatedAt',
    header: 'Last activity',
    size: 110,
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{row.original.updatedAt}</span>
    ),
  },
]

export function BoardTableDemo({ theme }: { theme?: React.CSSProperties }) {
  const [selectedTopic, setSelectedTopic] = useState<string>()
  const isMobile = useIsMobile()

  return (
    <DataBodyTemplate
      theme={theme}
      className="layout-board-table"
      topBar={<PageTopBar left="Community / Board" />}
      title="Community board"
      description={
        selectedTopic
          ? `Selected “${selectedTopic}” — an application would navigate to the thread route.`
          : 'A traditional table-based discussion board powered by GridKit.'
      }
      actions={
        <Button size="sm">
          <Pencil className="size-3.5" />
          New topic
        </Button>
      }
    >
      <DataBodyTemplate.Body>
        <DataGrid
          data={topics}
          columns={columns}
          getRowId={(topic) => topic.id}
          onRowClick={(topic) => setSelectedTopic(topic.title)}
          rowCursor
          tableWidthMode="fill-last"
          visibilityState={
            isMobile
              ? { category: false, author: false, replies: false, views: false, updatedAt: false }
              : {}
          }
          headerLeft={(table) => <GlobalSearch table={table} placeholder="Search topics…" />}
          pagination={{ pageSize: 5 }}
          footer={(table: TanStackTable<BoardTopic>) => (
            <div className="flex h-9 items-center justify-between px-1 text-xs text-muted-foreground">
              <span>{topics.length} topics</span>
              <DataGridPaginationCompact table={table} />
            </div>
          )}
        />
      </DataBodyTemplate.Body>
    </DataBodyTemplate>
  )
}

export function buildBoardTableCode(_context: TemplateCodeContext) {
  return [
    `import { DataBodyTemplate, Button } from '@loykin/designkit'`,
    `import { DataGrid, GlobalSearch, DataGridPaginationCompact } from '@loykin/gridkit'`,
    ``,
    `<DataBodyTemplate title="Community board" actions={<Button>New topic</Button>}>`,
    `  <DataBodyTemplate.Body>`,
    `    <DataGrid`,
    `      data={topics}`,
    `      columns={columns}`,
    `      getRowId={(topic) => topic.id}`,
    `      onRowClick={(topic) => navigate(\`/topics/\${topic.id}\`)}`,
    `      rowCursor`,
    `      headerLeft={(table) => <GlobalSearch table={table} placeholder="Search topics…" />}`,
    `      pagination={{ pageSize: 20 }}`,
    `      footer={(table) => <DataGridPaginationCompact table={table} />}`,
    `    />`,
    `  </DataBodyTemplate.Body>`,
    `</DataBodyTemplate>`,
  ].join('\n')
}
