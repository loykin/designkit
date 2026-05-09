export type ShellId    = 'sidebar' | 'header'
export type DensityId  = 'compact' | 'default' | 'comfortable'
export type TemplateId =
  | 'table'
  | 'table-infinity'
  | 'table-drag'
  | 'table-card'
  | 'table-card-list'
  | 'dashboard'
  | 'cardlist'
  | 'tabbed'
  | 'form'
  | 'typography'
  | 'databody'

export interface GlobalTheme {
  radius:        number
  primaryHue:    number
  primaryChroma: number
  fontScale:     number
  lineHeight:    number
  density:       DensityId
  darkMode:      boolean
}

export interface TemplateOverride {
  radius?:        number
  primaryChroma?: number
  density?:       DensityId
  pagePaddingY?:  string
  panelGap?:      string
  toolbarHeight?: string
}

export interface ThemeState {
  global:         GlobalTheme
  overrides:      Record<TemplateId, TemplateOverride>
  activeShell:    ShellId
  activeTemplate: TemplateId
  setGlobal:      (patch: Partial<GlobalTheme>) => void
  setOverride:    (id: TemplateId, patch: Partial<TemplateOverride>) => void
  setShell:       (shell: ShellId) => void
  setTemplate:    (template: TemplateId) => void
}
