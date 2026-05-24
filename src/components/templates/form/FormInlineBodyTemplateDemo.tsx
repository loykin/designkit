import { DataBodyTemplate } from '@/components/templates/databody/DataBodyTemplate'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import type { TemplateCodeContext } from '../code'

export function FormInlineBodyTemplateDemo({ theme }: { theme?: React.CSSProperties }) {
  return (
    <DataBodyTemplate
      theme={theme}
      breadcrumb="Pages / Form / Inline"
      title="Edit User"
      description="Update user profile and access settings."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs">
            Cancel
          </Button>
          <Button size="sm" className="h-8 text-xs">
            Save
          </Button>
        </div>
      }
    >
      <DataBodyTemplate.Group layout="inline" title="Identity">
        <DataBodyTemplate.Row label="Full Name" required>
          <div className="grid grid-cols-2 gap-2">
            <Input defaultValue="Sarah" className="h-8 text-sm" placeholder="First" />
            <Input defaultValue="Kim" className="h-8 text-sm" placeholder="Last" />
          </div>
        </DataBodyTemplate.Row>
        <DataBodyTemplate.Row
          label="Email"
          description="Used for login and notifications."
          required
        >
          <Input type="email" defaultValue="sarah@acme.com" className="h-8 text-sm" />
        </DataBodyTemplate.Row>
        <DataBodyTemplate.Row label="Username">
          <div className="flex items-center gap-2">
            <Input defaultValue="sarah.kim" className="h-8 text-sm" />
            <Badge variant="outline" className="text-[10px] h-6 shrink-0">
              Available
            </Badge>
          </div>
        </DataBodyTemplate.Row>
        <DataBodyTemplate.Row label="Phone">
          <Input type="tel" defaultValue="+82 10-1234-5678" className="h-8 text-sm" />
        </DataBodyTemplate.Row>
      </DataBodyTemplate.Group>

      <DataBodyTemplate.Group layout="inline" title="Role & Access">
        <DataBodyTemplate.Row label="Role" required>
          <Select defaultValue="admin">
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
              <SelectItem value="guest">Guest</SelectItem>
            </SelectContent>
          </Select>
        </DataBodyTemplate.Row>
        <DataBodyTemplate.Row label="Department">
          <Select defaultValue="engineering">
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </DataBodyTemplate.Row>
        <DataBodyTemplate.Row label="Active" description="Inactive users cannot sign in.">
          <Switch defaultChecked />
        </DataBodyTemplate.Row>
        <DataBodyTemplate.Row label="Require 2FA" description="Enforce two-factor authentication.">
          <Switch />
        </DataBodyTemplate.Row>
      </DataBodyTemplate.Group>

      <DataBodyTemplate.Group layout="inline" title="Address">
        <DataBodyTemplate.Row label="Country">
          <Select defaultValue="kr">
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kr">South Korea</SelectItem>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="jp">Japan</SelectItem>
              <SelectItem value="gb">United Kingdom</SelectItem>
            </SelectContent>
          </Select>
        </DataBodyTemplate.Row>
        <DataBodyTemplate.Row label="City">
          <Input defaultValue="Seoul" className="h-8 text-sm" />
        </DataBodyTemplate.Row>
        <DataBodyTemplate.Row label="Postal Code">
          <Input defaultValue="04524" className="h-8 text-sm w-36" />
        </DataBodyTemplate.Row>
      </DataBodyTemplate.Group>
    </DataBodyTemplate>
  )
}

export function buildFormInlineBodyTemplateCode({
  themeProp,
  layoutClassName,
}: TemplateCodeContext) {
  return [
    `import { DataBodyTemplate } from '@loykin/designkit'`,
    `import '@loykin/designkit/styles'`,
    '',
    `export function MyPage() {`,
    `  return (`,
    `    <DataBodyTemplate${themeProp}`,
    `      className="${layoutClassName}"`,
    `      title="Edit User"`,
    `    >`,
    `      <DataBodyTemplate.Group layout="inline" title="Identity">`,
    `        <DataBodyTemplate.Row label="Field">`,
    `          {/* input */}`,
    `        </DataBodyTemplate.Row>`,
    `      </DataBodyTemplate.Group>`,
    `    </DataBodyTemplate>`,
    `  )`,
    `}`,
  ].join('\n')
}
