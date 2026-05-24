import { useState } from 'react'
import { DataBodyTemplate } from './DataBodyTemplate'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { TemplateCodeContext } from '../code'

type User = {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
}

const users: User[] = [
  { id: '1', name: 'Sarah Kim', email: 'sarah@acme.com', role: 'Admin', status: 'active' },
  { id: '2', name: 'Marcus Lee', email: 'marcus@acme.com', role: 'Editor', status: 'active' },
  { id: '3', name: 'Ji-Yeon Park', email: 'jiyeon@acme.com', role: 'Viewer', status: 'inactive' },
  { id: '4', name: 'Alex Chen', email: 'alex@acme.com', role: 'Editor', status: 'pending' },
]

const statusVariant = { active: 'default', pending: 'secondary', inactive: 'outline' } as const

export function SplitBodyTemplateDemo({ theme }: { theme?: React.CSSProperties }) {
  const [active, setActive] = useState(users[0])

  return (
    <DataBodyTemplate
      theme={theme}
      breadcrumb="Users"
      title="Users"
      actions={
        <Button size="sm" className="h-8 text-xs">
          Add User
        </Button>
      }
    >
      <DataBodyTemplate.Group layout="split">
        <div className="space-y-0.5 p-2">
          {users.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => setActive(u)}
              className={[
                'block w-full rounded-lg px-3 py-2 text-left transition-colors',
                u.id === active.id ? 'bg-accent text-accent-foreground' : 'hover:bg-muted',
              ].join(' ')}
            >
              <span className="block truncate text-sm font-medium">{u.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{u.email}</span>
            </button>
          ))}
        </div>
        <div className="space-y-4 p-(--dk-panel-gap)">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">{active.name}</h2>
              <p className="text-sm text-muted-foreground">{active.email}</p>
            </div>
            <Badge variant={statusVariant[active.status]} className="text-xs capitalize">
              {active.status}
            </Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="mt-1 text-sm font-medium">{active.role}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="mt-1 text-sm font-medium capitalize">{active.status}</p>
            </div>
          </div>
        </div>
      </DataBodyTemplate.Group>
    </DataBodyTemplate>
  )
}

export function buildSplitBodyTemplateCode({ themeProp, layoutClassName }: TemplateCodeContext) {
  return [
    `import { DataBodyTemplate } from '@loykin/designkit'`,
    `import '@loykin/designkit/styles'`,
    '',
    `export function MyPage() {`,
    `  return (`,
    `    <DataBodyTemplate${themeProp}`,
    `      className="${layoutClassName}"`,
    `      title="Users"`,
    `    >`,
    `      <DataBodyTemplate.Group layout="split">`,
    `        <aside>{/* list */}</aside>`,
    `        <section>{/* detail */}</section>`,
    `      </DataBodyTemplate.Group>`,
    `    </DataBodyTemplate>`,
    `  )`,
    `}`,
  ].join('\n')
}
