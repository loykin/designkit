import { useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import type { TemplateId } from '@/store/types'

const STYLE_ID = 'designkit-vars'

function radiusVars(r: number) {
  return `
  --dk-radius:  ${r}rem;
  --dg-radius:  ${r}rem;
  --radius:     ${r}rem;
  --radius-sm:  ${(r * 0.6).toFixed(4)}rem;
  --radius-md:  ${(r * 0.8).toFixed(4)}rem;
  --radius-lg:  ${r}rem;
  --radius-xl:  ${(r * 1.4).toFixed(4)}rem;
  --radius-2xl: ${(r * 1.8).toFixed(4)}rem;`
}

function colorVars(chroma: number, hue: number) {
  return `
  --dk-primary:             oklch(0.205 ${chroma} ${hue});
  --dk-primary-foreground:  oklch(0.985 0 0);
  --dk-ring:                oklch(0.5 ${chroma} ${hue});
  --dg-primary:             oklch(0.205 ${chroma} ${hue});
  --dg-primary-foreground:  oklch(0.985 0 0);
  --dg-ring:                oklch(0.5 ${chroma} ${hue});
  --primary:               oklch(0.205 ${chroma} ${hue});
  --primary-foreground:    oklch(0.985 0 0);
  --color-primary:         oklch(0.205 ${chroma} ${hue});
  --color-primary-foreground: oklch(0.985 0 0);
  --ring:                  oklch(0.5 ${chroma} ${hue});
  --color-ring:            oklch(0.5 ${chroma} ${hue});
  --sidebar-primary:       oklch(0.488 ${chroma} ${hue});
  --color-sidebar-primary: oklch(0.488 ${chroma} ${hue});`
}

function typographyVars(fontScale: number, lineHeight: number) {
  return `
  --dk-font-scale:  ${fontScale};
  --dk-line-height: ${lineHeight};
  --dk-text-xs:     calc(0.75rem * ${fontScale});
  --dk-text-sm:     calc(0.875rem * ${fontScale});
  --dk-text-base:   calc(1rem * ${fontScale});
  --dk-text-lg:     calc(1.125rem * ${fontScale});
  --dk-leading-xs:  calc(1rem * ${lineHeight});
  --dk-leading-sm:  calc(1.25rem * ${lineHeight});
  --dk-leading-base:calc(1.5rem * ${lineHeight});
  --dk-leading-lg:  calc(1.75rem * ${lineHeight});
  --text-xs:        var(--dk-text-xs);
  --text-sm:        var(--dk-text-sm);
  --text-base:      var(--dk-text-base);
  --text-lg:        var(--dk-text-lg);
  --text-xs--line-height:   var(--dk-leading-xs);
  --text-sm--line-height:   var(--dk-leading-sm);
  --text-base--line-height: var(--dk-leading-base);
  --text-lg--line-height:   var(--dk-leading-lg);`
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

    // :root = global (affects shell/toolbar)
    const rootBlock = `:root {${radiusVars(g.radius)}${colorVars(g.primaryChroma, g.primaryHue)}${typographyVars(g.fontScale, g.lineHeight)}\n}`

    // .layout-{id} = template-specific overrides
    const tmplBlocks = (Object.entries(ov) as [TemplateId, typeof ov[TemplateId]][])
      .map(([id, o]) => {
        const lines: string[] = []
        if (o.radius        !== undefined) lines.push(radiusVars(o.radius))
        if (o.primaryChroma !== undefined) lines.push(colorVars(o.primaryChroma, g.primaryHue))
        if (!lines.length) return ''
        return `.layout-${id} {${lines.join('')}\n}`
      })
      .filter(Boolean)

    el.textContent = [rootBlock, ...tmplBlocks].join('\n\n')
  }, [g, ov])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', g.darkMode)
  }, [g.darkMode])
}

/** Returns CSS custom properties for a template — used as inline style for external usage */
export function buildTemplateTheme(
  g: { radius: number; primaryHue: number; primaryChroma: number; fontScale?: number; lineHeight?: number },
  ov: { radius?: number; primaryChroma?: number },
): React.CSSProperties {
  const r = ov.radius        ?? g.radius
  const c = ov.primaryChroma ?? g.primaryChroma
  const fontScale = g.fontScale ?? 1
  const lineHeight = g.lineHeight ?? 1
  return {
    '--dk-radius':            `${r}rem`,
    '--dg-radius':            `${r}rem`,
    '--radius':               `${r}rem`,
    '--radius-sm':            `${(r * 0.6).toFixed(4)}rem`,
    '--radius-md':            `${(r * 0.8).toFixed(4)}rem`,
    '--radius-lg':            `${r}rem`,
    '--dk-primary':           `oklch(0.205 ${c} ${g.primaryHue})`,
    '--dk-primary-foreground':'oklch(0.985 0 0)',
    '--dk-ring':              `oklch(0.5 ${c} ${g.primaryHue})`,
    '--dg-primary':           `oklch(0.205 ${c} ${g.primaryHue})`,
    '--dg-primary-foreground':'oklch(0.985 0 0)',
    '--dg-ring':              `oklch(0.5 ${c} ${g.primaryHue})`,
    '--primary':              `oklch(0.205 ${c} ${g.primaryHue})`,
    '--primary-foreground':   'oklch(0.985 0 0)',
    '--color-primary':        `oklch(0.205 ${c} ${g.primaryHue})`,
    '--ring':                 `oklch(0.5 ${c} ${g.primaryHue})`,
    '--color-ring':           `oklch(0.5 ${c} ${g.primaryHue})`,
    '--dk-font-scale':        fontScale,
    '--dk-line-height':       lineHeight,
    '--dk-text-xs':           `calc(0.75rem * ${fontScale})`,
    '--dk-text-sm':           `calc(0.875rem * ${fontScale})`,
    '--dk-text-base':         `calc(1rem * ${fontScale})`,
    '--dk-text-lg':           `calc(1.125rem * ${fontScale})`,
    '--dk-leading-xs':        `calc(1rem * ${lineHeight})`,
    '--dk-leading-sm':        `calc(1.25rem * ${lineHeight})`,
    '--dk-leading-base':      `calc(1.5rem * ${lineHeight})`,
    '--dk-leading-lg':        `calc(1.75rem * ${lineHeight})`,
  } as React.CSSProperties
}
