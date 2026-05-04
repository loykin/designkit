import { useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import type { TemplateId } from '@/store/types'

const STYLE_ID = 'designkit-vars'

function radiusVars(r: number) {
  return `
  --radius:     ${r}rem;
  --radius-sm:  ${(r * 0.6).toFixed(4)}rem;
  --radius-md:  ${(r * 0.8).toFixed(4)}rem;
  --radius-lg:  ${r}rem;
  --radius-xl:  ${(r * 1.4).toFixed(4)}rem;
  --radius-2xl: ${(r * 1.8).toFixed(4)}rem;`
}

function colorVars(chroma: number, hue: number) {
  return `
  --primary:               oklch(0.205 ${chroma} ${hue});
  --primary-foreground:    oklch(0.985 0 0);
  --color-primary:         oklch(0.205 ${chroma} ${hue});
  --color-primary-foreground: oklch(0.985 0 0);
  --ring:                  oklch(0.5 ${chroma} ${hue});
  --color-ring:            oklch(0.5 ${chroma} ${hue});
  --sidebar-primary:       oklch(0.488 ${chroma} ${hue});
  --color-sidebar-primary: oklch(0.488 ${chroma} ${hue});`
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
    const rootBlock = `:root {${radiusVars(g.radius)}${colorVars(g.primaryChroma, g.primaryHue)}\n}`

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
  g: { radius: number; primaryHue: number; primaryChroma: number },
  ov: { radius?: number; primaryChroma?: number },
): React.CSSProperties {
  const r = ov.radius        ?? g.radius
  const c = ov.primaryChroma ?? g.primaryChroma
  return {
    '--radius':               `${r}rem`,
    '--radius-sm':            `${(r * 0.6).toFixed(4)}rem`,
    '--radius-md':            `${(r * 0.8).toFixed(4)}rem`,
    '--radius-lg':            `${r}rem`,
    '--primary':              `oklch(0.205 ${c} ${g.primaryHue})`,
    '--primary-foreground':   'oklch(0.985 0 0)',
    '--color-primary':        `oklch(0.205 ${c} ${g.primaryHue})`,
    '--ring':                 `oklch(0.5 ${c} ${g.primaryHue})`,
    '--color-ring':           `oklch(0.5 ${c} ${g.primaryHue})`,
  } as React.CSSProperties
}
