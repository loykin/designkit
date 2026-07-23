import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  DetailBodyTemplate,
  PageTopBar,
  Separator,
} from '@loykin/designkit'
import { Bookmark, CheckCircle2, Heart, MessageSquare, MoreHorizontal, Reply } from 'lucide-react'
import type { TemplateCodeContext } from '../../code'

interface ReplyItem {
  id: string
  author: string
  initials: string
  role?: string
  time: string
  body: string
  likes: number
  depth: number
}

const replies: ReplyItem[] = [
  {
    id: 'reply-1',
    author: 'Alex Kim',
    initials: 'AK',
    role: 'Maintainer',
    time: '34 minutes ago',
    body: 'Start with the decision users make most often. On narrow screens I keep the topic, status, and reply count, then move author and activity metadata into a second line.',
    likes: 14,
    depth: 0,
  },
  {
    id: 'reply-2',
    author: 'Mina Seo',
    initials: 'MS',
    time: '21 minutes ago',
    body: 'That makes sense. It also avoids turning the mobile view into a horizontally scrolling table.',
    likes: 5,
    depth: 1,
  },
  {
    id: 'reply-3',
    author: 'Jordan Park',
    initials: 'JP',
    time: '8 minutes ago',
    body: 'We use the same rule for operational tables: identity first, current state second, and everything else becomes progressive disclosure.',
    likes: 8,
    depth: 0,
  },
]

function ThreadHeader() {
  return (
    <header className="shrink-0 px-(--designkit-page-padding-x) pt-(--designkit-page-padding-y)">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
        <div className="min-w-0 max-w-4xl">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline">Help</Badge>
            <Badge variant="secondary">
              <CheckCircle2 className="size-3" />
              Resolved
            </Badge>
            <span className="text-xs text-muted-foreground">BRD-1039</span>
          </div>
          <h1 className="text-balance text-xl font-semibold leading-tight sm:text-2xl">
            How should responsive table columns be prioritized?
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Started by Sam Lee · 38 minutes ago · 213 views
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm">
            <Bookmark className="size-3.5" />
            Save
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="More actions">
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}

function Author({ name, initials, role }: { name: string; initials: string; role?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar>
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{name}</span>
          {role && (
            <Badge variant="outline" className="h-4 text-[10px]">
              {role}
            </Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground">Community member</span>
      </div>
    </div>
  )
}

function ReplyCard({ reply }: { reply: ReplyItem }) {
  return (
    <article className="relative" style={{ marginLeft: `${Math.min(reply.depth, 3) * 28}px` }}>
      {reply.depth > 0 && (
        <div className="absolute -left-4 top-0 h-full w-px bg-border" aria-hidden="true" />
      )}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <Author name={reply.author} initials={reply.initials} role={reply.role} />
          <span className="shrink-0 text-xs text-muted-foreground">{reply.time}</span>
        </div>
        <p className="mt-4 text-sm leading-6 text-foreground/90">{reply.body}</p>
        <div className="mt-3 flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
            <Heart className="size-3.5" />
            {reply.likes}
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
            <Reply className="size-3.5" />
            Reply
          </Button>
        </div>
      </div>
    </article>
  )
}

export function ThreadDetailDemo({ theme }: { theme?: React.CSSProperties }) {
  return (
    <DetailBodyTemplate
      theme={theme}
      className="layout-thread-detail"
      variant="full"
      topBar={<PageTopBar left="Community / Help / BRD-1039" />}
      header={<ThreadHeader />}
    >
      <article className="mx-auto max-w-4xl rounded-lg border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <Author name="Sam Lee" initials="SL" />
          <span className="text-xs text-muted-foreground">38 minutes ago</span>
        </div>
        <Separator className="my-5" />
        <div className="space-y-4 text-sm leading-7 text-foreground/90">
          <p>
            We have a discussion table with six columns on desktop: topic, category, author,
            replies, views, and last activity. Showing all of them on mobile makes the table
            difficult to scan.
          </p>
          <p>
            Which information should remain visible, and which values should move into the topic
            cell or the detail screen?
          </p>
        </div>
        <div className="mt-5 flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            <Heart className="size-3.5" />9
          </Button>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            <MessageSquare className="size-3.5" />
            Reply
          </Button>
        </div>
      </article>

      <DetailBodyTemplate.Section
        title="Replies"
        description={`${replies.length} replies · nested replies use progressive indentation`}
        className="mx-auto max-w-4xl"
      >
        <div className="space-y-3">
          {replies.map((reply) => (
            <ReplyCard key={reply.id} reply={reply} />
          ))}
        </div>
      </DetailBodyTemplate.Section>

      <section className="mx-auto max-w-4xl rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Join the discussion</h2>
        <textarea
          aria-label="Reply"
          placeholder="Write a thoughtful reply…"
          className="mt-3 min-h-28 w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <div className="mt-3 flex justify-end">
          <Button size="sm">Post reply</Button>
        </div>
      </section>
    </DetailBodyTemplate>
  )
}

export function buildThreadDetailCode(_context: TemplateCodeContext) {
  return [
    `import { DetailBodyTemplate, PageTopBar } from '@loykin/designkit'`,
    ``,
    `<DetailBodyTemplate`,
    `  variant="full"`,
    `  topBar={<PageTopBar left="Community / Topic" />}`,
    `  header={<ThreadHeader topic={topic} />}`,
    `>`,
    `  <ThreadPost post={topic} />`,
    `  <DetailBodyTemplate.Section title="Replies">`,
    `    <ThreadReplies replies={replies} />`,
    `  </DetailBodyTemplate.Section>`,
    `  <ReplyComposer onSubmit={createReply} />`,
    `</DetailBodyTemplate>`,
  ].join('\n')
}
