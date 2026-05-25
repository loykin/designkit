import { useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import type { PanelViewerProps, PanelPluginDef } from '@loykin/dashboardkit'

export interface TimeSeriesPoint {
  time: string
  [key: string]: number | string
}

export interface TimeSeriesSeries {
  key: string
  label: string
  color: string
}

export interface TimeSeriesPanelProps {
  data: TimeSeriesPoint[]
  series: TimeSeriesSeries[]
  unit?: string
}

const tooltipStyle: React.CSSProperties = {
  fontSize: 11,
  borderRadius: '6px',
  border: '1px solid hsl(var(--border))',
  background: 'hsl(var(--card))',
  color: 'hsl(var(--card-foreground))',
  padding: '6px 10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
}

export function TimeSeriesPanel({ data, series, unit }: TimeSeriesPanelProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 1, height: 1 }}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => unit ? `${v}${unit}` : String(v)}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(val) => [unit ? `${val}${unit}` : val]}
        />
        <Legend
          wrapperStyle={{ fontSize: 10, paddingTop: 4 }}
          iconType="plainline"
        />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

function makeTimeSeries(keys: string[], length = 24): TimeSeriesPoint[] {
  return Array.from({ length }, (_, i) => {
    const h = String(i).padStart(2, '0')
    const point: TimeSeriesPoint = { time: `${h}:00` }
    keys.forEach((k) => {
      point[k] = Math.round(20 + Math.random() * 60 + (k === 'p99' ? 40 : 0))
    })
    return point
  })
}

export interface TimeSeriesOptions extends Record<string, unknown> {
  unit?: string
  series: TimeSeriesSeries[]
}

function TimeSeriesViewer({ options }: PanelViewerProps<TimeSeriesOptions, unknown>) {
  const [data] = useState(() => makeTimeSeries(options.series.map((s) => s.key)))
  return <TimeSeriesPanel data={data} series={options.series} unit={options.unit} />
}

export const timeSeriesPlugin: PanelPluginDef<TimeSeriesOptions, unknown> = {
  id: 'timeseries',
  name: 'Time Series',
  optionsSchema: {},
  viewer: TimeSeriesViewer,
}
