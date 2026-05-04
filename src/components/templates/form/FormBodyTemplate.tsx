import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// ─── Public API ───────────────────────────────────────────────────────────────

export interface FormSection {
  key:         string
  title:       string
  description?: string
  danger?:     boolean
  content:     React.ReactNode
}

export interface FormBodyTemplateProps {
  theme?:       React.CSSProperties
  title?:       string
  description?: string
  /** Slot: replaces the save/cancel buttons */
  actions?:     React.ReactNode
  sections?:    FormSection[]
}

// ─── Demo defaults ────────────────────────────────────────────────────────────

const demoSections: FormSection[] = [
  {
    key: 'profile', title: 'Profile', description: 'Your public-facing name and contact info.',
    content: (
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
            className="w-full h-20 rounded-[--radius] border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            defaultValue="Frontend engineer focused on design systems."
          />
        </div>
      </div>
    ),
  },
  {
    key: 'notifications', title: 'Notifications', description: 'Choose when and how you get notified.',
    content: (
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
    ),
  },
  {
    key: 'security', title: 'Security', description: 'Password and authentication settings.',
    content: (
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
        <div className="flex items-center justify-between p-3 rounded-[--radius] border">
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
    ),
  },
  {
    key: 'danger', title: 'Danger Zone', description: 'Irreversible actions. Proceed with caution.', danger: true,
    content: (
      <div className="flex items-center justify-between p-3 rounded-[--radius] border border-destructive/40 bg-destructive/5">
        <div>
          <p className="text-sm font-medium">Delete Account</p>
          <p className="text-xs text-muted-foreground">Permanently delete your account and all data.</p>
        </div>
        <Button variant="destructive" size="sm" className="h-8 text-xs">Delete Account</Button>
      </div>
    ),
  },
]

// ─── Template ─────────────────────────────────────────────────────────────────

export function FormBodyTemplate({
  theme,
  title       = 'Account Settings',
  description = 'Manage your account preferences and security.',
  actions,
  sections    = demoSections,
}: FormBodyTemplateProps) {
  return (
    <div className="layout-form h-full overflow-auto bg-background text-foreground" style={theme}>
      <div className="px-6 py-6">

        <div className="flex items-start justify-between pb-6">
          <div>
            <h1 className="text-sm font-semibold">{title}</h1>
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
          </div>
          {actions ?? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs">Cancel</Button>
              <Button size="sm" className="h-8 text-xs">Save Changes</Button>
            </div>
          )}
        </div>

        {sections.map((section, i) => (
          <div key={section.key}>
            {i > 0 && <Separator />}
            <div className="grid grid-cols-3 gap-8 py-6">
              <div>
                <p className={['text-sm font-medium', section.danger ? 'text-destructive' : ''].join(' ')}>
                  {section.title}
                </p>
                {section.description && (
                  <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                )}
              </div>
              <div className="col-span-2">
                <Card>
                  <CardContent className="p-5">{section.content}</CardContent>
                </Card>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}
