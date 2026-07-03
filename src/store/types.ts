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

/**
 * @deprecated Playground/demo template identifiers remain available for one
 * release for source compatibility. New code should use `CurrentTemplateId`
 * for shipped DesignKit layouts or app-owned string ids for playground routes.
 */
export type LegacyTemplateId =
  | 'table'
  | 'table-infinity'
  | 'table-drag'
  | 'table-card'
  | 'table-card-list'
  | 'tabbed'
  | 'form'
  | 'form-stacked'
  | 'form-inline'
  | 'databody-detail'
  | 'databody-split'
  | 'login-forgot'
  | 'login-reset'
  | 'login-otp'
  | 'workbench-panel-editor'
  | 'workbench-sql-editor'
  | 'workbench-agent-chat'
  | 'detail-record'
  | 'detail-full'

export type TemplateId = CurrentTemplateId | LegacyTemplateId

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
  /**
   * @deprecated Playground navigation state is no longer managed by DesignKit.
   * Keep route or view state in the consuming app instead.
   */
  activeShell: ShellId
  /**
   * @deprecated Playground navigation state is no longer managed by DesignKit.
   * Keep route or view state in the consuming app instead.
   */
  activeTemplate: string
  setGlobal: (patch: Partial<GlobalTheme>) => void
  setOverride: (id: string, patch: Partial<TemplateOverride>) => void
  /**
   * @deprecated No-op compatibility shim. Keep shell routing in the consuming app.
   */
  setShell: (shell: ShellId) => void
  /**
   * @deprecated No-op compatibility shim. Keep template routing in the consuming app.
   */
  setTemplate: (template: string) => void
}
