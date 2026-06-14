import { BarChart } from '@loykin/chartkit'
import type { BarSeriesConfig } from '@loykin/chartkit'
import type { PanelViewerProps, PanelPluginDef } from '@loykin/dashboardkit'
import { AutoHeight } from './AutoHeight'

export interface BarChartOptions extends Record<string, unknown> {
  unit?: string
  horizontal?: boolean
  data: { label: string; value: number; color?: string }[]
}

function BarChartViewer({ options }: PanelViewerProps<BarChartOptions, unknown>) {
  const categories = options.data.map((d) => d.label)
  const series: BarSeriesConfig[] = [{
    label: 'Value',
    color: 'oklch(0.6 0.15 220)',
    values: options.data.map((d) => d.value),
  }]
  return (
    <AutoHeight>
      {(height) => (
        <BarChart
          categories={categories}
          series={series}
          yUnit={options.unit?.trim()}
          orientation={options.horizontal ? 'horizontal' : 'vertical'}
          height={height}
        />
      )}
    </AutoHeight>
  )
}

export const barChartPlugin: PanelPluginDef<BarChartOptions, unknown> = {
  id: 'bar',
  name: 'Bar Chart',
  optionsSchema: {},
  viewer: BarChartViewer,
}
