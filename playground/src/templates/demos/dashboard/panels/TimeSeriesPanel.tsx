import { useState } from 'react'
import { TimeSeriesChart } from '@loykin/chartkit'
import type { AlignedData, SeriesConfig } from '@loykin/chartkit'
import type { PanelViewerProps, PanelPluginDef } from '@loykin/dashboardkit'
import { AutoHeight } from './AutoHeight'

function makeAlignedData(keys: string[], count: number): AlignedData {
  const startOfDay = Math.floor(Date.now() / 1000 / 86400) * 86400
  const ts = Array.from({ length: count }, (_, i) => startOfDay + i * 3600)
  const series = keys.map((k) =>
    Array.from({ length: count }, () =>
      Math.round(20 + Math.random() * 60 + (k === 'p99' ? 40 : 0))
    )
  )
  return [ts, ...series]
}

export interface TimeSeriesOptions extends Record<string, unknown> {
  unit?: string
  series: { key: string; label: string; color: string }[]
}

function TimeSeriesViewer({ options }: PanelViewerProps<TimeSeriesOptions, unknown>) {
  const [data] = useState(() => makeAlignedData(options.series.map((s) => s.key), 24))
  const series: SeriesConfig[] = options.series.map((s) => ({
    label: s.label,
    color: s.color,
  }))
  return (
    <AutoHeight>
      {(height) => (
        <TimeSeriesChart
          data={data}
          series={series}
          yUnit={options.unit}
          height={height}
          legendPosition="bottom"
        />
      )}
    </AutoHeight>
  )
}

export const timeSeriesPlugin: PanelPluginDef<TimeSeriesOptions, unknown> = {
  id: 'timeseries',
  name: 'Time Series',
  optionsSchema: {},
  viewer: TimeSeriesViewer,
}
