import { describe, expect, it } from 'vitest'
import { buildTemplateTheme } from './styleInjector'

describe('buildTemplateTheme', () => {
  it('builds default density tokens and semantic fallbacks', () => {
    expect(
      buildTemplateTheme({
        radius: 0.5,
        primaryHue: 220,
        primaryChroma: 0.15,
        density: 'default',
        fontScale: 1,
        lineHeight: 1,
      }),
    ).toMatchObject({
      '--designkit-radius': '0.5rem',
      '--radius': '0.5rem',
      '--designkit-primary': 'oklch(0.52 0.15 220)',
      '--primary': 'oklch(0.52 0.15 220)',
      '--designkit-border': 'oklch(0.922 0.0060 220)',
      '--border': 'oklch(0.922 0.0060 220)',
      '--designkit-toolbar-height': '2.75rem',
      '--designkit-page-padding-y': '1rem',
      '--designkit-panel-gap': '1rem',
      '--text-sm': 'var(--designkit-text-sm)',
      '--text-sm--line-height': 'var(--designkit-leading-sm)',
    })
  })

  it('applies template overrides and dark tonal tokens', () => {
    expect(
      buildTemplateTheme(
        {
          radius: 0.5,
          primaryHue: 260,
          primaryChroma: 0.2,
          density: 'default',
          darkMode: true,
        },
        {
          radius: 0.75,
          primaryChroma: 0.1,
          density: 'compact',
          pagePaddingY: '0.5rem',
          panelGap: '0.625rem',
          toolbarHeight: '2.25rem',
        },
      ),
    ).toMatchObject({
      '--designkit-radius': '0.75rem',
      '--radius': '0.75rem',
      '--designkit-primary': 'oklch(0.52 0.1 260)',
      '--primary': 'oklch(0.52 0.1 260)',
      '--designkit-density': 0.85,
      '--designkit-page-padding-y': '0.5rem',
      '--designkit-panel-gap': '0.625rem',
      '--designkit-toolbar-height': '2.25rem',
      '--designkit-border': 'oklch(0.32  0.0060 260)',
      '--border': 'oklch(0.32  0.0060 260)',
      '--designkit-input': 'oklch(0.35  0.0060 260)',
      '--input': 'oklch(0.35  0.0060 260)',
    })
  })
})
