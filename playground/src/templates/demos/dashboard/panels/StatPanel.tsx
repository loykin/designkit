import { StatChart } from '@loykin/chartkit'
import type { Threshold } from '@loykin/chartkit'
import type { PanelViewerProps, PanelPluginDef } from '@loykin/dashboardkit'
import { AutoHeight } from './AutoHeight'

export interface StatPanelOptions extends Record<string, unknown> {
  unit?: string
  threshold?: { value: number; color: string }
  dataByEnv: Record<string, { value: number; change?: number; changeLabel?: string }>
}

function StatViewer({ options, variables }: PanelViewerProps<StatPanelOptions, unknown>) {
  const env = (variables.env as string) ?? 'production'
  const d = options.dataByEnv?.[env] ?? options.dataByEnv?.['production'] ?? { value: 0 }

  // Base threshold at 0 sets the "normal" color; the named threshold adds a warning zone.
  // Without a base threshold, resolveThresholdColor would show the warning color even below threshold.
  const thresholds: Threshold[] = options.threshold
    ? [
        { value: 0, color: '#3b82f6' },
        { value: options.threshold.value, color: options.threshold.color },
      ]
    : []

  // Compute previous value from percentage change so StatChart can show the trend arrow
  const previousValue =
    d.change != null && typeof d.value === 'number'
      ? d.value / (1 + d.change / 100)
      : undefined

  return (
    <AutoHeight defaultHeight={120}>
      {(height) => (
        <StatChart
          value={d.value}
          unit={options.unit}
          previousValue={previousValue}
          thresholds={thresholds}
          height={height}
        />
      )}
    </AutoHeight>
  )
}

export const statPlugin: PanelPluginDef<StatPanelOptions, unknown> = {
  id: 'stat',
  name: 'Stat',
  optionsSchema: {},
  viewer: StatViewer,
}
