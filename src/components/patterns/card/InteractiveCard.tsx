import * as React from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type InteractiveCardProps = React.ComponentProps<typeof Card>

/**
 * A `Card` that is itself a click target inside a grid: fills its cell,
 * lifts and shadows on hover. Reaches for this instead of re-deriving the
 * same hover/elevation treatment per grid (blog cards, product cards, …).
 */
export function InteractiveCard({ className, ...props }: InteractiveCardProps) {
  return (
    <Card
      className={cn(
        'group h-full cursor-pointer gap-0 overflow-hidden py-0 transition-all hover:-translate-y-0.5 hover:shadow-md',
        className,
      )}
      {...props}
    />
  )
}
