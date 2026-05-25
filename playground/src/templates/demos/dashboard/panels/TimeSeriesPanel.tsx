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
