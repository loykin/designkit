import {
  useStyleInjector,
  buildTemplateTheme,
  useThemeStore,
  SHELLS,
  TEMPLATES,
  TooltipProvider,
} from '@loykin/designkit'
import { StyleControls } from './components/editor/StyleEditor'
import { CodeExport } from './components/editor/CodeExport'

export default function App() {
  useStyleInjector()
  const { activeShell, activeTemplate, setShell, setTemplate, global: g, overrides } = useThemeStore()

  const shell    = SHELLS.find((s) => s.id === activeShell)!
  const template = TEMPLATES.find((t) => t.id === activeTemplate)!
  const ShellComponent = shell.component
  const BodyComponent  = template.component

  const templateTheme = buildTemplateTheme(g, overrides[activeTemplate])

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col">
        <header className="flex h-11 shrink-0 items-center border-b bg-background px-4 gap-3 z-20">
          <span className="text-xs font-bold text-muted-foreground mr-1">designkit</span>

          <div className="flex items-center gap-0.5">
            {SHELLS.map((s) => (
              <button key={s.id} onClick={() => setShell(s.id)}
                className={[
                  'px-2.5 py-1 text-xs rounded-md transition-colors',
                  s.id === activeShell
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                ].join(' ')}>
                {s.label}
              </button>
            ))}
          </div>

          <div className="w-px h-4 bg-border" />

          <div className="flex items-center gap-0.5">
            {TEMPLATES.map((t) => (
              <button key={t.id} onClick={() => setTemplate(t.id)}
                className={[
                  'px-2.5 py-1 text-xs rounded-md transition-colors',
                  t.id === activeTemplate
                    ? 'bg-secondary text-secondary-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                ].join(' ')}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <CodeExport />
            <StyleControls />
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <ShellComponent>
            <BodyComponent theme={templateTheme} />
          </ShellComponent>
        </div>
      </div>
    </TooltipProvider>
  )
}
