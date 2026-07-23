import { DataGridCard, GlobalSearch, type DataGridColumnDef } from '@loykin/gridkit'
import type { Row } from '@tanstack/react-table'
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  DataBodyTemplate,
  PageTopBar,
} from '@loykin/designkit'
import { ArrowUpRight, Clock, Feather } from 'lucide-react'
import type { TemplateCodeContext } from '../../code'

interface ArticleSummary {
  id: string
  category: string
  title: string
  excerpt: string
  author: string
  initials: string
  publishedAt: string
  readTime: string
  accent: string
}

const articles: ArticleSummary[] = [
  {
    id: 'article-1',
    category: 'Design systems',
    title: 'Designing component APIs that stay useful',
    excerpt:
      'A practical framework for deciding when a visual pattern deserves a reusable public API.',
    author: 'Mina Seo',
    initials: 'MS',
    publishedAt: 'Jul 23, 2026',
    readTime: '7 min read',
    accent: 'from-violet-500/80 via-indigo-500/70 to-sky-500/70',
  },
  {
    id: 'article-2',
    category: 'Engineering',
    title: 'The quiet power of bounded layout contracts',
    excerpt:
      'How a small flexbox agreement lets tables, charts, and editors share the same page shell.',
    author: 'Alex Kim',
    initials: 'AK',
    publishedAt: 'Jul 21, 2026',
    readTime: '5 min read',
    accent: 'from-emerald-500/80 via-teal-500/70 to-cyan-500/70',
  },
  {
    id: 'article-3',
    category: 'Product',
    title: 'Choosing the right density for operational tools',
    excerpt:
      'Compact is not always efficient. Match information density to the decisions people need to make.',
    author: 'Jordan Park',
    initials: 'JP',
    publishedAt: 'Jul 18, 2026',
    readTime: '6 min read',
    accent: 'from-amber-500/80 via-orange-500/70 to-rose-500/70',
  },
  {
    id: 'article-4',
    category: 'Accessibility',
    title: 'Focus states are part of the visual language',
    excerpt: 'Treat keyboard focus as a first-class state instead of an outline added at the end.',
    author: 'Yuna Choi',
    initials: 'YC',
    publishedAt: 'Jul 15, 2026',
    readTime: '4 min read',
    accent: 'from-fuchsia-500/80 via-pink-500/70 to-rose-500/70',
  },
  {
    id: 'article-5',
    category: 'Research',
    title: 'What users expect from table navigation',
    excerpt:
      'Observations from testing row selection, inline actions, and detail-page transitions.',
    author: 'Sam Lee',
    initials: 'SL',
    publishedAt: 'Jul 11, 2026',
    readTime: '8 min read',
    accent: 'from-blue-500/80 via-cyan-500/70 to-emerald-500/70',
  },
  {
    id: 'article-6',
    category: 'Design systems',
    title: 'Semantic tokens across a family of packages',
    excerpt:
      'Shared meaning creates interoperability without forcing every package into the same namespace.',
    author: 'Taylor Ro',
    initials: 'TR',
    publishedAt: 'Jul 8, 2026',
    readTime: '9 min read',
    accent: 'from-slate-500/80 via-zinc-500/70 to-neutral-500/70',
  },
]

const searchColumns: DataGridColumnDef<ArticleSummary>[] = [
  { id: 'title', accessorKey: 'title', header: 'Title' },
  { id: 'category', accessorKey: 'category', header: 'Category' },
  { id: 'author', accessorKey: 'author', header: 'Author' },
]

function ArticleCard({ row }: { row: Row<ArticleSummary> }) {
  const article = row.original

  return (
    <Card className="group h-full cursor-pointer gap-0 py-0 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className={`relative h-28 overflow-hidden bg-gradient-to-br ${article.accent}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.35),transparent_35%)]" />
        <Feather className="absolute bottom-4 left-4 size-7 text-white/90" />
        <ArrowUpRight className="absolute right-4 top-4 size-4 text-white/80 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <CardContent className="flex flex-1 flex-col px-4 py-4">
        <Badge variant="outline" className="mb-3">
          {article.category}
        </Badge>
        <h2 className="text-base font-semibold leading-snug">{article.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">
          {article.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar size="sm">
              <AvatarFallback>{article.initials}</AvatarFallback>
            </Avatar>
            <span className="truncate text-xs font-medium">{article.author}</span>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="size-3" />
            {article.readTime}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export function BlogFeedDemo({ theme }: { theme?: React.CSSProperties }) {
  return (
    <DataBodyTemplate
      theme={theme}
      className="layout-blog-feed"
      topBar={<PageTopBar left="Content / Journal" />}
      title="DesignKit journal"
      description="Ideas about component systems, product design, and frontend architecture."
      actions={<Button size="sm">Subscribe</Button>}
    >
      <DataBodyTemplate.Body className="h-full">
        <DataGridCard
          data={articles}
          columns={searchColumns}
          getRowId={(article) => article.id}
          renderCard={(row) => <ArticleCard row={row} />}
          headerLeft={(table) => <GlobalSearch table={table} placeholder="Search articles…" />}
          minCardWidth={280}
          minColumns={1}
          classNames={{ cardGrid: 'items-stretch' }}
        />
      </DataBodyTemplate.Body>
    </DataBodyTemplate>
  )
}

export function buildBlogFeedCode(_context: TemplateCodeContext) {
  return [
    `import { DataBodyTemplate } from '@loykin/designkit'`,
    `import { DataGridCard, GlobalSearch } from '@loykin/gridkit'`,
    ``,
    `<DataBodyTemplate title="Journal" description="Latest stories and ideas">`,
    `  <DataBodyTemplate.Body>`,
    `    <DataGridCard`,
    `      data={articles}`,
    `      columns={searchColumns}`,
    `      getRowId={(article) => article.id}`,
    `      renderCard={(row) => <ArticleCard article={row.original} />}`,
    `      headerLeft={(table) => <GlobalSearch table={table} placeholder="Search articles…" />}`,
    `      minCardWidth={280}`,
    `      minColumns={1}`,
    `    />`,
    `  </DataBodyTemplate.Body>`,
    `</DataBodyTemplate>`,
  ].join('\n')
}
