import { useState } from 'react'
import {
  useThemeStore,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
  getTemplateDefinition,
} from '@loykin/designkit'
import { Code2, Copy, Check } from 'lucide-react'
import type { DensityId, TemplateDefinition, TemplateId, TemplateOverride } from '@loykin/designkit'

function radiusVarLines(r: number): string[] {
  return [
    `  --dk-radius:  ${r}rem;`,
    `  --dg-radius:  ${r}rem;`,
    `  --radius:     ${r}rem;`,
    `  --radius-sm:  ${(r * 0.6).toFixed(4)}rem;`,
    `  --radius-md:  ${(r * 0.8).toFixed(4)}rem;`,
    `  --radius-lg:  ${r}rem;`,
    `  --radius-xl:  ${(r * 1.4).toFixed(4)}rem;`,
  ]
}

function colorVarLines(chroma: number, hue: number): string[] {
  return [
    `  --dk-primary:            oklch(0.52 ${chroma} ${hue});`,
    `  --dk-primary-foreground: oklch(0.985 0 0);`,
    `  --dk-ring:               oklch(0.5 ${chroma} ${hue});`,
    `  --dg-primary:            oklch(0.52 ${chroma} ${hue});`,
    `  --dg-primary-foreground: oklch(0.985 0 0);`,
    `  --dg-ring:               oklch(0.5 ${chroma} ${hue});`,
    `  --primary:             oklch(0.52 ${chroma} ${hue});`,
    `  --primary-foreground:  oklch(0.985 0 0);`,
    `  --ring:                oklch(0.5 ${chroma} ${hue});`,
  ]
}

function typographyVarLines(fontScale: number, lineHeight: number): string[] {
  return [
    `  --dk-font-scale:  ${fontScale};`,
    `  --dk-line-height: ${lineHeight};`,
    `  --dk-text-xs:     calc(0.75rem * ${fontScale});`,
    `  --dk-text-sm:     calc(0.875rem * ${fontScale});`,
    `  --dk-text-base:   calc(1rem * ${fontScale});`,
    `  --dk-text-lg:     calc(1.125rem * ${fontScale});`,
    `  --dk-text-xl:     calc(1.25rem * ${fontScale});`,
    `  --dk-leading-xs:  calc(1rem * ${lineHeight});`,
    `  --dk-leading-sm:  calc(1.25rem * ${lineHeight});`,
    `  --dk-leading-base:calc(1.5rem * ${lineHeight});`,
    `  --dk-leading-lg:  calc(1.75rem * ${lineHeight});`,
    `  --dk-leading-xl:  calc(1.75rem * ${lineHeight});`,
  ]
}

function densityVarLines(
  density: DensityId,
  overrides: Pick<TemplateOverride, 'pagePaddingY' | 'panelGap' | 'toolbarHeight'> = {},
): string[] {
  const values = {
    compact: {
      density: 0.85,
      pagePaddingY: '0.75rem',
      panelGap: '0.75rem',
      toolbarHeight: '2.5rem',
    },
    default: {
      density: 1,
      pagePaddingY: '1rem',
      panelGap: '1rem',
      toolbarHeight: '2.75rem',
    },
    comfortable: {
      density: 1.15,
      pagePaddingY: '1.25rem',
      panelGap: '1.25rem',
      toolbarHeight: '3rem',
    },
  }[density]

  return [
    `  --dk-density:        ${values.density};`,
    `  --dk-page-padding-x: 1.5rem;`,
    `  --dk-page-padding-y: ${overrides.pagePaddingY ?? values.pagePaddingY};`,
    `  --dk-panel-gap:      ${overrides.panelGap ?? values.panelGap};`,
    `  --dk-toolbar-height: ${overrides.toolbarHeight ?? values.toolbarHeight};`,
  ]
}

function buildCSSCode(
  globalRadius: number,
  globalChroma: number,
  globalHue: number,
  fontScale: number,
  lineHeight: number,
  density: DensityId,
  layoutClassName: string,
  ov: TemplateOverride,
): string {
  const global = [
    ':root {',
    ...radiusVarLines(globalRadius),
    ...colorVarLines(globalChroma, globalHue),
    ...typographyVarLines(fontScale, lineHeight),
    ...densityVarLines(density),
    '}',
  ].join('\n')

  const overrideLines: string[] = []
  if (ov.radius !== undefined) overrideLines.push(...radiusVarLines(ov.radius))
  if (ov.primaryChroma !== undefined) overrideLines.push(...colorVarLines(ov.primaryChroma, globalHue))
  if (
    ov.density !== undefined ||
    ov.pagePaddingY !== undefined ||
    ov.panelGap !== undefined ||
    ov.toolbarHeight !== undefined
  ) {
    overrideLines.push(...densityVarLines(ov.density ?? density, ov))
  }

  const override = overrideLines.length
    ? ['\n' + `.${layoutClassName} {`, ...overrideLines, '}'].join('\n')
    : ''

  return global + override
}

function buildThemeProp(
  ov: TemplateOverride,
  globalHue: number,
): string {
  const themeEntries: string[] = []
  if (ov.radius !== undefined) {
    themeEntries.push(`    '--dk-radius': '${ov.radius}rem',`)
    themeEntries.push(`    '--dg-radius': '${ov.radius}rem',`)
    themeEntries.push(`    '--radius': '${ov.radius}rem',`)
  }
  if (ov.primaryChroma !== undefined) {
    themeEntries.push(`    '--dk-primary': 'oklch(0.52 ${ov.primaryChroma} ${globalHue})',`)
    themeEntries.push(`    '--dg-primary': 'oklch(0.52 ${ov.primaryChroma} ${globalHue})',`)
    themeEntries.push(`    '--primary': 'oklch(0.52 ${ov.primaryChroma} ${globalHue})',`)
  }
  if (ov.density !== undefined) {
    themeEntries.push(`    '--dk-density': '${ov.density === 'compact' ? 0.85 : ov.density === 'comfortable' ? 1.15 : 1}',`)
  }
  if (ov.pagePaddingY !== undefined) {
    themeEntries.push(`    '--dk-page-padding-y': '${ov.pagePaddingY}',`)
  }
  if (ov.panelGap !== undefined) {
    themeEntries.push(`    '--dk-panel-gap': '${ov.panelGap}',`)
  }
  if (ov.toolbarHeight !== undefined) {
    themeEntries.push(`    '--dk-toolbar-height': '${ov.toolbarHeight}',`)
  }

  return themeEntries.length
    ? `\n  theme={{\n${themeEntries.join('\n')}\n  }}`
    : ''
}

function buildDataGridCode(definition: TemplateDefinition, themeProp: string) {
  const variant = definition.preview?.variant
  const variantProp = variant && variant !== 'standard'
    ? `\n        variant="${variant}"`
    : ''
  const cardRenderCode = definition.exportKind === 'data-grid-card'
    ? [
      '',
      `function renderCard(row: { original: User }) {`,
      `  const user = row.original`,
      `  return (`,
      `    <div className="rounded-[var(--radius)] border bg-card p-3 text-card-foreground">`,
      `      <p className="text-sm font-medium">{user.name}</p>`,
      `      <p className="text-xs text-muted-foreground">{user.email}</p>`,
      `    </div>`,
      `  )`,
      `}`,
    ].join('\n')
    : ''
  const cardProp = definition.exportKind === 'data-grid-card'
    ? `\n        card={{ renderCard }}`
    : ''

  return [
    `import { DataBodyTemplate, DataGridView, type DataGridColumnDef } from '@loykin/designkit'`,
    `import '@loykin/designkit/styles'`,
    '',
    `type User = Record<string, unknown> & { id: string; name: string; email: string }`,
    ``,
    `const data: User[] = []`,
    `const columns: DataGridColumnDef<User>[] = [`,
    `  { id: 'name', accessorKey: 'name', header: 'Name' },`,
    `  { id: 'email', accessorKey: 'email', header: 'Email' },`,
    `]`,
    cardRenderCode,
    '',
    `export function MyPage() {`,
    `  return (`,
    `    <DataBodyTemplate${themeProp}`,
    `      breadcrumb="Data / Users"`,
    `      title="Users"`,
    `    >`,
    `      <DataGridView${variantProp}`,
    `        data={data}`,
    `        columns={columns}`,
    `        getRowId={(row) => row.id}${cardProp}`,
    `      />`,
    `    </DataBodyTemplate>`,
    `  )`,
    `}`,
  ].filter(Boolean).join('\n')
}

function buildComponentCode(
  tmplId: TemplateId,
  ov: TemplateOverride,
  globalHue: number,
): string {
  const definition = getTemplateDefinition(tmplId)
  if (!definition) return ''

  const themeProp = buildThemeProp(ov, globalHue)

  if (definition.exportKind === 'data-grid' || definition.exportKind === 'data-grid-card') {
    return buildDataGridCode(definition, themeProp)
  }

  const name = definition.exportComponent
  return [
    `import { ${name} } from '@loykin/designkit'`,
    `import '@loykin/designkit/styles'`,
    '',
    `export function MyPage() {`,
    `  return (`,
    `    <${name}${themeProp}`,
    `      // pass your content/data props here`,
    `    />`,
    `  )`,
    `}`,
  ].join('\n')
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy}
      className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
      {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative rounded-md border bg-muted/40">
      <div className="absolute top-2 right-2">
        <CopyButton text={code} />
      </div>
      <pre className="overflow-auto p-4 pt-3 text-xs leading-relaxed font-mono text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export function CodeExport() {
  const { global: g, overrides, activeTemplate } = useThemeStore()
  const ov = overrides[activeTemplate]
  const definition = getTemplateDefinition(activeTemplate)
  const layoutClassName = definition?.layoutClassName ?? `layout-${activeTemplate}`

  const cssCode = buildCSSCode(
    g.radius, g.primaryChroma, g.primaryHue,
    g.fontScale, g.lineHeight, g.density,
    layoutClassName, ov,
  )

  const componentCode = buildComponentCode(
    activeTemplate, ov,
    g.primaryHue,
  )

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" />
        }
      >
        <Code2 className="h-3.5 w-3.5" />
        Code
      </SheetTrigger>
      <SheetContent className="w-[520px] sm:max-w-[520px] flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <SheetTitle className="text-sm">
            Export — <span className="capitalize text-muted-foreground font-normal">{activeTemplate}</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto px-6 py-4">
          <Tabs defaultValue="css">
            <TabsList className="mb-4">
              <TabsTrigger value="css">CSS Variables</TabsTrigger>
              <TabsTrigger value="component">Component</TabsTrigger>
            </TabsList>

            <TabsContent value="css" className="space-y-3 mt-0">
              <p className="text-xs text-muted-foreground">
                Add to your project's <code className="bg-muted px-1 rounded">globals.css</code> or shadow the variables per-template using <code className="bg-muted px-1 rounded">.layout-{activeTemplate}</code>.
              </p>
              <CodeBlock code={cssCode} />
            </TabsContent>

            <TabsContent value="component" className="space-y-3 mt-0">
              <p className="text-xs text-muted-foreground">
                Import the template and pass the <code className="bg-muted px-1 rounded">theme</code> prop with your CSS variable overrides.
              </p>
              <CodeBlock code={componentCode} />
              <div className="rounded-md border p-3 bg-muted/30 space-y-1">
                <p className="text-xs font-medium">Current settings</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground font-mono mt-1">
                  <span>Global radius</span>
                  <span>{g.radius}rem</span>
                  {ov.radius !== undefined && <>
                    <span>{activeTemplate} radius</span>
                    <span>{ov.radius}rem</span>
                  </>}
                  {ov.density !== undefined && <>
                    <span>{activeTemplate} density</span>
                    <span>{ov.density}</span>
                  </>}
                  {ov.panelGap !== undefined && <>
                    <span>{activeTemplate} gap</span>
                    <span>{ov.panelGap}</span>
                  </>}
                  <span>Hue</span>
                  <span>{g.primaryHue}°</span>
                  <span>Chroma</span>
                  <span>{g.primaryChroma.toFixed(3)}</span>
                  <span>Font scale</span>
                  <span>{g.fontScale.toFixed(2)}</span>
                  <span>Line height</span>
                  <span>{g.lineHeight.toFixed(2)}</span>
                  <span>Density</span>
                  <span>{g.density}</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
