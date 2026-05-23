# @loykin/designkit

React page template library. Provides ready-to-use page layouts for admin and dashboard applications.

## Installation

```bash
npm install @loykin/designkit
```

Requires React 19 as a peer dependency.

## Quick Start

```tsx
import { DataBodyTemplate } from '@loykin/designkit'
import '@loykin/designkit/styles'

export function UsersPage() {
  return (
    <DataBodyTemplate
      breadcrumb="Admin / Users"
      title="Users"
    >
      {/* content */}
    </DataBodyTemplate>
  )
}
```

---

## Templates

### DataBodyTemplate

The general-purpose page shell. Provides slots for header, tabs, groups, and toolbar.

```tsx
<DataBodyTemplate
  breadcrumb="Admin / Users"
  title="Users"
  description="Manage your team members."
  actions={<Button>Add User</Button>}
  toolbarLeft={<SearchInput />}
  toolbarRight={<FilterButton />}
>
  {/* children */}
</DataBodyTemplate>
```

#### DataBodyTemplate.Group

Groups content into sections. The `layout` prop controls the visual structure.

| layout | Use case | Default wrapper |
|---|---|---|
| `horizontal` | Label on left, input on right (settings form) | Card |
| `stacked` | Label above, input below | plain |
| `inline` | Table-style rows (detail view, inline form) | bordered |
| `split` | Left list + right detail | bordered |

```tsx
<DataBodyTemplate title="Edit User">
  <DataBodyTemplate.Group layout="horizontal" title="Identity" description="Basic information">
    <DataBodyTemplate.Row label="Name" required>
      <Input defaultValue="Sarah Kim" />
    </DataBodyTemplate.Row>
    <DataBodyTemplate.Row label="Email">
      <Input type="email" defaultValue="sarah@acme.com" />
    </DataBodyTemplate.Row>
  </DataBodyTemplate.Group>
</DataBodyTemplate>
```

#### DataBodyTemplate.Field

Read-only key-value display. Use with `Group layout="inline"` for detail pages.

```tsx
<DataBodyTemplate title="Sarah Kim">
  <DataBodyTemplate.Group layout="inline" title="Identity">
    <DataBodyTemplate.Field label="Email">sarah@acme.com</DataBodyTemplate.Field>
    <DataBodyTemplate.Field label="Role"><Badge>Admin</Badge></DataBodyTemplate.Field>
  </DataBodyTemplate.Group>
</DataBodyTemplate>
```

#### DataBodyTemplate.Tab

Creates a tabbed page layout.

```tsx
<DataBodyTemplate title="Users">
  <DataBodyTemplate.Tab id="list" label="List" count={42}>
    <UserTable />
  </DataBodyTemplate.Tab>
  <DataBodyTemplate.Tab id="settings" label="Settings">
    <SettingsForm />
  </DataBodyTemplate.Tab>
</DataBodyTemplate>
```

#### DataBodyTemplate.Summary

A pinned summary area below the header.

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

Data table page. Use inside `DataBodyTemplate`.

```tsx
import { DataBodyTemplate, DataGridView, type DataGridColumnDef } from '@loykin/designkit'

type User = { id: string; name: string; email: string }

const columns: DataGridColumnDef<User>[] = [
  { id: 'name',  accessorKey: 'name',  header: 'Name'  },
  { id: 'email', accessorKey: 'email', header: 'Email' },
]

export function UsersPage() {
  return (
    <DataBodyTemplate breadcrumb="Admin / Users" title="Users">
      <DataGridView
        data={data}
        columns={columns}
        getRowId={(row) => row.id}
      />
    </DataBodyTemplate>
  )
}
```

| variant | Description |
|---|---|
| `standard` (default) | Standard data table |
| `infinity` | Infinite scroll |
| `drag` | Row drag-to-reorder |
| `card` | Card grid |
| `card-list` | Card list |

---

### SectionedBodyTemplate

Settings-style page with left navigation and right content panel.

```tsx
import { SectionedBodyTemplate } from '@loykin/designkit'

const sections = [
  { id: 'general',  label: 'General'  },
  { id: 'security', label: 'Security' },
  { id: 'billing',  label: 'Billing'  },
]

export function SettingsPage() {
  return (
    <SectionedBodyTemplate
      title="Settings"
      sections={sections}
      defaultSection="general"
    >
      <SectionedBodyTemplate.Panel id="general">
        <GeneralSettings />
      </SectionedBodyTemplate.Panel>
      <SectionedBodyTemplate.Panel id="security">
        <SecuritySettings />
      </SectionedBodyTemplate.Panel>
    </SectionedBodyTemplate>
  )
}
```

---

### FormWizardBodyTemplate

Multi-step input wizard.

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
