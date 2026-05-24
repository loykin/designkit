import { useThemeStore } from '@/store/themeStore'
import { DataPage } from '@/components/templates/datapage/DataPage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface ColorsBodyTemplateProps {
  theme?: React.CSSProperties
  breadcrumb?: React.ReactNode
}

const tonalTokenDefs = [
  {
    name: 'border',
    bg: 'bg-border',
    fg: 'text-foreground',
    variable: '--border',
    lightL: 0.922,
    darkL: 0.32,
    lightF: 0.04,
    darkF: 0.06,
  },
  {
    name: 'input',
    bg: 'bg-input',
    fg: 'text-foreground',
    variable: '--input',
    lightL: 0.922,
    darkL: 0.35,
    lightF: 0.04,
    darkF: 0.06,
  },
  {
    name: 'muted',
    bg: 'bg-muted',
    fg: 'text-muted-foreground',
    variable: '--muted',
    lightL: 0.97,
    darkL: 0.269,
    lightF: 0.02,
    darkF: 0.03,
  },
  {
    name: 'secondary',
    bg: 'bg-secondary',
    fg: 'text-secondary-foreground',
    variable: '--secondary',
    lightL: 0.97,
    darkL: 0.269,
    lightF: 0.02,
    darkF: 0.02,
  },
  {
    name: 'accent',
    bg: 'bg-accent',
    fg: 'text-accent-foreground',
    variable: '--accent',
    lightL: 0.97,
    darkL: 0.32,
    lightF: 0.04,
    darkF: 0.04,
  },
]

const fixedNeutralTokens = [
  { name: 'background', bg: 'bg-background', fg: 'text-foreground', variable: '--background' },
  { name: 'foreground', bg: 'bg-foreground', fg: 'text-background', variable: '--foreground' },
  { name: 'card', bg: 'bg-card', fg: 'text-card-foreground', variable: '--card' },
]

function ColorSwatch({
  bg,
  fg,
  name,
  variable,
  formula,
}: {
  bg: string
  fg: string
  name: string
  variable: string
  formula?: string
}) {
  return (
    <div className="overflow-hidden rounded-[var(--radius)] border">
      <div className={`${bg} flex h-14 items-center justify-center`}>
        <span className={`${fg} text-sm font-semibold`}>Aa</span>
      </div>
      <div className="bg-card px-3 py-2 space-y-0.5">
        <p className="text-xs font-medium">{name}</p>
        <p className="text-xs text-muted-foreground font-mono">{variable}</p>
        {formula && <p className="text-xs text-muted-foreground/70 font-mono">{formula}</p>}
      </div>
    </div>
  )
}

export function ColorsBodyTemplate({ theme, breadcrumb }: ColorsBodyTemplateProps) {
  const { primaryHue, primaryChroma } = useThemeStore((s) => s.global)

  const primaryDerived = [
    {
      name: 'primary',
      bg: 'bg-primary',
      fg: 'text-primary-foreground',
      variable: '--primary',
      formula: `oklch(0.52 ${primaryChroma.toFixed(3)} ${primaryHue})`,
    },
    {
      name: 'ring',
      bg: 'bg-ring',
      fg: 'text-background',
      variable: '--ring',
      formula: `oklch(0.50 ${primaryChroma.toFixed(3)} ${primaryHue})`,
    },
    {
      name: 'sidebar-primary',
      bg: 'bg-[--sidebar-primary]',
      fg: 'text-primary-foreground',
      variable: '--sidebar-primary',
      formula: `oklch(0.488 ${primaryChroma.toFixed(3)} ${primaryHue})`,
    },
    {
      name: 'primary-foreground',
      bg: 'bg-primary-foreground',
      fg: 'text-foreground',
      variable: '--primary-foreground',
      formula: 'oklch(0.985 0 0) — fixed',
    },
  ]

  return (
    <DataPage className="layout-colors" style={theme}>
      <DataPage.Header>
        <DataPage.TitleBlock
          breadcrumb={breadcrumb}
          title="Colors"
          description="Design token color palette and derivation rules for the active theme"
        />
      </DataPage.Header>

      <DataPage.Content className="space-y-[var(--dk-panel-gap)]">
        {/* Primary derived chain */}
        <Card className="rounded-lg border border-border ring-0">
          <CardHeader>
            <CardTitle>Primary — controlled by hue &amp; chroma</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-[var(--radius)] bg-muted px-3 py-2 text-xs font-mono text-muted-foreground">
              hue: <span className="text-foreground">{primaryHue}</span>
              {'  '}chroma: <span className="text-foreground">{primaryChroma.toFixed(3)}</span>
              {'  '}→{'  '}
              <span className="text-foreground">oklch(L, chroma, hue)</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {primaryDerived.map((t) => (
                <ColorSwatch key={t.name} {...t} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Same hue &amp; chroma — only lightness differs. Adjust via StyleEditor.
            </p>
          </CardContent>
        </Card>

        {/* Destructive — fixed */}
        <Card className="rounded-lg border border-border ring-0">
          <CardHeader>
            <CardTitle>Destructive — fixed red</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ColorSwatch
                bg="bg-destructive"
                fg="text-destructive-foreground"
                name="destructive"
                variable="--destructive"
                formula="oklch(0.577 0.245 27.3)"
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Fixed at hue 27 (red). Not affected by theme controls.
            </p>
          </CardContent>
        </Card>

        {/* Tonal surface — derived */}
        <Card className="rounded-lg border border-border ring-0">
          <CardHeader>
            <CardTitle>Tonal surface — derived from primary hue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-[var(--radius)] bg-muted px-3 py-2 text-xs font-mono text-muted-foreground">
              oklch(L, <span className="text-foreground">chroma × factor</span>, {primaryHue})
              {'  · '}factor = 2–6% of primary chroma
            </div>
            <div className="overflow-hidden rounded-[var(--radius)] border divide-y text-xs font-mono">
              <div className="grid grid-cols-[7rem_1fr_1fr] bg-muted/50 px-3 py-1.5 text-muted-foreground">
                <span>token</span>
                <span>light</span>
                <span>dark</span>
              </div>
              {tonalTokenDefs.map((t) => (
                <div
                  key={t.name}
                  className="grid grid-cols-[7rem_1fr_1fr] items-center gap-x-3 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <div className={`${t.bg} h-5 w-5 shrink-0 rounded border`} />
                    <span className="font-medium text-foreground">{t.name}</span>
                  </div>
                  <span className="text-muted-foreground">
                    oklch({t.lightL}{' '}
                    <span className="text-foreground">{(primaryChroma * t.lightF).toFixed(4)}</span>{' '}
                    {primaryHue})
                  </span>
                  <span className="text-muted-foreground">
                    oklch({t.darkL}{' '}
                    <span className="text-foreground">{(primaryChroma * t.darkF).toFixed(4)}</span>{' '}
                    {primaryHue})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fixed neutrals */}
        <Card className="rounded-lg border border-border ring-0">
          <CardHeader>
            <CardTitle>Fixed neutral — dark mode only</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {fixedNeutralTokens.map((t) => (
                <ColorSwatch key={t.name} bg={t.bg} fg={t.fg} name={t.name} variable={t.variable} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              chroma = 0. Unaffected by hue &amp; chroma controls.
            </p>
          </CardContent>
        </Card>
      </DataPage.Content>
    </DataPage>
  )
}
