import {
  useThemeStore,
  Slider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
} from '@loykin/designkit'
import { Sun, Moon, Settings2 } from 'lucide-react'
import type { DensityId } from '@loykin/designkit'

function val(v: number | readonly number[]) {
  return Array.isArray(v) ? v[0] : (v as number)
}

function NumInput({
  value, min, max, step, onChange,
}: {
  value: number; min: number; max: number; step: number; onChange: (n: number) => void
}) {
  return (
    <input
      type="number"
      min={min} max={max} step={step}
      value={value}
      onChange={(e) => {
        const n = parseFloat(e.target.value)
        if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n)))
      }}
      className="w-14 h-6 rounded-[var(--radius)] border border-input bg-background px-1.5 text-xs tabular-nums text-right focus:outline-none focus:ring-1 focus:ring-ring"
    />
  )
}

function SliderRow({
  label, value, min, max, step, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (n: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-16 shrink-0">{label}</span>
      <Slider min={min} max={max} step={step} value={[value]}
        onValueChange={(v) => onChange(val(v))}
        className="flex-1" />
      <NumInput value={value} min={min} max={max} step={step} onChange={onChange} />
    </div>
  )
}

const densityItems: { id: DensityId; label: string }[] = [
  { id: 'compact', label: 'Compact' },
  { id: 'default', label: 'Default' },
  { id: 'comfortable', label: 'Comfort' },
]

export function StyleControls() {
  const { global: g, overrides, activeTemplate, setGlobal, setOverride } = useThemeStore()
  const ov = overrides[activeTemplate]
  const activeLabel = activeTemplate
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
  const hasOverride = ov.radius !== undefined || ov.primaryChroma !== undefined

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setGlobal({ darkMode: !g.darkMode })}
        className="h-7 w-7 rounded-md border flex items-center justify-center hover:bg-accent transition-colors"
      >
        {g.darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      </button>

      <Popover>
        <PopoverTrigger className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border hover:bg-accent transition-colors text-xs">
          <Settings2 className="h-3.5 w-3.5" />
          Style
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 space-y-5" align="end">

          <div className="space-y-3">
            <p className="text-xs font-semibold">Color</p>
            <SliderRow label="Hue"
              value={g.primaryHue} min={0} max={360} step={1}
              onChange={(n) => setGlobal({ primaryHue: n })} />
            <div className="ml-[4.5rem] h-2 rounded-full" style={{
              background: 'linear-gradient(to right,oklch(0.6 0.2 0),oklch(0.6 0.2 60),oklch(0.6 0.2 120),oklch(0.6 0.2 180),oklch(0.6 0.2 240),oklch(0.6 0.2 300),oklch(0.6 0.2 360))'
            }} />
            <SliderRow label="Intensity"
              value={g.primaryChroma} min={0} max={0.3} step={0.005}
              onChange={(n) => setGlobal({ primaryChroma: n })} />
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-xs font-semibold">Layout</p>
            <div className="grid grid-cols-3 gap-1 rounded-md border bg-muted/30 p-1">
              {densityItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setGlobal({ density: item.id })}
                  className={[
                    'h-7 rounded-[calc(var(--radius)-2px)] px-2 text-[11px] transition-colors',
                    g.density === item.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  ].join(' ')}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <SliderRow label="Radius"
              value={g.radius} min={0} max={2} step={0.0625}
              onChange={(n) => setGlobal({ radius: n })} />
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-xs font-semibold">Typography</p>
            <SliderRow label="Size"
              value={g.fontScale} min={0.8} max={1.25} step={0.01}
              onChange={(n) => setGlobal({ fontScale: n })} />
            <SliderRow label="Leading"
              value={g.lineHeight} min={0.85} max={1.25} step={0.01}
              onChange={(n) => setGlobal({ lineHeight: n })} />
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold">{activeLabel} Override</p>
              {hasOverride && (
                <button
                  onClick={() => setOverride(activeTemplate, { radius: undefined, primaryChroma: undefined })}
                  className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  reset
                </button>
              )}
            </div>
            <SliderRow label="Radius"
              value={ov.radius ?? g.radius} min={0} max={2} step={0.0625}
              onChange={(n) => setOverride(activeTemplate, { radius: n })} />
            <SliderRow label="Intensity"
              value={ov.primaryChroma ?? g.primaryChroma} min={0} max={0.3} step={0.005}
              onChange={(n) => setOverride(activeTemplate, { primaryChroma: n })} />
          </div>

        </PopoverContent>
      </Popover>
    </div>
  )
}
