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

  it('renders toolbar controls for a single Body', () => {
    const markup = renderToStaticMarkup(
      <DataBodyTemplate
        toolbarLeft={<span>Search users</span>}
        toolbarRight={<button>Add user</button>}
      >
        <DataBodyTemplate.Body>Users grid</DataBodyTemplate.Body>
      </DataBodyTemplate>,
    )

    expect(markup).toContain('Search users')
    expect(markup).toContain('Add user')
    expect(markup).toContain('Users grid')
  })

  it('keeps tab-scoped toolbar, body, and footer content inside the active tab boundary', () => {
    const markup = renderToStaticMarkup(
      <DataBodyTemplate activeTab="sessions">
        <DataBodyTemplate.Tab
          id="users"
          label="Users"
          toolbarRight={<button>Add user</button>}
          footer={<span>Users pagination</span>}
        >
          Users grid
        </DataBodyTemplate.Tab>
        <DataBodyTemplate.Tab
          id="sessions"
          label="Sessions"
          toolbarLeft={<span>Search sessions</span>}
          toolbarRight={<button>Filter sessions</button>}
          footer={<span>Sessions pagination</span>}
        >
          Sessions grid
        </DataBodyTemplate.Tab>
      </DataBodyTemplate>,
    )

    expect(markup).toContain('Search sessions')
    expect(markup).toContain('Filter sessions')
    expect(markup).toContain('Sessions grid')
    expect(markup).toContain('Sessions pagination')
    expect(markup).not.toContain('Add user')
    expect(markup).not.toContain('Users grid')
    expect(markup).not.toContain('Users pagination')
  })

  it('groups resource controls, refresh status, content, and pagination below a tab', () => {
    const markup = renderToStaticMarkup(
      <DataBodyTemplate>
        <DataBodyTemplate.Tab id="users" label="Users">
          <DataBodyTemplate.Resource
            toolbarLeft={<span>Search users</span>}
            toolbarRight={<button>Add user</button>}
            refreshing
            footer={<span>Page 1 of 3</span>}
          >
            Users grid
          </DataBodyTemplate.Resource>
        </DataBodyTemplate.Tab>
      </DataBodyTemplate>,
    )

    expect(markup).toContain('data-slot="data-body-resource"')
    expect(markup).toContain('data-refreshing="true"')
    expect(markup).toContain('Search users')
    expect(markup).toContain('Add user')
    expect(markup).toContain('Refreshing')
    expect(markup).toContain('Users grid')
    expect(markup).toContain('Page 1 of 3')
  })
})
