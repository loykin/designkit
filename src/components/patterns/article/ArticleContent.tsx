import * as React from 'react'
import { Clock } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { InteractiveCard } from '../card/InteractiveCard'

export type ArticleTone = 'violet' | 'emerald' | 'amber' | 'rose' | 'sky' | 'slate'

const articleToneGradients: Record<ArticleTone, string> = {
  violet: 'from-violet-500/80 via-indigo-500/70 to-sky-500/70',
  emerald: 'from-emerald-500/80 via-teal-500/70 to-cyan-500/70',
  amber: 'from-amber-500/80 via-orange-500/70 to-rose-500/70',
  rose: 'from-rose-500/80 via-pink-500/70 to-fuchsia-500/70',
  sky: 'from-sky-500/80 via-blue-500/70 to-indigo-500/70',
  slate: 'from-slate-500/80 via-slate-600/70 to-slate-700/70',
}

export interface ArticleCoverProps {
  /** Semantic accent — maps to a bundled gradient so domain data never stores Tailwind class strings. */
  tone: ArticleTone
  className?: string
  children?: React.ReactNode
}

/** Gradient cover block for an article thumbnail or hero. Size it via `className` (e.g. `h-32` or `h-56`). */
export function ArticleCover({ tone, className, children }: ArticleCoverProps) {
  return (
    <div className={cn('relative bg-gradient-to-br', articleToneGradients[tone], className)}>
      {children}
    </div>
  )
}

export interface ArticleBylineProps {
  author: string
  initials: string
  /** Secondary line under the author name, e.g. read time. Omit to show just the name. */
  meta?: React.ReactNode
  size?: 'sm' | 'default'
  className?: string
}

/** Author avatar + name (+ optional meta line), shared between article cards and the article page. */
export function ArticleByline({
  author,
  initials,
  meta,
  size = 'default',
  className,
}: ArticleBylineProps) {
  return (
    <div className={cn('flex items-center', size === 'sm' ? 'gap-2' : 'gap-3', className)}>
      <Avatar size={size === 'sm' ? 'sm' : undefined}>
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className={cn('truncate font-medium', size === 'sm' ? 'text-xs' : 'text-sm')}>
          {author}
        </p>
        {meta && <p className="text-xs text-muted-foreground">{meta}</p>}
      </div>
    </div>
  )
}

export interface ArticleTocItem {
  href: string
  label: React.ReactNode
  /** Visually emphasize this entry, e.g. the section currently in view. */
  emphasis?: boolean
}

export interface ArticleTocProps {
  title?: React.ReactNode
  items: ArticleTocItem[]
  className?: string
}

/** Table-of-contents list for an article's aside. */
export function ArticleToc({ title = 'On this page', items, className }: ArticleTocProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={cn(
            'block text-sm',
            item.emphasis ? 'font-medium' : 'text-muted-foreground',
          )}
        >
          {item.label}
        </a>
      ))}
    </div>
  )
}

export interface ArticleBodyProps {
  className?: string
  children?: React.ReactNode
}

/** Reading-width container with article body typography for prose content. */
export function ArticleBody({ className, children }: ArticleBodyProps) {
  return (
    <div className={cn('mx-auto max-w-3xl space-y-6 text-[15px] leading-7', className)}>
      {children}
    </div>
  )
}

export interface ArticleBodySkeletonProps {
  className?: string
}

/** Loading placeholder matching `ArticleBody`'s reading width. */
export function ArticleBodySkeleton({ className }: ArticleBodySkeletonProps) {
  return (
    <div className={cn('mx-auto max-w-3xl animate-pulse space-y-4', className)}>
      <div className="h-8 w-2/3 rounded bg-muted" />
      <div className="h-56 rounded-xl bg-muted" />
    </div>
  )
}

export interface ArticleCardPreviewProps {
  tone: ArticleTone
  category: React.ReactNode
  title: React.ReactNode
  excerpt: React.ReactNode
  author: string
  initials: string
  readTime: React.ReactNode
  /** Decorative content layered over the cover, e.g. an icon. */
  coverContent?: React.ReactNode
  coverClassName?: string
  className?: string
}

/**
 * The clickable article-card shape used by every card grid of articles:
 * cover, category, title, excerpt, byline, read time. Compose `coverContent`
 * for per-listing decoration; everything else is the shared shell.
 */
export function ArticleCardPreview({
  tone,
  category,
  title,
  excerpt,
  author,
  initials,
  readTime,
  coverContent,
  coverClassName,
  className,
}: ArticleCardPreviewProps) {
  return (
    <InteractiveCard className={className}>
      <ArticleCover tone={tone} className={cn('h-32', coverClassName)}>
        {coverContent}
      </ArticleCover>
      <CardContent className="flex flex-1 flex-col p-4">
        <Badge variant="outline" className="mb-3">
          {category}
        </Badge>
        <h2 className="text-base font-semibold leading-snug">{title}</h2>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{excerpt}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <ArticleByline author={author} initials={initials} size="sm" className="min-w-0" />
          <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            {readTime}
          </span>
        </div>
      </CardContent>
    </InteractiveCard>
  )
}
