export type ShellId = 'sidebar' | 'header'
export type DensityId = 'compact' | 'default' | 'comfortable'
export type CurrentTemplateId =
  | 'form-wizard'
  | 'databody'
  | 'sectioned'
  | 'typography'
  | 'colors'
  | 'login'
  | 'dashboard'
  | 'workbench'
  | 'browse'
  | 'detail'
  | 'list-detail'
  | 'panel'

export type TemplateId = CurrentTemplateId

export interface GlobalTheme {
  radius: number
  primaryHue: number
  primaryChroma: number
  fontScale: number
  lineHeight: number
  density: DensityId
  darkMode: boolean
}

export interface TemplateOverride {
  radius?: number
  primaryChroma?: number
  density?: DensityId
  pagePaddingY?: string
  panelGap?: string
  toolbarHeight?: string
}

export interface ThemeState {
  global: GlobalTheme
  overrides: Record<string, TemplateOverride>
  setGlobal: (patch: Partial<GlobalTheme>) => void
  setOverride: (id: string, patch: Partial<TemplateOverride>) => void
}
