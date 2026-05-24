import { DataBodyTemplate } from '@/components/templates/databody/DataBodyTemplate'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { TemplateCodeContext } from '../code'

export function FormStackedBodyTemplateDemo({ theme }: { theme?: React.CSSProperties }) {
  return (
    <DataBodyTemplate
      theme={theme}
      breadcrumb="Pages / Form / Stacked"
      title="Settings"
      description="Manage your account and preferences."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs">
            Reset
          </Button>
          <Button size="sm" className="h-8 text-xs">
            Save Changes
          </Button>
        </div>
      }
    >
      <DataBodyTemplate.Group
        layout="stacked"
        title="Profile"
        description="How you appear to others on the platform."
      >
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Display Name</Label>
            <Input defaultValue="Sarah Kim" className="h-8 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Email</Label>
            <Input type="email" defaultValue="sarah@acme.com" className="h-8 text-sm" disabled />
            <p className="text-xs text-muted-foreground">
              Contact support to change your email address.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Bio</Label>
            <textarea
              className="w-full h-20 resize-none rounded-[var(--radius)] border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              defaultValue="Frontend engineer focused on design systems."
            />
          </div>
        </div>
      </DataBodyTemplate.Group>

      <DataBodyTemplate.Group
        layout="stacked"
        title="Appearance"
        description="Customize how the interface looks for you."
      >
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Theme</Label>
            <Select defaultValue="system">
              <SelectTrigger className="h-8 text-sm w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Language</Label>
            <Select defaultValue="en">
              <SelectTrigger className="h-8 text-sm w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ko">한국어</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Compact mode</p>
              <p className="text-xs text-muted-foreground">Reduce spacing across the interface.</p>
            </div>
            <Switch />
          </div>
        </div>
      </DataBodyTemplate.Group>

      <DataBodyTemplate.Group
        layout="stacked"
        title="Privacy & Data"
        description="Manage how your data is collected and used."
      >
        <div className="space-y-4">
          {[
            {
              label: 'Usage analytics',
              desc: 'Share anonymous usage data to improve the product.',
              on: true,
            },
            {
              label: 'Crash reports',
              desc: 'Automatically send crash logs to our team.',
              on: true,
            },
            {
              label: 'Marketing emails',
              desc: 'Receive updates on new features and promotions.',
              on: false,
            },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch defaultChecked={item.on} />
            </div>
          ))}
        </div>
      </DataBodyTemplate.Group>

      <DataBodyTemplate.Group
        layout="stacked"
        title="Danger Zone"
        description="Irreversible actions. Proceed with caution."
        danger
      >
        <div className="flex items-center justify-between rounded-[var(--radius)] border border-destructive/40 bg-destructive/5 px-4 py-3">
          <div>
            <p className="text-sm font-medium">Delete Account</p>
            <p className="text-xs text-muted-foreground">Permanently remove all your data.</p>
          </div>
          <Button variant="destructive" size="sm" className="ml-4 h-8 shrink-0 text-xs">
            Delete
          </Button>
        </div>
      </DataBodyTemplate.Group>
    </DataBodyTemplate>
  )
}

export function buildFormStackedBodyTemplateCode({
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
    `      title="Settings"`,
    `    >`,
    `      <DataBodyTemplate.Group layout="stacked" title="Profile">`,
    `        {/* form fields */}`,
    `      </DataBodyTemplate.Group>`,
    `    </DataBodyTemplate>`,
    `  )`,
    `}`,
  ].join('\n')
}
