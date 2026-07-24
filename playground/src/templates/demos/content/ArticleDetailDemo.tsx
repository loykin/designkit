import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  DetailBodyTemplate,
  PageTopBar,
  Separator,
} from '@loykin/designkit'
import { Bookmark, Clock, Heart, Link2, MessageSquare, Share2 } from 'lucide-react'
import type { TemplateCodeContext } from '../../code'

function ArticleHeader() {
  return (
    <header className="shrink-0 px-(--designkit-page-padding-x) pt-(--designkit-page-padding-y)">
      <div className="mx-auto max-w-5xl border-b border-border pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Design systems</Badge>
          <span className="text-xs text-muted-foreground">Jul 23, 2026</span>
        </div>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="text-balance text-2xl font-semibold leading-tight sm:text-3xl">
              Designing component APIs that stay useful
            </h1>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              A practical framework for deciding when a visual pattern deserves a reusable public
              API—and when a good example is enough.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Bookmark className="size-3.5" />
              Save
            </Button>
            <Button variant="outline" size="icon-sm" aria-label="Share article">
              <Share2 className="size-3.5" />
            </Button>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <Avatar>
            <AvatarFallback>MS</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Mina Seo</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              Principal designer
              <span>·</span>
              <Clock className="size-3" />7 min read
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

function ArticleAside() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          On this page
        </p>
        <nav className="mt-3 space-y-1 text-sm">
          <a
            className="block rounded-md bg-accent px-2.5 py-2 font-medium"
            href="#start-with-layout"
          >
            Start with layout
          </a>
          <a
            className="block rounded-md px-2.5 py-2 text-muted-foreground hover:bg-muted"
            href="#promote"
          >
            Promote repeated behavior
          </a>
          <a
            className="block rounded-md px-2.5 py-2 text-muted-foreground hover:bg-muted"
            href="#examples"
          >
            Examples are part of the API
          </a>
        </nav>
      </div>
      <Separator />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tags</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="secondary">API design</Badge>
          <Badge variant="secondary">React</Badge>
          <Badge variant="secondary">Patterns</Badge>
        </div>
      </div>
    </div>
  )
}

function Comment({
  initials,
  author,
  time,
  children,
}: {
  initials: string
  author: string
  time: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-3">
      <Avatar size="sm">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1 rounded-lg border border-border bg-card p-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">{author}</span>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <p className="mt-2 text-sm leading-6 text-foreground/85">{children}</p>
      </div>
    </div>
  )
}

export function ArticleDetailDemo({ theme }: { theme?: React.CSSProperties }) {
  return (
    <DetailBodyTemplate
      theme={theme}
      className="layout-article-detail"
      variant="record"
      topBar={<PageTopBar left="Journal / Design systems" />}
      header={<ArticleHeader />}
      aside={<ArticleAside />}
      layoutClassName="mx-auto w-full max-w-[calc(64rem+2*var(--designkit-page-padding-x))]"
    >
      <article className="mx-auto max-w-3xl">
        <div className="relative mb-8 h-48 overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-500 sm:h-64">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.4),transparent_30%)]" />
          <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-white/20 bg-black/15 p-4 text-sm text-white/90 backdrop-blur-sm">
            Good abstractions preserve room for the next use case.
          </div>
        </div>

        <div className="space-y-6 text-[15px] leading-7 text-foreground/90">
          <p className="text-lg leading-8 text-foreground">
            A component should not become public merely because it appears once. The strongest APIs
            emerge after a layout has survived real content, interaction, and responsive
            constraints.
          </p>

          <section id="start-with-layout" className="scroll-mt-6">
            <h2 className="mb-3 text-xl font-semibold text-foreground">Start with layout</h2>
            <p>
              Page templates should describe stable spatial relationships: headers, toolbars,
              content regions, sidebars, and scroll ownership. A discussion board and a blog can
              share those relationships even though their content models are different.
            </p>
          </section>

          <blockquote className="border-l-2 border-primary pl-4 text-base italic text-muted-foreground">
            Reuse the page shell first. Promote the content component only after its behavior
            repeats.
          </blockquote>

          <section id="promote" className="scroll-mt-6">
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Promote repeated behavior
            </h2>
            <p>
              If several products need nested replies, author metadata, moderation actions, and the
              same collapse rules, that is evidence for a reusable thread component. Until then,
              keeping the composition in the example protects the public API from premature domain
              assumptions.
            </p>
          </section>

          <section id="examples" className="scroll-mt-6">
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Examples are part of the API
            </h2>
            <p>
              A complete example establishes the intended combination of templates, GridKit views,
              and DesignKit primitives. It gives consumers a supported path without making every
              visual pattern a new package export.
            </p>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-y border-border py-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Heart className="size-3.5" />
              42
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="size-3.5" />2 comments
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <Link2 className="size-3.5" />
            Copy link
          </Button>
        </div>

        <Card className="mt-8">
          <CardContent>
            <h2 className="text-base font-semibold">Discussion</h2>
            <div className="mt-4 space-y-3">
              <Comment initials="AK" author="Alex Kim" time="2 hours ago">
                The distinction between a layout contract and a content model is especially helpful
                here.
              </Comment>
              <Comment initials="JP" author="Jordan Park" time="48 minutes ago">
                Shipping the examples first also gives us something concrete to test on both shells
                before introducing another public component.
              </Comment>
            </div>
          </CardContent>
        </Card>
      </article>
    </DetailBodyTemplate>
  )
}

export function buildArticleDetailCode(_context: TemplateCodeContext) {
  return [
    `import { DetailBodyTemplate, PageTopBar } from '@loykin/designkit'`,
    ``,
    `<DetailBodyTemplate`,
    `  variant="record"`,
    `  topBar={<PageTopBar left="Journal / Category" />}`,
    `  header={<ArticleHeader article={article} />}`,
    `  aside={<ArticleTableOfContents article={article} />}`,
    `>`,
    `  <article className="mx-auto max-w-3xl">`,
    `    <ArticleBody content={article.content} />`,
    `    <CommentSection articleId={article.id} />`,
    `  </article>`,
    `</DetailBodyTemplate>`,
  ].join('\n')
}
