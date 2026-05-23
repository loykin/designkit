import { DataBodyTemplate } from '@/components/templates/databody/DataBodyTemplate'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { TemplateCodeContext } from '../code'

export function FormBodyTemplateDemo({ theme }: { theme?: React.CSSProperties }) {
  return (
    <DataBodyTemplate
      theme={theme}
      breadcrumb="Pages / Form"
      title="Account Settings"
      description="Manage your account preferences and security."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs">Cancel</Button>
          <Button size="sm" className="h-8 text-xs">Save Changes</Button>
        </div>
      }
    >
      <DataBodyTemplate.Group layout="horizontal" title="Profile" description="Your public-facing name and contact info.">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">First Name</Label>
              <Input defaultValue="Sarah" className="h-8 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Last Name</Label>
              <Input defaultValue="Kim" className="h-8 text-sm" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Email</Label>
            <Input type="email" defaultValue="sarah@acme.com" className="h-8 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Role</Label>
            <Select defaultValue="admin">
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Bio</Label>
            <textarea
              className="w-full h-20 rounded-[var(--radius)] border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              defaultValue="Frontend engineer focused on design systems."
            />
          </div>
        </div>
      </DataBodyTemplate.Group>

      <DataBodyTemplate.Group layout="horizontal" title="Notifications" description="Choose when and how you get notified.">
        <div className="divide-y">
          {[
            { label: 'Comments on your posts', sub: 'When someone replies to a thread', on: true  },
            { label: 'Mentions',               sub: 'When someone @mentions you',        on: true  },
            { label: 'Weekly digest',          sub: 'A weekly summary of activity',      on: false },
            { label: 'Security alerts',        sub: 'Login from new device',             on: true  },
            { label: 'Product updates',        sub: 'New features and improvements',     on: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
              <Switch defaultChecked={item.on} />
            </div>
          ))}
        </div>
      </DataBodyTemplate.Group>

      <DataBodyTemplate.Group layout="horizontal" title="Security" description="Password and authentication settings.">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Current Password</Label>
            <Input type="password" placeholder="••••••••" className="h-8 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">New Password</Label>
              <Input type="password" placeholder="••••••••" className="h-8 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Confirm</Label>
              <Input type="password" placeholder="••••••••" className="h-8 text-sm" />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-[var(--radius)] border">
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Require OTP on every login</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Disabled</Badge>
              <Button size="sm" className="h-8 text-xs">Enable</Button>
            </div>
          </div>
        </div>
      </DataBodyTemplate.Group>

      <DataBodyTemplate.Group layout="horizontal" title="Danger Zone" description="Irreversible actions. Proceed with caution." danger>
        <div className="flex items-center justify-between p-3 rounded-[var(--radius)] border border-destructive/40 bg-destructive/5">
          <div>
            <p className="text-sm font-medium">Delete Account</p>
            <p className="text-xs text-muted-foreground">Permanently delete your account and all data.</p>
          </div>
          <Button variant="destructive" size="sm" className="h-8 text-xs">Delete Account</Button>
        </div>
      </DataBodyTemplate.Group>
    </DataBodyTemplate>
  )
}

export function buildFormBodyTemplateCode({
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
    `      title="Account Settings"`,
    `    >`,
    `      <DataBodyTemplate.Group layout="horizontal" title="Profile">`,
    `        {/* form fields */}`,
    `      </DataBodyTemplate.Group>`,
    `    </DataBodyTemplate>`,
    `  )`,
    `}`,
  ].join('\n')
}
