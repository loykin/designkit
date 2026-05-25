import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@loykin/designkit'
import type { PanelViewerProps, PanelPluginDef } from '@loykin/dashboardkit'

export interface StatPanelProps {
  value: number | string
  unit?: string
  change?: number
  changeLabel?: string
  color?: string
}

export function StatPanel({ value, unit, change, changeLabel, color }: StatPanelProps) {
  const trend = change === undefined ? null : change > 0 ? 'up' : change < 0 ? 'down' : 'flat'

  return (
    <div className="flex h-full flex-col justify-center gap-1">
      <div
        className="text-3xl font-bold tabular-nums leading-none tracking-tight"
        style={color ? { color } : undefined}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
        {unit && <span className="ml-1 text-base font-normal text-muted-foreground">{unit}</span>}
      </div>

      {change !== undefined && (
        <div
          className={cn(
            'flex items-center gap-1 text-xs font-medium',
            trend === 'up' && 'text-emerald-500',
            trend === 'down' && 'text-destructive',
            trend === 'flat' && 'text-muted-foreground',
          )}
        >
          {trend === 'up' && <TrendingUp className="h-3.5 w-3.5" />}
          {trend === 'down' && <TrendingDown className="h-3.5 w-3.5" />}
          {trend === 'flat' && <Minus className="h-3.5 w-3.5" />}
          <span>
            {change > 0 ? '+' : ''}{change}%
            {changeLabel && <span className="ml-1 font-normal text-muted-foreground">{changeLabel}</span>}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export interface StatPanelOptions extends Record<string, unknown> {
  unit?: string
  threshold?: { value: number; color: string }
  dataByEnv: Record<string, { value: number; change?: number; changeLabel?: string }>
}

function StatViewer({ options, variables }: PanelViewerProps<StatPanelOptions, unknown>) {
  const env = (variables.env as string) ?? 'production'
  const d = options.dataByEnv?.[env] ?? options.dataByEnv?.['production'] ?? { value: 0 }
  const color =
    options.threshold && typeof d.value === 'number' && d.value > options.threshold.value
      ? options.threshold.color
      : undefined
  return (
    <StatPanel value={d.value} unit={options.unit} change={d.change} changeLabel={d.changeLabel} color={color} />
  )
}

export const statPlugin: PanelPluginDef<StatPanelOptions, unknown> = {
  id: 'stat',
  name: 'Stat',
  optionsSchema: {},
  viewer: StatViewer,
}
