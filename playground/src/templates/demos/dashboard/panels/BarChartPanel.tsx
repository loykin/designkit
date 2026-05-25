import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Rectangle,
} from 'recharts'

export interface BarChartPanelProps {
  data: { label: string; value: number; color?: string }[]
  unit?: string
  horizontal?: boolean
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

const DEFAULT_COLOR = 'hsl(var(--primary))'

export function BarChartPanel({ data, unit, horizontal }: BarChartPanelProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 1, height: 1 }}>
      <BarChart
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{ top: 4, right: 8, left: horizontal ? 60 : -16, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
        {horizontal ? (
          <>
            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => unit ? `${v}${unit}` : String(v)}
            />
            <YAxis
              type="category"
              dataKey="label"
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              width={56}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey="label"
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
          </>
        )}
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(val) => [unit ? `${val}${unit}` : val]}
          cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
        />
        <Bar
          dataKey="value"
          maxBarSize={40}
          shape={(props: any) => (
            <Rectangle {...props} fill={props.color ?? DEFAULT_COLOR} radius={[3, 3, 0, 0]} />
          )}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
