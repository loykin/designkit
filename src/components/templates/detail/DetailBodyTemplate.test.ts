import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { DetailBodyTemplate } from './DetailBodyTemplate'

describe('DetailBodyTemplate', () => {
  it('applies layoutClassName to the content and aside layout container', () => {
    const markup = renderToStaticMarkup(
      createElement(
        DetailBodyTemplate,
        {
          layoutClassName: 'mx-auto max-w-5xl',
          aside: createElement('div', null, 'Aside'),
        },
        createElement('div', null, 'Content'),
      ),
    )

    expect(markup).toContain('mx-auto max-w-5xl')
  })
})
