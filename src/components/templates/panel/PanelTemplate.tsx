import React from 'react'
import { cn } from '@/lib/utils'

export interface PanelTemplateProps {
  title?: React.ReactNode
  eyebrow?: React.ReactNode
  actions?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
  className?: string
  bodyClassName?: string
}

export interface PanelTemplateSectionProps {
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

function PanelTemplateSection({
  title,
  description,
  actions,
  className,
  children,
}: PanelTemplateSectionProps) {
  return (
    <section className={cn('space-y-2.5', className)}>
      {(title || description || actions) && (
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {title && (
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {title}
              </p>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

function PanelTemplateRoot({
  title,
  eyebrow,
  actions,
  footer,
  children,
  className,
  bodyClassName,
}: PanelTemplateProps) {
  return (
    <div className={cn('flex h-full flex-col overflow-hidden', className)}>
      {(title || eyebrow || actions) && (
        <div className="shrink-0 border-b px-4 py-3">
          {eyebrow && (
            <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {eyebrow}
            </p>
          )}
          <div className="flex items-center gap-2">
            {title && (
              <h2 className="min-w-0 flex-1 truncate text-sm font-semibold">{title}</h2>
            )}
            {actions && (
              <div className="flex shrink-0 items-center gap-1">{actions}</div>
            )}
          </div>
        </div>
      )}
      <div className={cn('min-h-0 flex-1 overflow-y-auto px-4 py-4', bodyClassName)}>
        <div className="space-y-5">{children}</div>
      </div>
      {footer && (
        <div className="shrink-0 border-t px-4 py-3">{footer}</div>
      )}
    </div>
  )
}

export const PanelTemplate = Object.assign(PanelTemplateRoot, {
  Section: PanelTemplateSection,
})
