import { useState } from 'react'
import type { ComponentType, CSSProperties } from 'react'
import {
  useStyleInjector,
  buildTemplateTheme,
  useThemeStore,
  SHELLS,
  TEMPLATES,
  TEMPLATE_NAVIGATION,
  TEMPLATE_DEFINITIONS,
  TooltipProvider,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@loykin/designkit'
import type { TemplateId } from '@loykin/designkit'
import { StyleControls } from './components/editor/StyleEditor'
import { CodeExport } from './components/editor/CodeExport'

function initTemplateProps(): Partial<Record<TemplateId, Record<string, string>>> {
  return TEMPLATE_DEFINITIONS.reduce<Partial<Record<TemplateId, Record<string, string>>>>(
    (acc, def) => {
      if (def.options?.length) {
        acc[def.id as TemplateId] = Object.fromEntries(
          def.options.map((opt) => [opt.key, opt.defaultValue])
        )
      }
      return acc
    },
    {}
  )
}

export default function App() {
  useStyleInjector()
  const { activeShell, activeTemplate, setShell, setTemplate, global: g, overrides } = useThemeStore()
  const [templateProps, setTemplateProps] = useState(initTemplateProps)

  const shell    = SHELLS.find((s) => s.id === activeShell)!
  const template = TEMPLATES.find((t) => t.id === activeTemplate)!
  const activeDefinition = TEMPLATE_DEFINITIONS.find((d) => d.id === activeTemplate)

  const ShellComponent = shell.component
  const BodyComponent  = template.component as ComponentType<{ theme?: CSSProperties } & Record<string, unknown>>

  const templateTheme = buildTemplateTheme(g, overrides[activeTemplate])

  const setTemplateOption = (id: TemplateId, key: string, value: string) => {
    setTemplateProps((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? {}), [key]: value },
    }))
  }

  const activeOptions = activeDefinition?.options ?? []
  const activeProps   = templateProps[activeTemplate] ?? {}

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col">
        <header className="flex h-11 shrink-0 items-center border-b bg-[var(--dk-header)] backdrop-blur-sm px-4 gap-3 z-20">
          <span className="text-xs font-bold text-muted-foreground mr-1">designkit</span>

          {/* Shell selector */}
          <div className="flex items-center gap-0.5" aria-label="Shell">
            {SHELLS.map((s) => (
              <button
                key={s.id}
                onClick={() => setShell(s.id)}
                className={[
                  'px-2.5 py-1 text-xs rounded-md transition-colors',
                  s.id === activeShell
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                ].join(' ')}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Template-specific options — only rendered when the active template declares options */}
          {activeOptions.length > 0 && (
            <>
              <Separator orientation="vertical" className="h-4 shrink-0" />
              <div className="flex items-center gap-3">
                {activeOptions.map((opt) => (
                  <div key={opt.key} className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground shrink-0">{opt.label}</span>
                    <Select
                      value={activeProps[opt.key] ?? opt.defaultValue}
                      onValueChange={(v) => setTemplateOption(activeTemplate, opt.key, v)}
                    >
                      <SelectTrigger className="h-7 w-24 text-xs px-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {opt.choices.map((choice) => (
                          <SelectItem key={choice.value} value={choice.value} className="text-xs">
                            {choice.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="ml-auto flex items-center gap-2">
            <CodeExport />
            <StyleControls />
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <ShellComponent
            navigation={TEMPLATE_NAVIGATION}
            activeItemId={activeTemplate}
            onItemSelect={setTemplate}
          >
            <BodyComponent theme={templateTheme} {...activeProps} />
          </ShellComponent>
        </div>
      </div>
    </TooltipProvider>
  )
}
