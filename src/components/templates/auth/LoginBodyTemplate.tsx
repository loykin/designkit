import React from 'react'
import { cn } from '@/lib/utils'

export type LoginLayout = 'centered' | 'split'
export type LoginSide = 'left' | 'right'
export type LoginCard = 'card' | 'plain'
export type LoginBg = 'default' | 'none' | 'subtle'
export type LoginCardWidth = 'sm' | 'md' | 'lg'

export interface LoginBodyTemplateProps {
  theme?: React.CSSProperties
  layout?: LoginLayout
  side?: LoginSide
  card?: LoginCard
  bg?: LoginBg
  cardWidth?: LoginCardWidth
  brand?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

const bgClass: Record<LoginBg, string> = {
  default: 'bg-muted/40',
  none: 'bg-background',
  subtle: 'bg-gradient-to-br from-muted/60 via-background to-muted/30',
}

const cardWidthClass: Record<LoginCardWidth, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
}

function DefaultBrand() {
  return (
    <div className="flex h-full flex-col justify-between p-10">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-foreground/20">
          <div className="h-3.5 w-3.5 rounded-sm bg-primary-foreground" />
        </div>
        <span className="text-sm font-semibold text-primary-foreground">Acme</span>
      </div>
      <div>
        <blockquote className="space-y-2">
          <p className="text-lg font-medium leading-snug text-primary-foreground">
            "This platform has completely changed how our team collaborates on design."
          </p>
          <footer className="text-sm text-primary-foreground/70">— Sarah Kim, Design Lead</footer>
        </blockquote>
      </div>
    </div>
  )
}

function FormCard({
  card,
  cardWidth = 'sm',
  children,
}: {
  card: LoginCard
  cardWidth?: LoginCardWidth
  children: React.ReactNode
}) {
  const widthCls = cardWidthClass[cardWidth]
  if (card === 'card') {
    return (
      <div className={cn('w-full rounded-2xl border bg-card px-8 py-10 shadow-lg', widthCls)}>
        {children}
      </div>
    )
  }
  return <div className={cn('w-full', widthCls)}>{children}</div>
}

export function LoginBodyTemplate({
  theme,
  layout = 'centered',
  side = 'left',
  card = 'plain',
  bg = 'default',
  cardWidth = 'sm',
  brand,
  children,
  className,
}: LoginBodyTemplateProps) {
  const brandPanel = (
    <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col">{brand ?? <DefaultBrand />}</div>
  )

  if (layout === 'split') {
    return (
      <div
        className={cn('designkit-theme h-full flex bg-background text-foreground', className)}
        style={theme}
      >
        {side === 'left' && brandPanel}
        <div className="flex flex-1 items-center justify-center p-8">
          <FormCard card={card} cardWidth={cardWidth}>
            {children}
          </FormCard>
        </div>
        {side === 'right' && brandPanel}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'designkit-theme h-full flex items-center justify-center text-foreground p-4',
        bgClass[bg],
        className,
      )}
      style={theme}
    >
      <FormCard card={card} cardWidth={cardWidth}>
        {children}
      </FormCard>
    </div>
  )
}
