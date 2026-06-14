# @loykin/designkit

React page template library. Provides ready-to-use page layouts for admin and dashboard applications.

For AI-assisted implementation in consuming applications, see the
[DesignKit Consumer Agent Guide](docs/consumer-guide.md).

## Installation

```bash
npm install @loykin/designkit
```

Requires React 19 and Tailwind CSS v4. UI components are based on [shadcn/ui](https://ui.shadcn.com) — if your app has shadcn set up, theming integrates automatically via shared CSS variables (`--primary`, `--background`, `--radius`, etc.).

Import the styles in your global CSS:

```css
/* globals.css */
@import "@loykin/designkit/styles";
```

The styles file includes pre-built Tailwind utility classes — no `@source` configuration required. You can also import the stylesheet from your app entry, as shown below.

## Quick Start

```tsx
import { DataBodyTemplate, PageTopBar, Button } from '@loykin/designkit'
import '@loykin/designkit/styles'

export function UsersPage() {
  return (
    <DataBodyTemplate
      topBar={<PageTopBar left="Admin / Users" />}
      title="Users"
      description="Manage your team members."
      actions={<Button>Add User</Button>}
    >
      <DataBodyTemplate.Body>
        {/* your content */}
      </DataBodyTemplate.Body>
    </DataBodyTemplate>
  )
}
```

---

## Templates

### DataBodyTemplate

General-purpose page shell. Accepts `.Body`, `.Tab`, and `.Section` child slots which determine the layout mode automatically.

```tsx
<DataBodyTemplate
  topBar={<PageTopBar left="Admin / Users" />}
  title="Users"
  description="Manage your team members."
  actions={<Button>Add User</Button>}
>
  {/* .Body | .Tab | .Section */}
</DataBodyTemplate>
```

| Prop | Type | Description |
|---|---|---|
| `topBar` | `ReactNode` | Top breadcrumb bar. Pass `<PageTopBar left="..." />` or omit. |
| `title` | `ReactNode` | Page title |
| `description` | `ReactNode` | Subtitle below the title |
| `actions` | `ReactNode` | Page-level actions (Add, Export, etc.) next to the title |
| `toolbarLeft` / `toolbarRight` | `ReactNode` | Toolbar slots above the content area |
| `theme` | `CSSProperties` | Inline CSS variable overrides |
| `className` | `string` | Class applied to the page root |

#### DataBodyTemplate.Body

Single-pane content. Use for full-height layouts.

```tsx
<DataBodyTemplate title="Users">
  <DataBodyTemplate.Body>
    {/* your content */}
  </DataBodyTemplate.Body>
</DataBodyTemplate>
```

> Passing children directly without a slot wrapper also renders as a body, but `.Body` makes the intent explicit.

#### DataBodyTemplate.Tab

Creates a tabbed page layout.

```tsx
<DataBodyTemplate title="Users">
  <DataBodyTemplate.Tab id="list" label="List" count={42}>
    {/* list content */}
  </DataBodyTemplate.Tab>
  <DataBodyTemplate.Tab id="settings" label="Settings">
    <SettingsForm />
  </DataBodyTemplate.Tab>
</DataBodyTemplate>
```

#### DataBodyTemplate.Section

Settings-style layout with left navigation and right content panel.

```tsx
<DataBodyTemplate title="Settings">
  <DataBodyTemplate.Section id="general" label="General" description="Workspace basics">
    <DataBodyTemplate.Group layout="stacked" title="Workspace">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue="Acme Corp" />
        <Button type="submit" size="sm">Save</Button>
      </form>
    </DataBodyTemplate.Group>
  </DataBodyTemplate.Section>
  <DataBodyTemplate.Section id="security" label="Security">
    <SecuritySettings />
  </DataBodyTemplate.Section>
</DataBodyTemplate>
```

#### DataBodyTemplate.Group

Groups content within a tab or section. The `layout` prop controls the visual structure.

| layout | Use case |
|---|---|
| `horizontal` | Label on left, input on right (settings form) |
| `stacked` | Label above, input below |
| `inline` | Table-style rows (detail view) |
| `split` | Left list + right detail |

| Prop | Type | Description |
|---|---|---|
| `layout` | `GroupLayout` | Visual structure — see table above |
| `variant` | `'card' \| 'plain' \| 'bordered'` | Wrapper style (defaults per layout) |
| `title` | `ReactNode` | Group heading |
| `description` | `ReactNode` | Subtitle below the heading |
| `actions` | `ReactNode` | Action slot next to the heading |
| `danger` | `boolean` | Renders title in destructive color |
| `className` | `string` | Class applied to the group root element |

```tsx
<DataBodyTemplate.Tab id="settings" label="Settings">
  <DataBodyTemplate.Group layout="horizontal" title="Identity" description="Basic information">
    <DataBodyTemplate.Row label="Name" required>
      <Input defaultValue="Sarah Kim" />
    </DataBodyTemplate.Row>
    <DataBodyTemplate.Row label="Email">
      <Input type="email" defaultValue="sarah@acme.com" />
    </DataBodyTemplate.Row>
  </DataBodyTemplate.Group>
</DataBodyTemplate.Tab>
```

#### DataBodyTemplate.Field

Read-only key-value display.

```tsx
<DataBodyTemplate.Group layout="inline" title="Identity">
  <DataBodyTemplate.Field label="Email">sarah@acme.com</DataBodyTemplate.Field>
  <DataBodyTemplate.Field label="Role"><Badge>Admin</Badge></DataBodyTemplate.Field>
</DataBodyTemplate.Group>
```

#### DataBodyTemplate.Summary

Pinned summary area below the header, above tabs.

```tsx
<DataBodyTemplate title="Overview">
  <DataBodyTemplate.Summary>
    <StatCards />
  </DataBodyTemplate.Summary>
  <DataBodyTemplate.Tab id="details" label="Details">...</DataBodyTemplate.Tab>
</DataBodyTemplate>
```

---

### DashboardBodyTemplate

Dashboard page shell. Provides the chrome — top bar, variable bar, panel grid area — while the app owns panel content and the data engine.

Requires [`@loykin/dashboardkit`](https://github.com/loykin/dashboardkit) 0.0.6 or newer for the grid and variable system:

```bash
npm install @loykin/dashboardkit@^0.0.6 react-grid-layout
```

Also import DashboardKit's grid CSS in your app:

```ts
import '@loykin/dashboardkit/styles'
```

For rounded design systems, tune DashboardKit's resize handle variables so the
handle stays inside the clipped panel corner:

```css
.layout-dashboard .react-grid-item:not(.react-grid-placeholder) {
  --designkit-resize-handle-size: clamp(20px, calc(var(--radius) * 1.6), 40px);
  --designkit-resize-handle-inset: clamp(4px, calc(var(--radius) * 0.45), 16px);
  --designkit-resize-handle-mark-size: clamp(6px, calc(var(--radius) * 0.55), 12px);
  --designkit-resize-handle-color: rgba(0, 0, 0, 0.35);
  --designkit-resize-handle-mark-radius: min(var(--radius), var(--designkit-resize-handle-mark-size));
}

.dark .layout-dashboard .react-grid-item:not(.react-grid-placeholder) {
  --designkit-resize-handle-color: rgba(255, 255, 255, 0.4);
}
```

```tsx
import React, { useState, useMemo } from 'react'
import { DashboardBodyTemplate, DashboardPanel, PageTopBar } from '@loykin/designkit'
import { createDashboardEngine, definePanel } from '@loykin/dashboardkit'
import { useLoadDashboard, useVariable, DashboardGrid } from '@loykin/dashboardkit/react'
import type { PanelViewerProps } from '@loykin/dashboardkit'

// Register panel types once at module level
const engine = createDashboardEngine()
engine.registerPanel(definePanel({
  id: 'stat',
  name: 'Stat',
  optionsSchema: {},
  viewer({ data, loading }: PanelViewerProps<unknown, unknown>) {
    if (loading) return null
    return <div className="text-2xl font-bold">{String(data ?? '—')}</div>
  },
}))

export function MyDashboard() {
  useLoadDashboard(engine, config)
  const envVar = useVariable(engine, 'env')
  const variables = useMemo(() => ({ env: (envVar.value as string) ?? 'production' }), [envVar.value])
  const [editable, setEditable] = useState(false)

  return (
    <DashboardBodyTemplate
      topBar={<PageTopBar left="My Dashboard" right={/* controls */} />}
      variableBar={/* <VariableSelect> components */}
    >
      <DashboardGrid engine={engine} editable={editable}>
        {({ panelType, config, data, rawData, loading, error, ref }) => {
          const Viewer = engine.getPanelPlugin(panelType)?.viewer as React.FC<PanelViewerProps<unknown, unknown>> | undefined
          return (
            <DashboardPanel
              ref={ref}
              title={config.title}
              loading={loading}
              error={error ?? undefined}
              editable={editable}
              style={{ height: '100%' }}
            >
              {Viewer && (
                <Viewer
                  panel={config} options={config.options}
                  data={data} rawData={rawData}
                  width={0} height={0}
                  loading={loading} error={error}
                  variables={variables}
                />
              )}
            </DashboardPanel>
          )
        }}
      </DashboardGrid>
    </DashboardBodyTemplate>
  )
}
```

**DashboardBodyTemplate props:**

| Prop | Type | Description |
|---|---|---|
| `topBar` | `ReactNode` | Top bar — breadcrumb, edit/refresh controls |
| `variableBar` | `ReactNode` | Variable dropdown strip between top bar and panels |
| `title` | `ReactNode` | Dashboard title (omit if topBar covers it) |
| `description` | `ReactNode` | Subtitle |
| `toolbar` | `ReactNode` | Toolbar slot next to the title |
| `theme` | `CSSProperties` | Inline CSS variable overrides |
| `className` | `string` | Class applied to the page root |
| `contentClassName` | `string` | Class applied to the panel grid area |

**DashboardPanel props:**

Panel card component. Wrap your panel viewer in `DashboardPanel` for consistent chrome across all panels.

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Panel title |
| `description` | `string` | Panel subtitle |
| `loading` | `boolean` | Shows loading spinner overlay |
| `error` | `string` | Shows error state, hides children |
| `editable` | `boolean` | Shows drag handle and edit ring |
| `headerRight` | `ReactNode` | Action slot in panel header — hidden until hover |
| `transparent` | `boolean` | Removes card border and background |
| `ref` | forwarded | Attach `DashboardGrid`'s `ref` for viewport virtualization |

---

### WorkbenchBodyTemplate

Resizable editor/workbench shell for products like panel editors, SQL editors, log explorers, and data workspaces. The template owns the pane chrome and resize handles; the app owns editor, preview, inspector, schema, and result content.

```tsx
import { WorkbenchBodyTemplate, PageTopBar, Button } from '@loykin/designkit'

export function SqlEditorPage() {
  return (
    <WorkbenchBodyTemplate
      topBar={<PageTopBar left="Data / Query editor" />}
      title="SQL editor"
      headerRight={<Button variant="outline" size="sm">Run</Button>}
      leftPane={<SchemaBrowser />}
      mainPane={<SqlEditor />}
      bottomPane={<ResultsGrid />}
      resizable
    />
  )
}
```

**WorkbenchBodyTemplate props:**

| Prop | Type | Description |
|---|---|---|
| `topBar` | `ReactNode` | Top bar above the workbench |
| `title` / `description` | `ReactNode` | Header copy above the panes |
| `headerRight` / `actions` | `ReactNode` | Header action slots |
| `leftPane` / `rightPane` | `ReactNode` | Optional side panes |
| `mainPane` | `ReactNode` | Primary editor or preview area |
| `bottomPane` | `ReactNode` | Optional result, query, or logs pane |
| `resizable` | `boolean` | Enables pane drag handles |
| `leftPaneCollapsed` / `rightPaneCollapsed` / `bottomPaneCollapsed` | `boolean` | Hides optional panes while preserving the template layout model |
| `leftPaneWidth` / `rightPaneWidth` / `bottomPaneHeight` | `number` | Initial pane sizes in pixels |

---

### FormWizardBodyTemplate

Multi-step input wizard. Wraps each step's `content` in a `<form>` element automatically.

```tsx
import { useState } from 'react'
import { FormWizardBodyTemplate, type FormWizardStep } from '@loykin/designkit'

const steps: FormWizardStep[] = [
  { key: 'info',   title: 'Basic Info',    content: <BasicInfoForm />  },
  { key: 'config', title: 'Configuration', content: <ConfigForm />     },
  { key: 'review', title: 'Review',        content: <ReviewStep />     },
]

export function OnboardingPage() {
  const [step, setStep] = useState(0)
  return (
    <FormWizardBodyTemplate
      title="Setup Wizard"
      steps={steps}
      activeStep={step}
      onNext={() => setStep((s) => Math.min(s + 1, steps.length - 1))}
      onBack={() => setStep((s) => Math.max(s - 1, 0))}
      onFinish={() => router.push('/dashboard')}
    />
  )
}
```

For per-step validation with `react-hook-form`:

```tsx
onNext={async () => {
  const ok = await trigger(['email', 'password'])
  if (ok) setStep((s) => s + 1)
}}
```

The `variant` prop switches between `'plain'` (default) and `'card'`.

---

### LoginBodyTemplate

Authentication page shell.

```tsx
import { LoginBodyTemplate } from '@loykin/designkit'

export function SignInPage() {
  return (
    <LoginBodyTemplate layout="centered" card="card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
        <Button type="submit" className="w-full">Sign In</Button>
      </form>
    </LoginBodyTemplate>
  )
}
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `layout` | `'centered' \| 'split'` | `'centered'` | Centered card or split-panel with brand side |
| `card` | `'card' \| 'plain'` | `'plain'` | Wrap form content in a card border |
| `cardWidth` | `'sm' \| 'md' \| 'lg'` | `'md'` | Form card width |
| `bg` | `'default' \| 'subtle' \| 'none'` | `'default'` | Background style |
| `side` | `'left' \| 'right'` | `'left'` | Brand panel side (split layout only) |
| `brand` | `ReactNode` | built-in | Custom brand/logo panel content |

---

## UI Components

```tsx
import {
  Avatar, AvatarFallback, AvatarImage,
  Badge,
  Button,
  Card, CardContent, CardHeader, CardTitle,
  Checkbox,
  DropdownMenu,
  EmptyState,
  Input,
  Label,
  NavigationMenu,
  Popover,
  ScrollArea,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Separator,
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
  Sidebar,
  Skeleton,
  Slider,
  Switch,
  Table,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
  PageTopBar,
} from '@loykin/designkit'
```

### EmptyState

```tsx
import { EmptyState } from '@loykin/designkit'
import { Users } from 'lucide-react'

<EmptyState
  icon={Users}
  title="No users yet"
  description="Add your first user to get started."
  action={{ label: 'Add User', onClick: () => openModal() }}
/>
```

---

## Theming

Designkit maps shadcn/ui CSS variables onto its own `--designkit-*` tokens. Changing your shadcn theme automatically updates all designkit components.

| What | How |
|---|---|
| Colors, radius, typography | shadcn/ui theme variables (`--primary`, `--radius`, etc.) |
| Spacing, density, padding | `--designkit-density`, `--designkit-page-padding-*`, `--designkit-panel-gap` |
| Per-page overrides | `className` or `theme` prop |

```css
:root {
  --designkit-density:        1;        /* 0.85 compact / 1 default / 1.15 comfortable */
  --designkit-page-padding-x: 1.5rem;
  --designkit-page-padding-y: 1rem;
  --designkit-panel-gap:      1rem;
}
```

Per-page override via `className`:

```css
.layout-dashboard {
  --designkit-density: 0.85;
}
```

```tsx
<DashboardBodyTemplate className="layout-dashboard" ...>
```

Or via `theme` prop:

```tsx
<DataBodyTemplate
  theme={{ '--designkit-density': '1.15' } as React.CSSProperties}
  title="Settings"
>
```

---

## Using with gridkit

If your app also uses `@loykin/gridkit`, import its styles **after** designkit:

```css
@import "tailwindcss";
@import "@loykin/designkit/styles";
@import "@loykin/gridkit/styles";  /* must come last — uses @layer gridkit */
```

gridkit registers a named `@layer gridkit`. Importing it before `tailwindcss` or `designkit/styles` causes layer ordering conflicts where utility overrides resolve incorrectly.

---

## Playground

Interactive development tool to preview templates and generate code.

```bash
git clone https://github.com/loykin/designkit
cd designkit
pnpm install
pnpm dev
```

---

## License

MIT
