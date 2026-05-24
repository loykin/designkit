import { DataBodyTemplate } from './DataBodyTemplate'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { TemplateCodeContext } from '../code'

export function DetailBodyTemplateDemo({ theme }: { theme?: React.CSSProperties }) {
  return (
    <DataBodyTemplate
      theme={theme}
      breadcrumb="Users / Sarah Kim"
      title="Sarah Kim"
      description="sarah@acme.com"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs">
            Delete
          </Button>
          <Button size="sm" className="h-8 text-xs">
            Edit
          </Button>
        </div>
      }
    >
      <DataBodyTemplate.Group layout="inline" title="Identity">
        <DataBodyTemplate.Field label="Full name">Sarah Kim</DataBodyTemplate.Field>
        <DataBodyTemplate.Field label="Email">sarah@acme.com</DataBodyTemplate.Field>
        <DataBodyTemplate.Field label="Role">
          <Badge variant="outline" className="text-xs font-normal">
            Admin
          </Badge>
        </DataBodyTemplate.Field>
        <DataBodyTemplate.Field label="Status">
          <Badge className="text-xs capitalize">Active</Badge>
        </DataBodyTemplate.Field>
        <DataBodyTemplate.Field label="Joined">Jan 12, 2024</DataBodyTemplate.Field>
      </DataBodyTemplate.Group>

      <DataBodyTemplate.Group layout="inline" title="Account">
        <DataBodyTemplate.Field label="Plan">Business</DataBodyTemplate.Field>
        <DataBodyTemplate.Field label="Seats used">12 / 20</DataBodyTemplate.Field>
        <DataBodyTemplate.Field label="Billing cycle">Monthly</DataBodyTemplate.Field>
        <DataBodyTemplate.Field label="Next renewal">Jun 1, 2025</DataBodyTemplate.Field>
      </DataBodyTemplate.Group>

      <DataBodyTemplate.Group layout="inline" title="Danger zone" danger>
        <DataBodyTemplate.Field label="Deactivate account">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-destructive hover:text-destructive"
          >
            Deactivate
          </Button>
        </DataBodyTemplate.Field>
      </DataBodyTemplate.Group>
    </DataBodyTemplate>
  )
}

export function buildDetailBodyTemplateCode({ themeProp, layoutClassName }: TemplateCodeContext) {
  return [
    `import { DataBodyTemplate } from '@loykin/designkit'`,
    `import '@loykin/designkit/styles'`,
    '',
    `export function MyPage() {`,
    `  return (`,
    `    <DataBodyTemplate${themeProp}`,
    `      className="${layoutClassName}"`,
    `      breadcrumb="Users / Detail"`,
    `      title="Sarah Kim"`,
    `      actions={<button>Edit</button>}`,
    `    >`,
    `      <DataBodyTemplate.Group layout="inline" title="Identity">`,
    `        <DataBodyTemplate.Field label="Name">Sarah Kim</DataBodyTemplate.Field>`,
    `        <DataBodyTemplate.Field label="Email">sarah@acme.com</DataBodyTemplate.Field>`,
    `      </DataBodyTemplate.Group>`,
    `    </DataBodyTemplate>`,
    `  )`,
    `}`,
  ].join('\n')
}
