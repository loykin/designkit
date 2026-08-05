import { useMemo } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { DataGridCard, GlobalSearch, type DataGridColumnDef } from '@loykin/gridkit'
import type { Row } from '@tanstack/react-table'
import {
  ArticleBody,
  ArticleBodySkeleton,
  ArticleByline,
  ArticleCardPreview,
  ArticleCover,
  ArticleToc,
  type ArticleTone,
  Button,
  DataBodyTemplate,
  DetailBodyTemplate,
  PageTopBar,
  Separator,
} from '@loykin/designkit'
import { ArrowLeft, ArrowUpRight, Feather } from 'lucide-react'

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
  accent: ArticleTone
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
    accent: 'violet',
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
    accent: 'emerald',
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
    accent: 'amber',
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
    <ArticleCardPreview
      tone={article.accent}
      category={article.category}
      title={article.title}
      excerpt={article.excerpt}
      author={article.author}
      initials={article.initials}
      readTime={article.readTime}
      coverContent={
        <>
          <Feather className="absolute bottom-4 left-4 size-7 text-white/90" />
          <ArrowUpRight className="absolute right-4 top-4 size-4 text-white/80" />
        </>
      }
    />
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
        <ArticleBodySkeleton />
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
        <ArticleToc
          items={[
            { href: '#layout', label: 'Start with the route', emphasis: true },
            { href: '#boundaries', label: 'Keep query boundaries local' },
          ]}
        />
      }
    >
      <ArticleBody>
        <ArticleCover tone={article.accent} className="h-56 rounded-xl" />
        <ArticleByline author={article.author} initials={article.initials} meta={article.readTime} />
        <Separator />
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
      </ArticleBody>
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
