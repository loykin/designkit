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
} from '@loykin/designkit'
import { Code2, Copy, Check } from 'lucide-react'

function radiusVarLines(r: number): string[] {
  return [
    `  --radius:     ${r}rem;`,
    `  --radius-sm:  ${(r * 0.6).toFixed(4)}rem;`,
    `  --radius-md:  ${(r * 0.8).toFixed(4)}rem;`,
    `  --radius-lg:  ${r}rem;`,
    `  --radius-xl:  ${(r * 1.4).toFixed(4)}rem;`,
  ]
}

function colorVarLines(chroma: number, hue: number): string[] {
  return [
    `  --primary:             oklch(0.205 ${chroma} ${hue});`,
    `  --primary-foreground:  oklch(0.985 0 0);`,
    `  --ring:                oklch(0.5 ${chroma} ${hue});`,
  ]
}

function buildCSSCode(
  globalRadius: number,
  globalChroma: number,
  globalHue: number,
  tmplId: string,
  tmplRadius: number | undefined,
  tmplChroma: number | undefined,
): string {
  const global = [
    ':root {',
    ...radiusVarLines(globalRadius),
    ...colorVarLines(globalChroma, globalHue),
    '}',
  ].join('\n')

  const overrideLines: string[] = []
  if (tmplRadius !== undefined)  overrideLines.push(...radiusVarLines(tmplRadius))
  if (tmplChroma !== undefined)  overrideLines.push(...colorVarLines(tmplChroma, globalHue))

  const override = overrideLines.length
    ? ['\n' + `.layout-${tmplId} {`, ...overrideLines, '}'].join('\n')
    : ''

  return global + override
}

const componentName: Record<string, string> = {
  table:     'TableBodyTemplate',
  dashboard: 'DashboardBodyTemplate',
  cardlist:  'CardListBodyTemplate',
  tabbed:    'TabbedBodyTemplate',
  form:      'FormBodyTemplate',
}

function buildComponentCode(
  tmplId: string,
  tmplRadius: number | undefined,
  tmplChroma: number | undefined,
  globalChroma: number,
  globalHue: number,
): string {
  const name = componentName[tmplId]
  const pkg  = `@loykin/designkit`

  const themeEntries: string[] = []
  if (tmplRadius !== undefined)
    themeEntries.push(`    '--radius': '${tmplRadius}rem',`)
  if (tmplChroma !== undefined)
    themeEntries.push(`    '--primary': 'oklch(0.205 ${tmplChroma} ${globalHue})',`)

  const themeProp = themeEntries.length
    ? `\n  theme={{\n${themeEntries.join('\n')}\n  }}`
    : ''

  return [
    `import { ${name} } from '${pkg}'`,
    `import '${pkg}/styles'`,
    '',
    `export function MyPage() {`,
    `  return (`,
    `    <${name}${themeProp}`,
    `      // replace with your data and columns`,
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

  const cssCode = buildCSSCode(
    g.radius, g.primaryChroma, g.primaryHue,
    activeTemplate, ov.radius, ov.primaryChroma,
  )

  const componentCode = buildComponentCode(
    activeTemplate, ov.radius, ov.primaryChroma,
    g.primaryChroma, g.primaryHue,
  )

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
          <Code2 className="h-3.5 w-3.5" />
          Code
        </Button>
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
                  <span>Hue</span>
                  <span>{g.primaryHue}°</span>
                  <span>Intensity</span>
                  <span>{g.primaryChroma.toFixed(3)}</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
