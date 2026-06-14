import { useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import type { DensityId, TemplateId } from '@/store/types'

const STYLE_ID = 'designkit-vars'

interface DesignTokenInput {
  radius: number
  primaryHue: number
  primaryChroma: number
  fontScale: number
  lineHeight: number
  density?: DensityId
  pagePaddingY?: string
  panelGap?: string
  toolbarHeight?: string
}

type TokenMap = Record<`--${string}`, string | number>

function buildTokenMap({
  radius,
  primaryHue,
  primaryChroma,
  fontScale,
  lineHeight,
  density = 'default',
  pagePaddingY,
  panelGap,
  toolbarHeight,
}: DesignTokenInput): TokenMap {
  const densityValues = {
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

  const c = (factor: number) => (primaryChroma * factor).toFixed(4)

  return {
    '--designkit-radius': `${radius}rem`,
    '--gridkit-radius': `${radius}rem`,
    '--radius': `${radius}rem`,
    '--radius-sm': `${(radius * 0.6).toFixed(4)}rem`,
    '--radius-md': `${(radius * 0.8).toFixed(4)}rem`,
    '--radius-lg': `${radius}rem`,
    '--radius-xl': `${(radius * 1.4).toFixed(4)}rem`,
    '--radius-2xl': `${(radius * 1.8).toFixed(4)}rem`,

    // primary — fully controlled
    '--designkit-primary': `oklch(0.52 ${primaryChroma} ${primaryHue})`,
    '--designkit-primary-foreground': 'oklch(0.985 0 0)',
    '--designkit-ring': `oklch(0.50 ${primaryChroma} ${primaryHue})`,
    '--gridkit-primary': `oklch(0.52 ${primaryChroma} ${primaryHue})`,
    '--gridkit-primary-foreground': 'oklch(0.985 0 0)',
    '--gridkit-ring': `oklch(0.50 ${primaryChroma} ${primaryHue})`,
    '--primary': `oklch(0.52 ${primaryChroma} ${primaryHue})`,
    '--primary-foreground': 'oklch(0.985 0 0)',
    '--color-primary': `oklch(0.52 ${primaryChroma} ${primaryHue})`,
    '--color-primary-foreground': 'oklch(0.985 0 0)',
    '--ring': `oklch(0.50 ${primaryChroma} ${primaryHue})`,
    '--color-ring': `oklch(0.50 ${primaryChroma} ${primaryHue})`,
    '--sidebar-primary': `oklch(0.488 ${primaryChroma} ${primaryHue})`,
    '--color-sidebar-primary': `oklch(0.488 ${primaryChroma} ${primaryHue})`,

    // tonal surface — same hue, heavily reduced chroma
    '--border': `oklch(0.922 ${c(0.04)} ${primaryHue})`,
    '--input': `oklch(0.922 ${c(0.04)} ${primaryHue})`,
    '--muted': `oklch(0.970 ${c(0.02)} ${primaryHue})`,
    '--secondary': `oklch(0.970 ${c(0.02)} ${primaryHue})`,
    '--accent': `oklch(0.970 ${c(0.04)} ${primaryHue})`,
    '--color-border': `oklch(0.922 ${c(0.04)} ${primaryHue})`,
    '--color-input': `oklch(0.922 ${c(0.04)} ${primaryHue})`,
    '--color-muted': `oklch(0.970 ${c(0.02)} ${primaryHue})`,
    '--color-secondary': `oklch(0.970 ${c(0.02)} ${primaryHue})`,
    '--color-accent': `oklch(0.970 ${c(0.04)} ${primaryHue})`,
    '--designkit-border': `oklch(0.922 ${c(0.04)} ${primaryHue})`,
    '--designkit-input': `oklch(0.922 ${c(0.04)} ${primaryHue})`,
    '--designkit-muted': `oklch(0.970 ${c(0.02)} ${primaryHue})`,
    '--gridkit-border': `oklch(0.922 ${c(0.04)} ${primaryHue})`,
    '--gridkit-muted': `oklch(0.970 ${c(0.02)} ${primaryHue})`,

    '--designkit-font-scale': fontScale,
    '--designkit-line-height': lineHeight,
    '--designkit-density': densityValues.density,
    '--designkit-page-padding-y': pagePaddingY ?? densityValues.pagePaddingY,
    '--designkit-panel-gap': panelGap ?? densityValues.panelGap,
    '--designkit-toolbar-height': toolbarHeight ?? densityValues.toolbarHeight,
    '--designkit-text-xs': `calc(0.75rem * ${fontScale})`,
    '--designkit-text-sm': `calc(0.875rem * ${fontScale})`,
    '--designkit-text-base': `calc(1rem * ${fontScale})`,
    '--designkit-text-lg': `calc(1.125rem * ${fontScale})`,
    '--designkit-text-xl': `calc(1.25rem * ${fontScale})`,
    '--designkit-leading-xs': `calc(1rem * ${lineHeight})`,
    '--designkit-leading-sm': `calc(1.25rem * ${lineHeight})`,
    '--designkit-leading-base': `calc(1.5rem * ${lineHeight})`,
    '--designkit-leading-lg': `calc(1.75rem * ${lineHeight})`,
    '--designkit-leading-xl': `calc(1.75rem * ${lineHeight})`,
    '--text-xs': 'var(--designkit-text-xs)',
    '--text-sm': 'var(--designkit-text-sm)',
    '--text-base': 'var(--designkit-text-base)',
    '--text-lg': 'var(--designkit-text-lg)',
    '--text-xl': 'var(--designkit-text-xl)',
    '--text-xs--line-height': 'var(--designkit-leading-xs)',
    '--text-sm--line-height': 'var(--designkit-leading-sm)',
    '--text-base--line-height': 'var(--designkit-leading-base)',
    '--text-lg--line-height': 'var(--designkit-leading-lg)',
    '--text-xl--line-height': 'var(--designkit-leading-xl)',
  }
}

function buildDarkTonalTokens(primaryHue: number, primaryChroma: number): TokenMap {
  const c = (factor: number) => (primaryChroma * factor).toFixed(4)
  return {
    '--border': `oklch(0.32  ${c(0.06)} ${primaryHue})`,
    '--input': `oklch(0.35  ${c(0.06)} ${primaryHue})`,
    '--muted': `oklch(0.269 ${c(0.03)} ${primaryHue})`,
    '--secondary': `oklch(0.269 ${c(0.02)} ${primaryHue})`,
    '--accent': `oklch(0.320 ${c(0.04)} ${primaryHue})`,
    '--color-border': `oklch(0.32  ${c(0.06)} ${primaryHue})`,
    '--color-input': `oklch(0.35  ${c(0.06)} ${primaryHue})`,
    '--color-muted': `oklch(0.269 ${c(0.03)} ${primaryHue})`,
    '--color-secondary': `oklch(0.269 ${c(0.02)} ${primaryHue})`,
    '--color-accent': `oklch(0.320 ${c(0.04)} ${primaryHue})`,
    '--designkit-border': `oklch(0.32  ${c(0.06)} ${primaryHue})`,
    '--designkit-input': `oklch(0.35  ${c(0.06)} ${primaryHue})`,
    '--designkit-muted': `oklch(0.269 ${c(0.03)} ${primaryHue})`,
    '--gridkit-border': `oklch(0.32  ${c(0.06)} ${primaryHue})`,
    '--gridkit-muted': `oklch(0.269 ${c(0.03)} ${primaryHue})`,
  }
}

function tokenMapToCss(tokens: TokenMap) {
  return Object.entries(tokens)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')
}

export function useStyleInjector() {
  const g = useThemeStore((s) => s.global)
  const ov = useThemeStore((s) => s.overrides)

  useEffect(() => {
    let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null
    if (!el) {
      el = document.createElement('style')
      el.id = STYLE_ID
      document.head.appendChild(el)
    }

    const rootBlock = `:root {\n${tokenMapToCss(buildTokenMap(g))}\n}`
    const darkTonalBlock = `.dark {\n${tokenMapToCss(buildDarkTonalTokens(g.primaryHue, g.primaryChroma))}\n}`

    const tmplBlocks = (Object.entries(ov) as [TemplateId, (typeof ov)[TemplateId]][])
      .map(([id, o]) => {
        if (
          o.radius === undefined &&
          o.primaryChroma === undefined &&
          o.density === undefined &&
          o.pagePaddingY === undefined &&
          o.panelGap === undefined &&
          o.toolbarHeight === undefined
        )
          return ''
        const tokens = buildTokenMap({
          ...g,
          radius: o.radius ?? g.radius,
          primaryChroma: o.primaryChroma ?? g.primaryChroma,
          density: o.density ?? g.density,
          pagePaddingY: o.pagePaddingY,
          panelGap: o.panelGap,
          toolbarHeight: o.toolbarHeight,
        })
        const layoutClassName = `layout-${id}`
        return `.${layoutClassName} {\n${tokenMapToCss(tokens)}\n}`
      })
      .filter(Boolean)

    el.textContent = [rootBlock, darkTonalBlock, ...tmplBlocks].join('\n\n')
  }, [g, ov])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', g.darkMode)
  }, [g.darkMode])

  useEffect(() => {
    if (g.density === 'default') {
      document.documentElement.removeAttribute('data-designkit-density')
      return
    }
    document.documentElement.dataset.designkitDensity = g.density
  }, [g.density])
}

/** Returns CSS custom properties for a template — used as inline style for external usage */
export function buildTemplateTheme(
  g: {
    radius: number
    primaryHue: number
    primaryChroma: number
    darkMode?: boolean
    density?: DensityId
    fontScale?: number
    lineHeight?: number
  },
  ov: {
    radius?: number
    primaryChroma?: number
    density?: DensityId
    pagePaddingY?: string
    panelGap?: string
    toolbarHeight?: string
  } = {},
): React.CSSProperties {
  const tokens = buildTokenMap({
    radius: ov.radius ?? g.radius,
    primaryHue: g.primaryHue,
    primaryChroma: ov.primaryChroma ?? g.primaryChroma,
    density: ov.density ?? g.density,
    pagePaddingY: ov.pagePaddingY,
    panelGap: ov.panelGap,
    toolbarHeight: ov.toolbarHeight,
    fontScale: g.fontScale ?? 1,
    lineHeight: g.lineHeight ?? 1,
  })

  if (g.darkMode) {
    Object.assign(tokens, buildDarkTonalTokens(g.primaryHue, ov.primaryChroma ?? g.primaryChroma))
  }

  return tokens as React.CSSProperties
}
