import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { DataBodyTemplate } from './DataBodyTemplate'

describe('DataBodyTemplate', () => {
  it('owns the semantic color of inline group dividers', () => {
    const markup = renderToStaticMarkup(
      <DataBodyTemplate title="Profile">
        <DataBodyTemplate.Body>
          <DataBodyTemplate.Group layout="inline">
            <DataBodyTemplate.Field label="Name">Sarah Kim</DataBodyTemplate.Field>
            <DataBodyTemplate.Field label="Email">sarah@acme.com</DataBodyTemplate.Field>
          </DataBodyTemplate.Group>
        </DataBodyTemplate.Body>
      </DataBodyTemplate>,
    )

    expect(markup).toContain('divide-y divide-border')
  })

  it('fails clearly when a compound component is rendered without its template root', () => {
    expect(() =>
      renderToStaticMarkup(
        <DataBodyTemplate.Group title="Invalid usage">Content</DataBodyTemplate.Group>,
      ),
    ).toThrow('<DataBodyTemplate.Group> must be rendered inside <DataBodyTemplate>')
  })
})
