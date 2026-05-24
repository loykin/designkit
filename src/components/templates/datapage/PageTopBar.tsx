import React from 'react'
import { cn } from '@/lib/utils'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export type PageTopBarVariant = 'ghost' | 'default'

export interface PageTopBarProps {
  left?: React.ReactNode
  right?: React.ReactNode
  variant?: PageTopBarVariant
  height?: string
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export type PageBreadcrumbItem = string | { label: string; href?: string }

export function PageBreadcrumb({ items }: { items: PageBreadcrumbItem[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-xs gap-1">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          const label = typeof item === 'string' ? item : item.label
          const href = typeof item === 'string' ? undefined : item.href
          return (
            <React.Fragment key={i}>
              {i > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-xs">{label}</BreadcrumbPage>
                ) : href ? (
                  <BreadcrumbLink href={href} className="text-xs">
                    {label}
                  </BreadcrumbLink>
                ) : (
                  <span className="text-xs text-muted-foreground">{label}</span>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function normalizeBreadcrumb(left: React.ReactNode): React.ReactNode {
  if (typeof left === 'string') {
    const items = left.split('/').map((s) => s.trim()).filter(Boolean)
    return <PageBreadcrumb items={items} />
  }
  return left
}

const bgClassMap: Record<string, string> = {
  muted: 'bg-muted',
  card: 'bg-card',
  transparent: '',
}

/** Builds a PageTopBar ReactNode from playground option strings. */
export function buildTopBar(opts: {
  topBarShow?: string
  topBarVariant?: string
  topBarBg?: string
  left: React.ReactNode
  right?: React.ReactNode
}): React.ReactNode {
  if (opts.topBarShow === 'hide') return undefined
  return (
    <PageTopBar
      left={normalizeBreadcrumb(opts.left)}
      right={opts.right}
      variant={(opts.topBarVariant as PageTopBarVariant) ?? 'ghost'}
      className={bgClassMap[opts.topBarBg ?? 'transparent'] ?? ''}
    />
  )
}

export function PageTopBar({
  left,
  right,
  variant = 'ghost',
  height = 'var(--dk-toolbar-height)',
  className,
  style,
  children,
}: PageTopBarProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-between gap-4 px-(--dk-page-padding-x)',
        variant === 'default' && 'border-b',
        className,
      )}
      style={{ height, ...style }}
    >
      <div className="flex min-w-0 items-center text-xs text-muted-foreground">
        {normalizeBreadcrumb(left ?? children)}
      </div>
      {right && <div className="flex shrink-0 items-center gap-2">{right}</div>}
    </div>
  )
}
