import { useMemo } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
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
  DetailBodyTemplate,
  PageTopBar,
  Separator,
} from '@loykin/designkit'
import { ArrowLeft, ArrowUpRight, Clock, Feather } from 'lucide-react'

interface Article {
  id: string
  slug: string
  category: string
  title: string
  excerpt: string
  author: string
  initials: string
  publishedAt: string
  publishedAtMs: number
  readTime: string
  accent: string
}

const ARTICLES: Article[] = [
  {
    id: 'article-1',
    slug: 'component-apis-that-stay-useful',
    category: 'Design systems',
    title: 'Designing component APIs that stay useful',
    excerpt: 'A practical framework for deciding when a visual pattern deserves a reusable API.',
    author: 'Mina Seo',
    initials: 'MS',
    publishedAt: 'Jul 23, 2026',
    publishedAtMs: Date.UTC(2026, 6, 23),
    readTime: '7 min read',
    accent: 'from-violet-500/80 via-indigo-500/70 to-sky-500/70',
  },
  {
    id: 'article-2',
    slug: 'bounded-layout-contracts',
    category: 'Engineering',
    title: 'The quiet power of bounded layout contracts',
    excerpt: 'How tables, charts, and editors can safely share the same page shell.',
    author: 'Alex Kim',
    initials: 'AK',
    publishedAt: 'Jul 21, 2026',
    publishedAtMs: Date.UTC(2026, 6, 21),
    readTime: '5 min read',
    accent: 'from-emerald-500/80 via-teal-500/70 to-cyan-500/70',
  },
  {
    id: 'article-3',
    slug: 'density-for-operational-tools',
    category: 'Product',
    title: 'Choosing the right density for operational tools',
    excerpt: 'Match information density to the decisions people actually need to make.',
    author: 'Jordan Park',
    initials: 'JP',
    publishedAt: 'Jul 18, 2026',
    publishedAtMs: Date.UTC(2026, 6, 18),
    readTime: '6 min read',
    accent: 'from-amber-500/80 via-orange-500/70 to-rose-500/70',
  },
]

const columns: DataGridColumnDef<Article>[] = [
  { id: 'title', accessorKey: 'title', header: 'Title' },
  { id: 'category', accessorKey: 'category', header: 'Category' },
  { id: 'author', accessorKey: 'author', header: 'Author' },
  { id: 'publishedAt', accessorKey: 'publishedAtMs', header: 'Published' },
]

const publishingQueryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 30_000 } },
})

async function getArticles() {
  await new Promise((resolve) => setTimeout(resolve, 280))
  return [...ARTICLES].sort((a, b) => b.publishedAtMs - a.publishedAtMs)
}

async function getArticle(slug: string) {
  await new Promise((resolve) => setTimeout(resolve, 180))
  return ARTICLES.find((article) => article.slug === slug) ?? null
}

function ArticleCard({ row }: { row: Row<Article> }) {
  const article = row.original
  return (
    <Card className="group h-full cursor-pointer gap-0 overflow-hidden py-0 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className={`relative h-32 bg-gradient-to-br ${article.accent}`}>
        <Feather className="absolute bottom-4 left-4 size-7 text-white/90" />
        <ArrowUpRight className="absolute right-4 top-4 size-4 text-white/80" />
      </div>
      <CardContent className="flex flex-1 flex-col p-4">
        <Badge variant="outline" className="mb-3">
          {article.category}
        </Badge>
        <h2 className="text-base font-semibold leading-snug">{article.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarFallback>{article.initials}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium">{article.author}</span>
          </div>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            {article.readTime}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function PublishingList({ theme, basePath }: { theme?: React.CSSProperties; basePath: string }) {
  const navigate = useNavigate()
  const articlesQuery = useQuery({
    queryKey: ['guide', 'publishing', 'articles'],
    queryFn: getArticles,
  })

  return (
    <DataBodyTemplate
      theme={theme}
      className="layout-guide-publishing"
      topBar={<PageTopBar left="Guides / Publishing" />}
      title="Journal"
      description="A complete collection-to-article route, not a standalone card design."
      actions={<Button size="sm">New article</Button>}
    >
      <DataBodyTemplate.Body className="h-full">
        <DataGridCard
          data={articlesQuery.data ?? []}
          columns={columns}
          getRowId={(article) => article.id}
          initialSorting={[{ id: 'publishedAt', desc: true }]}
          isLoading={articlesQuery.isLoading}
          onRowClick={(article) => navigate(`${basePath}/${article.slug}`)}
          renderCard={(row) => <ArticleCard row={row} />}
          headerLeft={(table) => <GlobalSearch table={table} placeholder="Search articles…" />}
          minCardWidth={280}
          minColumns={1}
          classNames={{ content: 'items-stretch' }}
        />
      </DataBodyTemplate.Body>
    </DataBodyTemplate>
  )
}

function PublishingArticle({
  theme,
  slug,
  basePath,
}: {
  theme?: React.CSSProperties
  slug: string
  basePath: string
}) {
  const navigate = useNavigate()
  const articleQuery = useQuery({
    queryKey: ['guide', 'publishing', 'article', slug],
    queryFn: () => getArticle(slug),
  })
  const article = articleQuery.data

  if (articleQuery.isLoading) {
    return (
      <DetailBodyTemplate
        theme={theme}
        topBar={<PageTopBar left="Guides / Publishing / Article" />}
      >
        <div className="mx-auto max-w-3xl space-y-4 animate-pulse">
          <div className="h-8 w-2/3 rounded bg-muted" />
          <div className="h-56 rounded-xl bg-muted" />
        </div>
      </DetailBodyTemplate>
    )
  }

  if (!article) {
    return (
      <DetailBodyTemplate
        theme={theme}
        topBar={<PageTopBar left="Guides / Publishing / Not found" />}
      >
        <Button onClick={() => navigate(basePath)}>Back to Journal</Button>
      </DetailBodyTemplate>
    )
  }

  return (
    <DetailBodyTemplate
      theme={theme}
      className="layout-guide-publishing"
      variant="record"
      topBar={
        <PageTopBar
          left={
            <Button variant="ghost" size="sm" onClick={() => navigate(basePath)}>
              <ArrowLeft className="size-4" />
              Journal / {article.category}
            </Button>
          }
        />
      }
      header={
        <DetailBodyTemplate.Header
          eyebrow={`${article.category} · ${article.publishedAt}`}
          title={article.title}
          description={article.excerpt}
          actions={
            <Button size="sm" variant="outline">
              Save
            </Button>
          }
        />
      }
      aside={
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            On this page
          </p>
          <a href="#layout" className="block text-sm font-medium">
            Start with the route
          </a>
          <a href="#boundaries" className="block text-sm text-muted-foreground">
            Keep query boundaries local
          </a>
        </div>
      }
    >
      <article className="mx-auto max-w-3xl">
        <div className={`mb-8 h-56 rounded-xl bg-gradient-to-br ${article.accent}`} />
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{article.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{article.author}</p>
            <p className="text-xs text-muted-foreground">{article.readTime}</p>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="space-y-6 text-[15px] leading-7">
          <p className="text-lg">
            The list and article are separate route destinations that share a publishing domain, not
            one page template nested inside another.
          </p>
          <section id="layout">
            <h2 className="mb-2 text-xl font-semibold">Start with the route</h2>
            <p>
              Use DataBodyTemplate for the collection and DetailBodyTemplate for the article. The
              card only initiates navigation.
            </p>
          </section>
          <section id="boundaries">
            <h2 className="mb-2 text-xl font-semibold">Keep query boundaries local</h2>
            <p>
              The collection query can refetch without replacing the article page, while the detail
              query owns only the selected slug.
            </p>
          </section>
        </div>
      </article>
    </DetailBodyTemplate>
  )
}

function PublishingWorkflow({ theme }: { theme?: React.CSSProperties }) {
  const location = useLocation()
  const basePath = location.pathname.split('/').slice(0, 3).join('/')
  const slug = location.pathname.slice(basePath.length + 1)
  return slug ? (
    <PublishingArticle theme={theme} slug={slug} basePath={basePath} />
  ) : (
    <PublishingList theme={theme} basePath={basePath} />
  )
}

export function PublishingWorkflowGuide({ theme }: { theme?: React.CSSProperties }) {
  const client = useMemo(() => publishingQueryClient, [])
  return (
    <QueryClientProvider client={client}>
      <PublishingWorkflow theme={theme} />
    </QueryClientProvider>
  )
}
