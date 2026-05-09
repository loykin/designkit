import { useEffect } from 'react'
import { getTemplateDefinition } from '@/components/templates/definitions'
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

  return {
    '--dk-radius': `${radius}rem`,
    '--dg-radius': `${radius}rem`,
    '--radius': `${radius}rem`,
    '--radius-sm': `${(radius * 0.6).toFixed(4)}rem`,
    '--radius-md': `${(radius * 0.8).toFixed(4)}rem`,
    '--radius-lg': `${radius}rem`,
    '--radius-xl': `${(radius * 1.4).toFixed(4)}rem`,
    '--radius-2xl': `${(radius * 1.8).toFixed(4)}rem`,

    '--dk-primary': `oklch(0.52 ${primaryChroma} ${primaryHue})`,
    '--dk-primary-foreground': 'oklch(0.985 0 0)',
    '--dk-ring': `oklch(0.5 ${primaryChroma} ${primaryHue})`,
    '--dg-primary': `oklch(0.52 ${primaryChroma} ${primaryHue})`,
    '--dg-primary-foreground': 'oklch(0.985 0 0)',
    '--dg-ring': `oklch(0.5 ${primaryChroma} ${primaryHue})`,
    '--primary': `oklch(0.52 ${primaryChroma} ${primaryHue})`,
    '--primary-foreground': 'oklch(0.985 0 0)',
    '--color-primary': `oklch(0.52 ${primaryChroma} ${primaryHue})`,
    '--color-primary-foreground': 'oklch(0.985 0 0)',
    '--ring': `oklch(0.5 ${primaryChroma} ${primaryHue})`,
    '--color-ring': `oklch(0.5 ${primaryChroma} ${primaryHue})`,
    '--sidebar-primary': `oklch(0.488 ${primaryChroma} ${primaryHue})`,
    '--color-sidebar-primary': `oklch(0.488 ${primaryChroma} ${primaryHue})`,

    '--dk-font-scale': fontScale,
    '--dk-line-height': lineHeight,
    '--dk-density': densityValues.density,
    '--dk-page-padding-y': pagePaddingY ?? densityValues.pagePaddingY,
    '--dk-panel-gap': panelGap ?? densityValues.panelGap,
    '--dk-toolbar-height': toolbarHeight ?? densityValues.toolbarHeight,
    '--dk-text-xs': `calc(0.75rem * ${fontScale})`,
    '--dk-text-sm': `calc(0.875rem * ${fontScale})`,
    '--dk-text-base': `calc(1rem * ${fontScale})`,
    '--dk-text-lg': `calc(1.125rem * ${fontScale})`,
    '--dk-text-xl': `calc(1.25rem * ${fontScale})`,
    '--dk-leading-xs': `calc(1rem * ${lineHeight})`,
    '--dk-leading-sm': `calc(1.25rem * ${lineHeight})`,
    '--dk-leading-base': `calc(1.5rem * ${lineHeight})`,
    '--dk-leading-lg': `calc(1.75rem * ${lineHeight})`,
    '--dk-leading-xl': `calc(1.75rem * ${lineHeight})`,
    '--text-xs': 'var(--dk-text-xs)',
    '--text-sm': 'var(--dk-text-sm)',
    '--text-base': 'var(--dk-text-base)',
    '--text-lg': 'var(--dk-text-lg)',
    '--text-xl': 'var(--dk-text-xl)',
    '--text-xs--line-height': 'var(--dk-leading-xs)',
    '--text-sm--line-height': 'var(--dk-leading-sm)',
    '--text-base--line-height': 'var(--dk-leading-base)',
    '--text-lg--line-height': 'var(--dk-leading-lg)',
    '--text-xl--line-height': 'var(--dk-leading-xl)',
  }
}

function tokenMapToCss(tokens: TokenMap) {
  return Object.entries(tokens)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')
}

export function useStyleInjector() {
  const g  = useThemeStore((s) => s.global)
  const ov = useThemeStore((s) => s.overrides)

  useEffect(() => {
    let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null
    if (!el) {
      el = document.createElement('style')
      el.id = STYLE_ID
      document.head.appendChild(el)
    }

    const rootBlock = `:root {\n${tokenMapToCss(buildTokenMap(g))}\n}`

    // .layout-{id} = template-specific overrides
    const tmplBlocks = (Object.entries(ov) as [TemplateId, typeof ov[TemplateId]][])
      .map(([id, o]) => {
        if (
          o.radius === undefined &&
          o.primaryChroma === undefined &&
          o.density === undefined &&
          o.pagePaddingY === undefined &&
          o.panelGap === undefined &&
          o.toolbarHeight === undefined
        ) return ''
        const tokens = buildTokenMap({
          ...g,
          radius: o.radius ?? g.radius,
          primaryChroma: o.primaryChroma ?? g.primaryChroma,
          density: o.density ?? g.density,
          pagePaddingY: o.pagePaddingY,
          panelGap: o.panelGap,
          toolbarHeight: o.toolbarHeight,
        })
        const layoutClassName = getTemplateDefinition(id)?.layoutClassName ?? `layout-${id}`
        return `.${layoutClassName} {\n${tokenMapToCss(tokens)}\n}`
      })
      .filter(Boolean)

    el.textContent = [rootBlock, ...tmplBlocks].join('\n\n')
  }, [g, ov])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', g.darkMode)
  }, [g.darkMode])

  useEffect(() => {
    if (g.density === 'default') {
      document.documentElement.removeAttribute('data-dk-density')
      return
    }

    document.documentElement.dataset.dkDensity = g.density
  }, [g.density])
}

/** Returns CSS custom properties for a template — used as inline style for external usage */
export function buildTemplateTheme(
  g: { radius: number; primaryHue: number; primaryChroma: number; density?: DensityId; fontScale?: number; lineHeight?: number },
  ov: { radius?: number; primaryChroma?: number; density?: DensityId; pagePaddingY?: string; panelGap?: string; toolbarHeight?: string },
): React.CSSProperties {
  return buildTokenMap({
    radius: ov.radius ?? g.radius,
    primaryHue: g.primaryHue,
    primaryChroma: ov.primaryChroma ?? g.primaryChroma,
    density: ov.density ?? g.density,
    pagePaddingY: ov.pagePaddingY,
    panelGap: ov.panelGap,
    toolbarHeight: ov.toolbarHeight,
    fontScale: g.fontScale ?? 1,
    lineHeight: g.lineHeight ?? 1,
  }) as React.CSSProperties
}
