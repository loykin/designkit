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
@import 'tailwindcss';
@import '@loykin/designkit/styles';
```

The DesignKit stylesheet registers the package's `dist` directory as a
Tailwind source. The application therefore generates its own utilities and
DesignKit's utilities together. Do not add a second DesignKit `@source` rule,
and do not expect DesignKit to provide pre-built Tailwind utility CSS.
It also provides the Tailwind v4 `@theme inline` bridge for shadcn-style
semantic utilities such as `bg-background`, `text-foreground`, and
`border-border`, plus the class-based `.dark` variant used by DesignKit
components.

If the application also uses `@loykin/gridkit`, import gridkit styles last:

```css
@import 'tailwindcss';
@import '@loykin/designkit/styles';
@import '@loykin/gridkit/styles'; /* must come last — uses @layer gridkit */
```

Gridkit remains a sibling package. It consumes shared semantic variables such
as `--primary`, `--border`, and `--radius`; DesignKit does not publish
`--gridkit-*` adapter tokens.

DesignKit ships usable fallback values for the shared semantic variables. The
application only needs to define the Tailwind/shadcn variables it wants to
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

## Consumer CSS Parity

DesignKit components must render correctly when a consumer imports only the
documented CSS contract:

```css
@import 'tailwindcss';
@import '@loykin/designkit/styles';
```

Do not rely on additional reset or base-layer rules from the DesignKit
playground. In particular, the playground's broad `* { @apply border-border }`
rule can hide a missing semantic border color in a component. Tailwind classes
such as `divide-y` and `divide-x` establish divider width and style, but an
unspecified divider color can resolve to `currentColor`. In a clean consumer,
that makes separators use the foreground text color instead of `--border`.

Component implementations own their border semantics. Pair divider utilities
with an explicit semantic color, for example `divide-y divide-border`, and pair
ordinary borders with the intended color such as `border border-border` or
`border border-input`. Do not ask consuming applications to add a broad global
border override to compensate for a DesignKit component.

This contract must be checked in a clean consumer fixture as well as the
DesignKit playground. A ResourceKit consumer reproduction showed why both are
necessary: `DataBodyTemplate` used `border border-border divide-y`; the outer
border was correct, while the dividers became foreground-colored outside the
playground because `divide-border` was missing. The playground appeared correct
only because its global base rule supplied the omitted color.

The incident was corrected by adding `divide-border` to the inline bordered
group in `DataBodyTemplate` and to the same implicit-divider pattern in
`ColorsBodyTemplate`. A server-rendering regression test now asserts that the
public `DataBodyTemplate` markup owns the semantic divider color.

## Shared Token Contract

All Loykin kits must treat shared shadcn-style semantic variables as the
cross-package contract. Kit-specific variables are local escape hatches, not
the source of truth.

| Token                           | Type / unit                   | Meaning                                  |
| ------------------------------- | ----------------------------- | ---------------------------------------- |
| `--background` / `--foreground` | CSS color, preferably OKLCH   | Default app surface and text             |
| `--card` / `--card-foreground`  | CSS color, preferably OKLCH   | Raised or framed surfaces                |
| `--primary`                     | CSS color, preferably OKLCH   | Primary action/accent color              |
| `--primary-foreground`          | CSS color, preferably OKLCH   | Text/icons on `--primary`                |
| `--border` / `--input`          | CSS color, preferably OKLCH   | Subtle separators and form borders       |
| `--ring`                        | CSS color, preferably OKLCH   | Focus ring color                         |
| `--radius`                      | CSS length, for example `8px` | Base corner radius, not a numeric factor |

Fallback order must be shared first, package namespace second, literal last:

```css
--kit-primary: var(--primary, var(--kit-primary-fallback, oklch(...)));
```

Do not reverse this to prefer a kit-specific variable over `--primary`; doing
so makes app theme changes silently miss that kit. DesignKit follows the same
rule by mapping Tailwind utilities through shared variables first and
`--designkit-*` as fallback.

Dark mode is class-based across kits. Use `.dark`, matching Tailwind's
`@custom-variant dark (&:is(.dark *))`; do not mix in `prefers-color-scheme`
for package defaults unless the consuming app explicitly owns that behavior.

Runtime tokens from `useStyleInjector` are emitted inside `@layer designkit`.
Unlayered app CSS has higher cascade priority, so an app-level `:root`
definition of `--primary`, `--border`, `--radius`, or `--designkit-*` wins over
the runtime theme injector. This is intentional: the app's global CSS is the
final authority. Use `useStyleInjector({ scope })` when the runtime theme
should apply only inside a container.

When a single gridkit instance needs a different value, override the
kit-specific variable on that component wrapper instead of changing the shared
token globally:

```tsx
<DataGrid
  styles={{
    root: {
      '--gridkit-border': 'transparent',
    } as React.CSSProperties,
  }}
/>
```

When DesignKit is embedded in only part of a host application, scope runtime
token injection to that host container:

```tsx
useStyleInjector({ scope: '#admin-shell' })
```

The default remains `:root`, which is appropriate when DesignKit owns the whole
application shell.

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

| Requirement                                                    | Template                                           |
| -------------------------------------------------------------- | -------------------------------------------------- |
| Data, list, tabs, or settings page                             | `DataBodyTemplate`                                 |
| Settings page with vertical category nav                       | `DataBodyTemplate` with `DataBodyTemplate.Section` |
| Selected item drives a detail pane (CRM, inbox, issue tracker) | `ListDetailBodyTemplate`                           |
| Entity or record details                                       | `DetailBodyTemplate`                               |
| Multi-step form                                                | `FormWizardBodyTemplate`                           |
| Dashboard shell and panels                                     | `DashboardBodyTemplate`                            |
| Editor, multi-pane workspace, or agent chat                    | `WorkbenchBodyTemplate`                            |
| Filter sidebar and browse results                              | `BrowseBodyTemplate`                               |
| Authentication page                                            | `LoginBodyTemplate`                                |

Avoid using `DataPage` directly in application pages. `DataPage` is a low-level
layout primitive that the body templates compose internally. Consuming it
directly bypasses the template-level integration: the `theme` prop, shell
coordination, and density tokens will not apply. Use one of the body templates
above and reach for `DataPage` only when building a new reusable template that
is not covered by any existing one.

## DataBodyTemplate Compound Contract

`DataBodyTemplate` is the required page-level root for all of its compound
members. Never render `DataBodyTemplate.Group`, `Tab`, `Section`, `Body`, `Row`,
`Field`, or `Summary` as a standalone component.

```tsx
// Correct
<DataBodyTemplate title="Settings">
  <DataBodyTemplate.Group title="Profile">
    <DataBodyTemplate.Row label="Name">
      <Input />
    </DataBodyTemplate.Row>
  </DataBodyTemplate.Group>
</DataBodyTemplate>
```

```tsx
// Incorrect: throws at render time because the required root is missing
<DataBodyTemplate.Group title="Profile">
  <DataBodyTemplate.Row label="Name">
    <Input />
  </DataBodyTemplate.Row>
</DataBodyTemplate.Group>
```

Choose exactly one primary child mode for each root:

- Direct content or `Group` children for a plain page.
- `Tab` children for tabbed content.
- `Section` children for left-navigation settings.
- One `Body` child for a single full-height pane.

Do not mix `Tab`, `Section`, and `Body` siblings in one root. Do not nest another
page-level template inside any of these slots. `DataBodyTemplate.Group` defaults
to `layout="stacked"`, so omit the prop unless another layout is needed.

These rules should be copied into a consuming repository's `AGENTS.md`. Package
JSDoc and runtime validation provide additional guidance, but an agent working
in an application may not inspect dependency source before generating code.

## UI Primitive Contract

DesignKit exports shadcn-compatible UI primitives such as `Button`, `Card`,
`Input`, `Select`, `Tabs`, `Sheet`, `AlertDialog`, `Tooltip`, `Avatar`, and
`Badge` from `@loykin/designkit`. They are real public exports, not only
internal template implementation details.

Use these primitives when composing content inside DesignKit template slots, or
when the consuming app has not already standardized on its own shadcn component
set. If the app already owns a shadcn/ui layer, it may use those local
components in DesignKit slots as long as they share the same Tailwind v4 build
and semantic variables (`--background`, `--foreground`, `--primary`,
`--border`, `--radius`). Do not import DesignKit primitive source files through
package-internal paths.

### AlertDialog for confirm / destructive-action prompts

`AlertDialog` wraps `@base-ui/react/alert-dialog` and, unlike `Sheet`, cannot
be dismissed by an outside click or Escape by default — use it whenever the
user must explicitly accept or cancel before an action proceeds (deleting a
record, discarding unsaved changes). Compose `AlertDialogAction` with
`variant="destructive"` for irreversible actions.

```tsx
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  Button,
} from '@loykin/designkit'

export function DeleteProjectButton({ onConfirm }: { onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive">Delete project</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

### ListDetailBodyTemplate

Two-pane master-detail layout. The list pane has a fixed width; the detail pane
fills the remaining space. On mobile, only one pane is visible at a time —
passing `detail` shows the detail pane, omitting it shows the list.

```tsx
import { ListDetailBodyTemplate, PageTopBar } from '@loykin/designkit'

export function IssuesPage() {
  return (
    <ListDetailBodyTemplate
      topBar={<PageTopBar left="Issues" />}
      listWidth={320}
      list={<IssueList onSelect={setSelectedId} />}
      detail={selected ? <IssueDetail issue={selected} /> : undefined}
      emptyDetail={<p>Select an issue to view details</p>}
    />
  )
}
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
  onResize={(sizes) => saveWorkbenchSizes(sizes)}
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
- Border variables such as `--border` and `--designkit-border`; keep these resolved
  to a subtle separator tone, not foreground text color.
- Template `theme` props.
- Public slots such as `actions`, `status`, `toolbar`, `topBar`, `sidebar`, `header`,
  `lead`, `aside`, and children.
- `DetailBodyTemplate.layoutClassName` for constraining the shared content + aside
  layout container without targeting internal DOM.
- Public component variants and documented `className` props.
- Domain-specific content, forms, permissions, routing, and data access.

Example:

```tsx
import { Button, DataBodyTemplate, PageTopBar } from '@loykin/designkit'

export function UsersPage() {
  return (
    <DataBodyTemplate
      topBar={<PageTopBar left="Admin / Users" />}
      title="Users"
      description="Manage project members."
      actions={<Button>Add user</Button>}
      theme={
        {
          '--designkit-panel-gap': '1.25rem',
          '--designkit-page-padding-x': '2rem',
        } as React.CSSProperties
      }
    >
      <DataBodyTemplate.Body>
        {/* Project-owned data and business behavior */}
      </DataBodyTemplate.Body>
    </DataBodyTemplate>
  )
}
```

`PageTopBar.right` is sized for compact toolbar actions by default. When placing
labeled filters, selects, or other taller controls in that slot, keep the default
toolbar height and add enough minimum height for the content:

```tsx
<PageTopBar left="Admin / Users" right={<UserFilters />} minHeight="76px" />
```

## Avoid

- Copying DesignKit source files into the application.
- Importing undocumented paths such as
  `@loykin/designkit/dist/...` or package source paths.
- Querying or overriding undocumented internal DOM structure.
- Broad global CSS overrides and routine use of `!important`.
- Broad global border overrides to correct DesignKit template separators.
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
