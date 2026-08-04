import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { HeaderShell } from './HeaderShell'
import type { TemplateNavigationGroup } from '@/components/templates'

const navigation: TemplateNavigationGroup[] = [
  {
    label: 'Main',
    items: [
      { id: 'overview', label: 'Overview', children: [] },
      { id: 'users', label: 'Users', children: [] },
    ],
  },
  {
    label: 'System',
    items: [{ id: 'settings', label: 'Settings', children: [] }],
  },
]

function markupFor(node: React.ReactElement) {
  return renderToStaticMarkup(node)
}

describe('HeaderShell', () => {
  it('keeps overflowing navigation reachable by scrolling instead of clipping it', () => {
    const markup = markupFor(
      <HeaderShell navigation={navigation} activeItemId="users">
        <div>Body</div>
      </HeaderShell>,
    )

    const list = /<ul[^>]*data-slot="navigation-menu-list"[^>]*>/.exec(markup)?.[0] ?? ''

    expect(list).toContain('overflow-x-auto')
    expect(list).toContain('min-w-0')
    // A visible track is the only affordance on platforms without overlay scrollbars.
    expect(list).toContain('scrollbar-width:thin')
  })

  it('never shrinks navigation items, so overflow scrolls rather than wrapping', () => {
    const markup = markupFor(
      <HeaderShell navigation={navigation} activeItemId="users">
        <div>Body</div>
      </HeaderShell>,
    )

    const items = markup.match(/<li[^>]*data-slot="navigation-menu-item"[^>]*>/g) ?? []

    expect(items.length).toBeGreaterThan(0)
    for (const item of items) expect(item).toContain('shrink-0')
  })

  it('holds the demo navigation in the same scroll area when no navigation is supplied', () => {
    const markup = markupFor(
      <HeaderShell>
        <div>Body</div>
      </HeaderShell>,
    )

    const nav = /<nav[^>]*>/.exec(markup)?.[0] ?? ''

    expect(nav).toContain('overflow-x-auto')
    expect(nav).toContain('scrollbar-width:thin')
  })
})
