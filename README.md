# @loykin/designkit

React page template library. Provides ready-to-use page layouts for admin and dashboard applications.

## Installation

```bash
npm install @loykin/designkit
```

Requires React 19 as a peer dependency.

## Quick Start

```tsx
import { DataBodyTemplate, DataGridView, PageTopBar, type DataGridColumnDef } from '@loykin/designkit'
import '@loykin/designkit/styles'

type User = { id: string; name: string; email: string }

const columns: DataGridColumnDef<User>[] = [
  { id: 'name',  accessorKey: 'name',  header: 'Name'  },
  { id: 'email', accessorKey: 'email', header: 'Email' },
]

export function UsersPage() {
  return (
    <DataBodyTemplate
      topBar={<PageTopBar left="Admin / Users" />}
      title="Users"
    >
      <DataBodyTemplate.Body>
        <DataGridView data={data} columns={columns} getRowId={(row) => row.id} />
      </DataBodyTemplate.Body>
    </DataBodyTemplate>
  )
}
```

---

## Templates

### DataBodyTemplate

The general-purpose page shell. Accepts three kinds of child slots — `.Body`, `.Tab`, and `.Section` — which determine the layout mode automatically.

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
| `actions` | `ReactNode` | Page-level actions (Add, Export, etc.) next to the title. Not for form Save buttons. |
| `toolbarLeft` / `toolbarRight` | `ReactNode` | Toolbar slots above the content area |
| `theme` | `CSSProperties` | Inline CSS variable overrides |
| `className` | `string` | Class applied to the page root |

#### DataBodyTemplate.Body

Single-pane content. No navigation. Use for full-height grid or custom layouts.

```tsx
<DataBodyTemplate title="Users">
  <DataBodyTemplate.Body>
    <DataGridView data={data} columns={columns} getRowId={(row) => row.id} />
  </DataBodyTemplate.Body>
</DataBodyTemplate>
```

> Passing children directly without any slot wrapper also renders as a body, but `.Body` makes the layout intent explicit.

#### DataBodyTemplate.Tab

Creates a tabbed page layout. Add multiple `.Tab` children to enable the tab bar.

```tsx
<DataBodyTemplate title="Users">
  <DataBodyTemplate.Tab id="list" label="List" count={42}>
    <DataGridView data={data} columns={columns} getRowId={(row) => row.id} />
  </DataBodyTemplate.Tab>
  <DataBodyTemplate.Tab id="settings" label="Settings">
    <SettingsForm />
  </DataBodyTemplate.Tab>
</DataBodyTemplate>
```

#### DataBodyTemplate.Section

Settings-style layout with left navigation and right content panel. Add multiple `.Section` children to enable the side nav.

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

| layout | Use case | Default wrapper |
|---|---|---|
| `horizontal` | Label on left, input on right (settings form) | Card |
| `stacked` | Label above, input below | plain |
| `inline` | Table-style rows (detail view, inline form) | bordered |
| `split` | Left list + right detail | bordered |

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

Read-only key-value display. Use with `Group layout="inline"` for detail pages.

```tsx
<DataBodyTemplate.Group layout="inline" title="Identity">
  <DataBodyTemplate.Field label="Email">sarah@acme.com</DataBodyTemplate.Field>
  <DataBodyTemplate.Field label="Role"><Badge>Admin</Badge></DataBodyTemplate.Field>
</DataBodyTemplate.Group>
```

#### DataBodyTemplate.Summary

A pinned summary area below the header, above tabs.

```tsx
<DataBodyTemplate title="Overview">
  <DataBodyTemplate.Summary>
    <StatCards />
  </DataBodyTemplate.Summary>
  <DataBodyTemplate.Tab id="details" label="Details">...</DataBodyTemplate.Tab>
</DataBodyTemplate>
```

---

### DataGridView

Data table component. Use inside `DataBodyTemplate.Body` or any `.Tab` / `.Section`.

| variant | Description |
|---|---|
| `standard` (default) | Standard data table with pagination |
| `infinity` | Infinite scroll |
| `drag` | Row drag-to-reorder |
| `card` | Card grid |
| `card-list` | Card list |

```tsx
import { DataBodyTemplate, DataGridView, PageTopBar, type DataGridColumnDef } from '@loykin/designkit'

type User = { id: string; name: string; email: string }

const columns: DataGridColumnDef<User>[] = [
  { id: 'name',  accessorKey: 'name',  header: 'Name'  },
  { id: 'email', accessorKey: 'email', header: 'Email' },
]

export function UsersPage() {
  return (
    <DataBodyTemplate topBar={<PageTopBar left="Admin / Users" />} title="Users">
      <DataBodyTemplate.Body>
        <DataGridView
          data={data}
          columns={columns}
          getRowId={(row) => row.id}
          tableHeight={420}
        />
      </DataBodyTemplate.Body>
    </DataBodyTemplate>
  )
}
```

---

### FormWizardBodyTemplate

Multi-step input wizard. The template wraps each step's `content` in a `<form>` element automatically, so the Continue / Finish button acts as a submit trigger. Press Enter or click Continue to advance.

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

For per-step validation with `react-hook-form`, call `trigger()` inside `onNext` before advancing:

```tsx
onNext={async () => {
  const ok = await trigger(['email', 'password'])
  if (ok) setStep((s) => s + 1)
}}
```

The `variant` prop switches between `'plain'` (default) and `'card'` to wrap each step in a Card.

---

### LoginBodyTemplate

Authentication page shell. Renders centered or split-panel login layouts.

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
| `card` | `'card' \| 'plain'` | `'plain'` | Wrap the form content in a card border |
| `cardWidth` | `'sm' \| 'md' \| 'lg'` | `'md'` | Width of the form card |
| `bg` | `'default' \| 'subtle' \| 'none'` | `'default'` | Background style |
| `side` | `'left' \| 'right'` | `'left'` | Side the brand panel appears on (split layout only) |
| `brand` | `ReactNode` | built-in | Custom brand/logo panel content |

---

## UI Components

Base components for use within page templates.

```tsx
import {
  Badge, Button, Card, CardContent,
  Input, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Switch, Checkbox, Slider,
  EmptyState,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
  Avatar, AvatarFallback, AvatarImage,
  Separator, Skeleton,
  Breadcrumb, DropdownMenu, NavigationMenu,
  Popover, ScrollArea, Sidebar, Table,
  PageTopBar,
} from '@loykin/designkit'
```

### EmptyState

Displays empty data, no search results, or error states.

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

Control the global theme via CSS variables. Add to `globals.css`.

```css
:root {
  --dk-radius:  0.375rem;
  --dk-primary: oklch(0.52 0.2 250);

  --dk-density:        1;        /* 0.85 compact / 1 default / 1.15 comfortable */
  --dk-page-padding-x: 1.5rem;
  --dk-page-padding-y: 1rem;
  --dk-panel-gap:      1rem;
  --dk-toolbar-height: 2.75rem;
}
```

To override per page, combine with `className`:

```css
.layout-settings {
  --dk-radius:  0.5rem;
  --dk-density: 1.15;
}
```

```tsx
<DataBodyTemplate className="layout-settings" title="Settings">
  ...
</DataBodyTemplate>
```

Or use the `theme` prop for inline overrides:

```tsx
<DataBodyTemplate
  theme={{ '--dk-radius': '0.5rem', '--dk-density': '1.15' } as React.CSSProperties}
  title="Settings"
>
  ...
</DataBodyTemplate>
```

---

## Playground

An interactive development tool to preview templates and generate CSS/component code.

```bash
git clone https://github.com/loykin/designkit
cd designkit
pnpm install
pnpm dev
```

Open `http://localhost:5173` to browse templates and export code.

---

## License

MIT
