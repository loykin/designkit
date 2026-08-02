import { useMemo, useState } from 'react'
import {
  DataGrid,
  DataGridPaginationCompact,
  GlobalSearch,
  type DataGridColumnDef,
} from '@loykin/gridkit'
import type { Table as TanStackTable } from '@tanstack/react-table'
import { Badge, Button, DataBodyTemplate, PageTopBar, useIsMobile } from '@loykin/designkit'
import { ImageIcon, Pencil, Pin, Video } from 'lucide-react'
import type { TemplateCodeContext } from '../../code'

type TopicStatus = 'open' | 'resolved'
type TopicCategory = 'Announcements' | 'Help' | 'Showcase' | 'General'
type TopicAttachment = 'image' | 'video'
type TopicCategoryFilter = 'All' | TopicCategory

interface BoardTopic {
  id: string
  category: TopicCategory
  title: string
  author: string
  replies: number
  recommendations: number
  views: number
  updatedAt: string
  pinned?: boolean
  attachment?: TopicAttachment
  status: TopicStatus
}

interface BoardTableProps {
  topics: BoardTopic[]
  onTopicSelect: (topic: BoardTopic) => void
}

interface BoardTableToolbarProps {
  table: TanStackTable<BoardTopic>
  activeCategory: TopicCategoryFilter
  onCategoryChange: (category: TopicCategoryFilter) => void
}

interface BoardTableFooterProps {
  table: TanStackTable<BoardTopic>
  total: number
}

const topicCategoryFilters: TopicCategoryFilter[] = [
  'All',
  'Announcements',
  'Help',
  'Showcase',
  'General',
]

const topics: BoardTopic[] = [
  {
    id: 'BRD-1042',
    category: 'Announcements',
    title: 'Design system release notes — July 2026',
    author: 'Mina Seo',
    replies: 18,
    recommendations: 42,
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
    recommendations: 16,
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
    recommendations: 28,
    views: 489,
    updatedAt: '2 hours ago',
    attachment: 'image',
    status: 'open',
  },
  {
    id: 'BRD-1031',
    category: 'General',
    title: 'Patterns for keeping long-running jobs observable',
    author: 'Jordan Park',
    replies: 4,
    recommendations: 9,
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
    recommendations: 21,
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
    recommendations: 35,
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
    recommendations: 14,
    views: 298,
    updatedAt: 'Jul 21',
    attachment: 'image',
    status: 'open',
  },
  {
    id: 'BRD-1014',
    category: 'Help',
    title: 'Best way to preserve table state between routes?',
    author: 'Noah Lim',
    replies: 11,
    recommendations: 18,
    views: 427,
    updatedAt: 'Jul 20',
    status: 'resolved',
  },
  {
    id: 'BRD-1011',
    category: 'General',
    title: 'Monthly community feedback thread',
    author: 'Mina Seo',
    replies: 34,
    recommendations: 31,
    views: 962,
    updatedAt: 'Jul 19',
    pinned: true,
    status: 'open',
  },
  {
    id: 'BRD-1007',
    category: 'Showcase',
    title: 'Keyboard-first command palette prototype',
    author: 'Evan Yu',
    replies: 8,
    recommendations: 24,
    views: 516,
    updatedAt: 'Jul 18',
    attachment: 'video',
    status: 'open',
  },
  {
    id: 'BRD-1003',
    category: 'Help',
    title: 'Should destructive actions use a dialog or inline confirmation?',
    author: 'Sora Jung',
    replies: 15,
    recommendations: 27,
    views: 684,
    updatedAt: 'Jul 17',
    status: 'resolved',
  },
  {
    id: 'BRD-0998',
    category: 'General',
    title: 'Share your favorite empty-state examples',
    author: 'Jamie Oh',
    replies: 22,
    recommendations: 19,
    views: 731,
    updatedAt: 'Jul 16',
    status: 'open',
  },
  {
    id: 'BRD-0994',
    category: 'Showcase',
    title: 'Responsive navigation study for dense admin tools',
    author: 'Rina Cho',
    replies: 6,
    recommendations: 17,
    views: 408,
    updatedAt: 'Jul 15',
    attachment: 'image',
    status: 'open',
  },
  {
    id: 'BRD-0989',
    category: 'Help',
    title: 'How do you name semantic color tokens across products?',
    author: 'Leo Moon',
    replies: 13,
    recommendations: 23,
    views: 599,
    updatedAt: 'Jul 14',
    status: 'resolved',
  },
  {
    id: 'BRD-0983',
    category: 'General',
    title: 'Design critique office hours — July schedule',
    author: 'Mina Seo',
    replies: 3,
    recommendations: 12,
    views: 344,
    updatedAt: 'Jul 12',
    status: 'open',
  },
  {
    id: 'BRD-0978',
    category: 'Showcase',
    title: 'A split-pane workflow for reviewing large datasets',
    author: 'Owen Kim',
    replies: 10,
    recommendations: 26,
    views: 812,
    updatedAt: 'Jul 11',
    attachment: 'video',
    status: 'open',
  },
  {
    id: 'BRD-0971',
    category: 'General',
    title: 'What should we improve in the next release?',
    author: 'Chris Han',
    replies: 41,
    recommendations: 38,
    views: 1106,
    updatedAt: 'Jul 9',
    status: 'open',
  },
  {
    id: 'BRD-0966',
    category: 'Help',
    title: 'Accessible labels for icon-only table actions',
    author: 'Dana Lee',
    replies: 9,
    recommendations: 20,
    views: 477,
    updatedAt: 'Jul 8',
    status: 'resolved',
  },
]

const columns: DataGridColumnDef<BoardTopic>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'No.',
    size: 72,
    cell: ({ row }) => (
      <span className={row.original.pinned ? 'font-medium text-primary' : 'text-muted-foreground'}>
        {row.original.pinned ? 'Notice' : row.original.id.replace('BRD-', '')}
      </span>
    ),
  },
  {
    id: 'category',
    accessorKey: 'category',
    header: 'Category',
    size: 110,
    cell: ({ row }) => <Badge variant="outline">{row.original.category}</Badge>,
  },
  {
    id: 'topic',
    accessorKey: 'title',
    header: 'Title',
    meta: { flex: 1, minWidth: 320, wrap: true },
    cell: ({ row }) => {
      const topic = row.original
      return (
        <div className="min-w-0 py-1">
          <div className="flex min-w-0 items-center gap-1.5">
            {topic.pinned && <Pin className="size-3.5 shrink-0 text-primary" />}
            <span className="min-w-0 flex-1 truncate font-medium">{topic.title}</span>
            {topic.replies > 0 && (
              <span className="shrink-0 text-xs font-medium text-primary">[{topic.replies}]</span>
            )}
            {topic.attachment === 'image' && (
              <ImageIcon className="size-3.5 shrink-0 text-muted-foreground" />
            )}
            {topic.attachment === 'video' && (
              <Video className="size-3.5 shrink-0 text-muted-foreground" />
            )}
            {topic.status === 'resolved' && (
              <Badge variant="secondary" className="hidden h-5 px-1.5 text-[10px] sm:inline-flex">
                Solved
              </Badge>
            )}
          </div>
          <span className="mt-0.5 block truncate text-[11px] text-muted-foreground sm:hidden">
            {topic.category} · {topic.author} · {topic.views.toLocaleString()} views ·{' '}
            {topic.updatedAt}
          </span>
        </div>
      )
    },
  },
  {
    id: 'author',
    accessorKey: 'author',
    header: 'Author',
    size: 110,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.author}</span>,
  },
  {
    id: 'recommendations',
    accessorKey: 'recommendations',
    header: 'Likes',
    size: 60,
    meta: { align: 'right' },
    cell: ({ row }) => <span className="tabular-nums">{row.original.recommendations}</span>,
  },
  {
    id: 'views',
    accessorKey: 'views',
    header: 'Views',
    size: 68,
    meta: { align: 'right' },
    cell: ({ row }) => <span className="tabular-nums">{row.original.views.toLocaleString()}</span>,
  },
  {
    id: 'updatedAt',
    accessorKey: 'updatedAt',
    header: 'Last activity',
    size: 100,
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{row.original.updatedAt}</span>
    ),
  },
]

function selectVisibleTopics(topics: BoardTopic[], category: TopicCategoryFilter) {
  const filteredTopics =
    category === 'All' ? topics : topics.filter((topic) => topic.category === category)

  return [...filteredTopics].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)))
}

function useBoardTopics(topics: BoardTopic[]) {
  const [activeCategory, setActiveCategory] = useState<TopicCategoryFilter>('All')
  const visibleTopics = useMemo(
    () => selectVisibleTopics(topics, activeCategory),
    [topics, activeCategory],
  )

  return { activeCategory, setActiveCategory, visibleTopics }
}

function BoardTableToolbar({ table, activeCategory, onCategoryChange }: BoardTableToolbarProps) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <GlobalSearch table={table} placeholder="Search topics…" />
      <div className="flex items-center gap-1 overflow-x-auto">
        {topicCategoryFilters.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 shrink-0 px-2.5 text-xs"
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  )
}

function BoardTableFooter({ table, total }: BoardTableFooterProps) {
  return (
    <div className="grid min-h-10 grid-cols-[1fr_auto_1fr] items-center gap-2 px-1 text-xs text-muted-foreground">
      <span className="hidden sm:block">{total} posts</span>
      <div className="col-start-2">
        <DataGridPaginationCompact table={table} />
      </div>
      <Button variant="outline" size="sm" className="justify-self-end">
        <Pencil className="size-3.5" />
        <span className="hidden sm:inline">Write</span>
      </Button>
    </div>
  )
}

function BoardTable({ topics, onTopicSelect }: BoardTableProps) {
  const isMobile = useIsMobile()
  const { activeCategory, setActiveCategory, visibleTopics } = useBoardTopics(topics)

  return (
    <DataGrid
      data={visibleTopics}
      columns={columns}
      getRowId={(topic) => topic.id}
      onRowClick={onTopicSelect}
      rowCursor
      tableWidthMode="fill-last"
      enableSorting={false}
      rowHeight={42}
      visibilityState={
        isMobile
          ? {
              id: false,
              category: false,
              author: false,
              recommendations: false,
              views: false,
              updatedAt: false,
            }
          : {}
      }
      headerLeft={(table) => (
        <BoardTableToolbar
          table={table}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      )}
      pagination={{ pageSize: 12 }}
      footer={(table) => <BoardTableFooter table={table} total={visibleTopics.length} />}
    />
  )
}

export function BoardTableDemo({ theme }: { theme?: React.CSSProperties }) {
  const [selectedTopic, setSelectedTopic] = useState<string>()

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
        <BoardTable topics={topics} onTopicSelect={(topic) => setSelectedTopic(topic.title)} />
      </DataBodyTemplate.Body>
    </DataBodyTemplate>
  )
}

export function buildBoardTableCode(_context: TemplateCodeContext) {
  return [
    `import { DataBodyTemplate, Button } from '@loykin/designkit'`,
    `import { DataGrid, GlobalSearch, DataGridPaginationCompact } from '@loykin/gridkit'`,
    ``,
    `function BoardTable({ topics, onTopicSelect }) {`,
    `  // Keep category/query state and board-specific ordering inside this boundary.`,
    `  const visibleTopics = useBoardTopics(topics)`,
    ``,
    `  return (`,
    `    <DataGrid`,
    `      data={visibleTopics}`,
    `      columns={columns}`,
    `      getRowId={(topic) => topic.id}`,
    `      onRowClick={onTopicSelect}`,
    `      rowCursor`,
    `      enableSorting={false}`,
    `      rowHeight={42}`,
    `      headerLeft={(table) => <BoardTableToolbar table={table} />}`,
    `      pagination={{ pageSize: 12 }}`,
    `      footer={(table) => <BoardTableFooter table={table} total={visibleTopics.length} />}`,
    `    />`,
    `  )`,
    `}`,
    ``,
    `<DataBodyTemplate title="Community board" actions={<Button>New topic</Button>}>`,
    `  <DataBodyTemplate.Body>`,
    `    <BoardTable topics={topics} onTopicSelect={(topic) => navigate(\`/topics/\${topic.id}\`)} />`,
    `  </DataBodyTemplate.Body>`,
    `</DataBodyTemplate>`,
  ].join('\n')
}
