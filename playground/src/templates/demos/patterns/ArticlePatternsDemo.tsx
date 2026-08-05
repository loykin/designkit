import type { CSSProperties } from 'react'
import {
  ArticleBody,
  ArticleBodySkeleton,
  ArticleByline,
  ArticleCardPreview,
  ArticleCover,
  ArticleToc,
  type ArticleTone,
  DataBodyTemplate,
  InteractiveCard,
  PageTopBar,
} from '@loykin/designkit'
import { ArrowUpRight, Feather } from 'lucide-react'

const TONES: ArticleTone[] = ['violet', 'emerald', 'amber', 'rose', 'sky', 'slate']

export function ArticlePatternsDemo({ theme }: { theme?: CSSProperties }) {
  return (
    <DataBodyTemplate
      theme={theme}
      className="layout-article-patterns"
      topBar={<PageTopBar left="Patterns / Article" />}
      title="Article patterns"
      description="The reusable pieces the Publishing guide and Blog Feed demo compose — not a page of its own."
    >
      <DataBodyTemplate.Group
        layout="stacked"
        title="Card preview"
        description="ArticleCardPreview — the full grid-card shape: cover, category, title, excerpt, byline, read time."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {(['violet', 'emerald', 'amber'] as const).map((tone) => (
            <ArticleCardPreview
              key={tone}
              tone={tone}
              category="Design systems"
              title="Designing component APIs that stay useful"
              excerpt="A practical framework for deciding when a visual pattern deserves a reusable API."
              author="Mina Seo"
              initials="MS"
              readTime="7 min read"
              coverContent={
                <>
                  <Feather className="absolute bottom-4 left-4 size-7 text-white/90" />
                  <ArrowUpRight className="absolute right-4 top-4 size-4 text-white/80" />
                </>
              }
            />
          ))}
        </div>
      </DataBodyTemplate.Group>

      <DataBodyTemplate.Group
        layout="stacked"
        title="Cover tones"
        description="ArticleCover — a semantic tone maps to a bundled gradient; domain data never stores a raw Tailwind class string."
      >
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {TONES.map((tone) => (
            <div key={tone} className="space-y-1.5">
              <ArticleCover tone={tone} className="h-16 rounded-(--radius)" />
              <p className="text-center text-xs text-muted-foreground">{tone}</p>
            </div>
          ))}
        </div>
      </DataBodyTemplate.Group>

      <DataBodyTemplate.Group
        layout="stacked"
        title="Byline"
        description="ArticleByline — author avatar and name, with an optional secondary meta line."
      >
        <div className="flex flex-wrap items-center gap-8">
          <ArticleByline author="Alex Kim" initials="AK" size="sm" />
          <ArticleByline author="Alex Kim" initials="AK" meta="5 min read" />
        </div>
      </DataBodyTemplate.Group>

      <DataBodyTemplate.Group
        layout="stacked"
        title="Body and table of contents"
        description="ArticleBody's reading typography next to ArticleToc, the shapes the article page uses."
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_14rem]">
          <ArticleBody className="mx-0 max-w-none">
            <p className="text-lg">
              Body copy stays at a fixed line height and type scale wherever it appears.
            </p>
            <p>
              Swap the content per page; the reading shell — width, spacing, typography — comes
              from the pattern, not from a per-page className block.
            </p>
          </ArticleBody>
          <ArticleToc
            items={[
              { href: '#a', label: 'Section one', emphasis: true },
              { href: '#b', label: 'Section two' },
            ]}
          />
        </div>
      </DataBodyTemplate.Group>

      <DataBodyTemplate.Group
        layout="stacked"
        title="Loading skeleton"
        description="ArticleBodySkeleton — a placeholder matching ArticleBody's reading width."
      >
        <ArticleBodySkeleton className="mx-0 max-w-none" />
      </DataBodyTemplate.Group>

      <DataBodyTemplate.Group
        layout="stacked"
        title="Interactive card"
        description="InteractiveCard — the hover-lift clickable shell every card above is built on."
      >
        <div className="max-w-xs">
          <InteractiveCard>
            <div className="p-4">
              <p className="text-sm font-medium">Any content</p>
              <p className="text-xs text-muted-foreground">Hover to see the lift and shadow.</p>
            </div>
          </InteractiveCard>
        </div>
      </DataBodyTemplate.Group>
    </DataBodyTemplate>
  )
}
