import { DataBodyTemplate } from '@/components/templates/databody/DataBodyTemplate'
import { buildTopBar } from '@/components/templates/datapage/PageTopBar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { TemplateCodeContext } from '../code'

export function FormBodyTemplateDemo({ theme, topBarShow, topBarVariant, topBarBg }: { theme?: React.CSSProperties; topBarShow?: string; topBarVariant?: string; topBarBg?: string }) {
  return (
    <DataBodyTemplate
      theme={theme}
      topBar={buildTopBar({ topBarShow, topBarVariant, topBarBg, left: 'Pages / Form' })}
      title="Account Settings"
      description="Manage your account preferences and security."
    >
      <DataBodyTemplate.Group
        layout="horizontal"
        title="Profile"
        description="Your public-facing name and contact info."
      >
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="first-name" className="text-xs">First Name</Label>
              <Input id="first-name" defaultValue="Sarah" className="h-8 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="last-name" className="text-xs">Last Name</Label>
              <Input id="last-name" defaultValue="Kim" className="h-8 text-sm" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="profile-email" className="text-xs">Email</Label>
            <Input id="profile-email" type="email" defaultValue="sarah@acme.com" className="h-8 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="profile-role" className="text-xs">Role</Label>
            <Select defaultValue="admin">
              <SelectTrigger id="profile-role" className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="profile-bio" className="text-xs">Bio</Label>
            <textarea
              id="profile-bio"
              className="w-full h-20 rounded-(--radius) border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              defaultValue="Frontend engineer focused on design systems."
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="sm" className="h-8 text-xs">Save Profile</Button>
          </div>
        </form>
      </DataBodyTemplate.Group>

      <DataBodyTemplate.Group
        layout="horizontal"
        title="Notifications"
        description="Choose when and how you get notified."
      >
        <div className="divide-y">
          {[
            { label: 'Comments on your posts', sub: 'When someone replies to a thread', on: true },
            { label: 'Mentions', sub: 'When someone @mentions you', on: true },
            { label: 'Weekly digest', sub: 'A weekly summary of activity', on: false },
            { label: 'Security alerts', sub: 'Login from new device', on: true },
            { label: 'Product updates', sub: 'New features and improvements', on: false },
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

      <DataBodyTemplate.Group
        layout="horizontal"
        title="Security"
        description="Password and authentication settings."
      >
        <div className="space-y-4">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="current-password" className="text-xs">Current Password</Label>
              <Input id="current-password" type="password" placeholder="••••••••" className="h-8 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-password" className="text-xs">New Password</Label>
                <Input id="new-password" type="password" placeholder="••••••••" className="h-8 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password" className="text-xs">Confirm</Label>
                <Input id="confirm-password" type="password" placeholder="••••••••" className="h-8 text-sm" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="sm" className="h-8 text-xs">Update Password</Button>
            </div>
          </form>
          <div className="flex items-center justify-between p-3 rounded-(--radius) border">
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Require OTP on every login</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Disabled</Badge>
              <Button type="button" size="sm" className="h-8 text-xs">Enable</Button>
            </div>
          </div>
        </div>
      </DataBodyTemplate.Group>

      <DataBodyTemplate.Group
        layout="horizontal"
        title="Danger Zone"
        description="Irreversible actions. Proceed with caution."
        danger
      >
        <div className="flex items-center justify-between p-3 rounded-(--radius) border border-destructive/40 bg-destructive/5">
          <div>
            <p className="text-sm font-medium">Delete Account</p>
            <p className="text-xs text-muted-foreground">
              Permanently delete your account and all data.
            </p>
          </div>
          <Button type="button" variant="destructive" size="sm" className="h-8 text-xs">
            Delete Account
          </Button>
        </div>
      </DataBodyTemplate.Group>
    </DataBodyTemplate>
  )
}

export function buildFormBodyTemplateCode({ themeProp, layoutClassName }: TemplateCodeContext) {
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
    `        <form onSubmit={handleSubmit}>`,
    `          {/* form fields */}`,
    `          <button type="submit">Save Profile</button>`,
    `        </form>`,
    `      </DataBodyTemplate.Group>`,
    `    </DataBodyTemplate>`,
    `  )`,
    `}`,
  ].join('\n')
}
