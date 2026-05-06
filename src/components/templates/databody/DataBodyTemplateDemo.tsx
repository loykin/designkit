import { DataBodyTemplate } from './DataBodyTemplate'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search } from 'lucide-react'

export interface DataBodyTemplateDemoProps {
  theme?: React.CSSProperties
}

const users = [
  { name: 'Sarah Kim', role: 'Admin', status: 'Active' },
  { name: 'Marcus Lee', role: 'Editor', status: 'Active' },
  { name: 'Ji-Yeon Park', role: 'Viewer', status: 'Inactive' },
]

function ToolbarSearch() {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input placeholder="Search..." className="h-8 w-56 pl-8 text-xs" />
    </div>
  )
}

function UserTable() {
  return (
    <Card className="rounded-lg border border-border ring-0">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.name}>
                <TableCell className="text-sm font-medium">{user.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.role}</TableCell>
                <TableCell>
                  <Badge variant={user.status === 'Active' ? 'default' : 'outline'} className="text-xs">
                    {user.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function UserCards() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {users.map((user) => (
        <Card key={user.name} className="rounded-lg border border-border ring-0">
          <CardHeader>
            <CardTitle>{user.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{user.role}</span>
            <Badge variant={user.status === 'Active' ? 'default' : 'outline'} className="text-xs">
              {user.status}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function CustomContent() {
  return (
    <Card className="rounded-lg border border-border ring-0">
      <CardContent className="grid gap-3 p-4 md:grid-cols-3">
        {['Header', 'Tabs', 'Content'].map((label) => (
          <div key={label} className="rounded-lg border bg-muted/30 p-3">
            <p className="text-sm font-medium">{label}</p>
            <p className="mt-1 text-xs text-muted-foreground">ReactNode slot</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function DataBodyTemplateDemo({ theme }: DataBodyTemplateDemoProps) {
  return (
    <DataBodyTemplate
      className="layout-databody"
      theme={theme}
      breadcrumb="Design / Body Template"
      title="Body Template"
      description="Compound body shell with optional tabs and arbitrary content"
      toolbarLeft={<ToolbarSearch />}
      toolbarRight={
        <Button size="sm" className="h-8 gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          Add Item
        </Button>
      }
    >
      <DataBodyTemplate.Tab id="table" label="Table" count={users.length}>
        <UserTable />
      </DataBodyTemplate.Tab>
      <DataBodyTemplate.Tab id="cards" label="Cards" count={users.length}>
        <UserCards />
      </DataBodyTemplate.Tab>
      <DataBodyTemplate.Tab id="custom" label="Custom">
        <CustomContent />
      </DataBodyTemplate.Tab>
    </DataBodyTemplate>
  )
}
