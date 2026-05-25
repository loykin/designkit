import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import type { ComponentType, CSSProperties } from 'react'
import {
  useStyleInjector,
  buildTemplateTheme,
  useThemeStore,
  TooltipProvider,
  Button,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@loykin/designkit'
import type { TemplateId, ShellId } from '@loykin/designkit'
import { TEMPLATES, TEMPLATE_NAVIGATION, TEMPLATE_DEFINITIONS } from './templates'
import { HeaderShell } from './components/shells/HeaderShell'
import { SidebarShell } from './components/shells/SidebarShell'

const SHELLS = [
  { id: 'sidebar' as ShellId, label: 'Sidebar', component: SidebarShell },
  { id: 'header'  as ShellId, label: 'Header',  component: HeaderShell  },
]
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

function AppView() {
  useStyleInjector()

  const { shell: shellParam = 'sidebar', templateId = 'table' } = useParams()
  const navigate = useNavigate()
  const { setShell, setTemplate, setOverride, global: g, overrides } = useThemeStore()
  const [templateProps, setTemplateProps] = useState(initTemplateProps)

  // Initialize store overrides from template definition presets on first mount
  useEffect(() => {
    TEMPLATE_DEFINITIONS.forEach((def) => {
      if (def.preset && Object.keys(def.preset).length > 0) {
        setOverride(def.id, def.preset)
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync URL params → store (for StyleEditor / CodeExport)
  useEffect(() => {
    const validShell = SHELLS.find((s) => s.id === shellParam)
    if (validShell) setShell(shellParam as ShellId)
  }, [shellParam])

  useEffect(() => {
    const validTemplate = TEMPLATES.find((t) => t.id === templateId)
    if (validTemplate) setTemplate(templateId as TemplateId)
  }, [templateId])

  const activeShell    = shellParam as ShellId
  const activeTemplate = templateId as TemplateId

  const shell    = SHELLS.find((s) => s.id === activeShell) ?? SHELLS[0]
  const template = TEMPLATES.find((t) => t.id === activeTemplate) ?? TEMPLATES[0]
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

  const handleShellSelect = (id: ShellId) => navigate(`/${id}/${activeTemplate}`)

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col">
        <header className="flex h-11 shrink-0 items-center border-b bg-[var(--dk-header)] backdrop-blur-sm px-4 gap-3 z-20">
          <span className="text-xs font-bold text-muted-foreground mr-1">designkit</span>

          {/* Shell selector */}
          <div className="flex items-center gap-0.5" aria-label="Shell">
            {SHELLS.map((s) => (
              <Button
                key={s.id}
                variant={s.id === activeShell ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleShellSelect(s.id)}
                className="h-7 px-2.5 text-xs"
              >
                {s.label}
              </Button>
            ))}
          </div>

          {/* Template-specific options */}
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
          <ShellComponent navigation={TEMPLATE_NAVIGATION}>
            <BodyComponent theme={templateTheme} {...activeProps} />
          </ShellComponent>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/:shell/:templateId" element={<AppView />} />
      <Route path="*" element={<Navigate to="/sidebar/table" replace />} />
    </Routes>
  )
}
