# DesignKit Consumer Agent Guide

Use this guide in applications that install `@loykin/designkit`. Copy or
reference the actionable rules from this document in the consuming repository's
root `AGENTS.md`; AI tools do not reliably discover guidance inside
`node_modules`.

## Objective

Use DesignKit for common page structure, component behavior, and design
conventions while allowing each application to have its own brand and product
identity.

DesignKit is not intended to make every application visually identical.
Applications may vary color, typography, radius, density, content, and
domain-specific composition while retaining shared structural patterns.

## Required Setup

Install the package:

```bash
npm install @loykin/designkit
```

DesignKit requires Tailwind CSS v4. Import Tailwind and the published DesignKit
styles from the same global CSS entry:

```css
@import "tailwindcss";
@import "@loykin/designkit/styles";
```

The DesignKit stylesheet registers the package's `dist` directory as a
Tailwind source. The application therefore generates its own utilities and
DesignKit's utilities together. Do not add a second DesignKit `@source` rule,
and do not expect DesignKit to provide pre-built Tailwind utility CSS.

If the application also uses `@loykin/gridkit`, import gridkit styles last:

```css
@import "tailwindcss";
@import "@loykin/designkit/styles";
@import "@loykin/gridkit/styles";  /* must come last — uses @layer gridkit */
```

The application must define the semantic Tailwind/shadcn variables it wants to
control, including variables such as:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --border: oklch(0.922 0 0);
  --radius: 0.625rem;
}
```

Use the application's existing theme definitions when they already provide
these variables.

## Agent Implementation Order

When implementing a page:

1. Check the public exports from `@loykin/designkit`.
2. Select the closest existing page template.
3. Fill documented slots with project-specific content.
4. Apply branding through semantic CSS variables or the template `theme` prop.
5. Use documented variants and `className` props for local composition.
6. Propose a reusable DesignKit extension when a needed capability is broadly
   applicable.
7. Create a project-only component when the behavior is genuinely
   domain-specific.

Do not begin by rebuilding a page shell, Button, Input, Card, tabs, or another
component already supplied by DesignKit.

## Template Selection

| Requirement | Template |
| --- | --- |
| Data, list, tabs, or settings page | `DataBodyTemplate` |
| Settings page with vertical category nav | `DataBodyTemplate` with `DataBodyTemplate.Section` |
| Selected item drives a detail pane (CRM, inbox, issue tracker) | `ListDetailBodyTemplate` |
| Entity or record details | `DetailBodyTemplate` |
| Multi-step form | `FormWizardBodyTemplate` |
| Dashboard shell and panels | `DashboardBodyTemplate` |
| Editor, multi-pane workspace, or agent chat | `WorkbenchBodyTemplate` |
| Filter sidebar and browse results | `BrowseBodyTemplate` |
| Authentication page | `LoginBodyTemplate` |

Avoid using `DataPage` directly in application pages. `DataPage` is a low-level
layout primitive that the body templates compose internally. Consuming it
directly bypasses the template-level integration: the `theme` prop, shell
coordination, and density tokens will not apply. Use one of the body templates
above and reach for `DataPage` only when building a new reusable template that
is not covered by any existing one.

### ListDetailBodyTemplate

Two-pane master-detail layout. The list pane has a fixed width; the detail pane
fills the remaining space. On mobile, only one pane is visible at a time —
passing `detail` shows the detail pane, omitting it shows the list.

```tsx
import { ListDetailBodyTemplate, PageTopBar } from '@loykin/designkit'

<ListDetailBodyTemplate
  topBar={<PageTopBar left="Issues" />}
  listWidth={320}
  list={<IssueList onSelect={setSelectedId} />}
  detail={selected ? <IssueDetail issue={selected} /> : undefined}
  emptyDetail={<p>Select an issue to view details</p>}
/>
```

### WorkbenchBodyTemplate with DataGridAgentChat

For agent or LLM chat interfaces, place `DataGridAgentChat` from
`@loykin/gridkit` in the `mainPane` slot. Use `leftPane` for conversation
history or context.

```tsx
import { WorkbenchBodyTemplate, PageTopBar } from '@loykin/designkit'
import { DataGridAgentChat } from '@loykin/gridkit'
import type { AgentChatEvent } from '@loykin/gridkit'

const events: AgentChatEvent[] = [
  { id: '1', type: 'message', role: 'user', content: 'How many active users?' },
  { id: '2', type: 'tool_call', name: 'query_database', status: 'complete',
    input: { sql: 'SELECT COUNT(*) FROM users WHERE active = true' } },
  { id: '3', type: 'tool_result', name: 'query_database', output: { count: 4218 } },
  { id: '4', type: 'message', role: 'assistant', content: '4,218 active users.' },
]

<WorkbenchBodyTemplate
  topBar={<PageTopBar variant="default" left="Data Agent" />}
  leftPaneWidth={220}
  leftPane={<ConversationList />}
  mainPane={
    <DataGridAgentChat
      events={events}
      fillParent
      stickToBottom
      scrollbar={{ mode: 'custom' }}
      styles={{ root: { '--gridkit-container-border': 'transparent' } as React.CSSProperties }}
    />
  }
/>
```

## Supported Customization

Applications may customize:

- Semantic theme variables such as `--primary`, `--background`, and `--radius`.
- DesignKit variables such as `--designkit-page-padding-x`, `--designkit-page-padding-y`,
  `--designkit-panel-gap`, and `--designkit-toolbar-height`.
- Template `theme` props.
- Public slots such as `actions`, `toolbar`, `topBar`, `sidebar`, `header`,
  `lead`, `aside`, and children.
- Public component variants and documented `className` props.
- Domain-specific content, forms, permissions, routing, and data access.

Example:

```tsx
import {
  Button,
  DataBodyTemplate,
  PageTopBar,
} from '@loykin/designkit'

export function UsersPage() {
  return (
    <DataBodyTemplate
      topBar={<PageTopBar left="Admin / Users" />}
      title="Users"
      description="Manage project members."
      actions={<Button>Add user</Button>}
      theme={{
        '--designkit-panel-gap': '1.25rem',
        '--designkit-page-padding-x': '2rem',
      } as React.CSSProperties}
    >
      <DataBodyTemplate.Body>
        {/* Project-owned data and business behavior */}
      </DataBodyTemplate.Body>
    </DataBodyTemplate>
  )
}
```

## Avoid

- Copying DesignKit source files into the application.
- Importing undocumented paths such as
  `@loykin/designkit/dist/...` or package source paths.
- Querying or overriding undocumented internal DOM structure.
- Broad global CSS overrides and routine use of `!important`.
- Reimplementing public DesignKit components for minor visual differences.
- Placing project-specific API clients, schemas, or permissions in DesignKit.
- Assuming every playground demo is exported by the npm package.

## When To Extend DesignKit

Open a DesignKit change when:

- The same requirement appears in more than one application.
- A missing slot or variant would remove application-level overrides.
- Accessibility or interaction behavior should be consistent everywhere.
- The change belongs to page structure rather than domain behavior.

Keep the change local to the consuming application when:

- It depends on one application's data model or workflow.
- It is a one-off content composition using existing slots.
- It expresses application branding through supported tokens.

## Consumer Repository Rule

Add a short section like this to the consuming repository's `AGENTS.md`:

```md
## DesignKit

- Check `@loykin/designkit` before creating page shells or common UI.
- Prefer existing templates, props, and slots over copied implementations.
- Implement project branding with semantic CSS variables and `--designkit-*` tokens.
- Keep domain data and business logic in this repository.
- Do not import undocumented DesignKit internals.
- Run type checking and a production build after DesignKit-related changes.
```

## Validation

After implementation, run the consuming application's:

```bash
npm run type-check
npm run lint
npm run build
```

Also inspect the page at relevant responsive sizes and in both light and dark
modes when the application supports them.
