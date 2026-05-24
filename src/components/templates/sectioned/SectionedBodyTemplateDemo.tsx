import { DataBodyTemplate } from '@/components/templates/databody/DataBodyTemplate'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { TemplateCodeContext } from '../code'

export function SectionedBodyTemplateDemo({ theme }: { theme?: React.CSSProperties }) {
  return (
    <DataBodyTemplate
      theme={theme}
      breadcrumb="Pages / Sectioned"
      title="Workspace Settings"
      description="Section navigation connected to body panels."
      actions={<Button size="sm" className="h-8 text-xs">Save</Button>}
    >
      <DataBodyTemplate.Section id="profile" label="Profile" description="Identity and contact">
        <DataBodyTemplate.Group layout="stacked" title="Profile" description="Public workspace details.">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Workspace Name</Label>
              <Input defaultValue="Acme Corp" className="h-8 text-sm" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Public profile</p>
                <p className="text-xs text-muted-foreground">Allow discovery in organization search.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </DataBodyTemplate.Group>
      </DataBodyTemplate.Section>

      <DataBodyTemplate.Section id="security" label="Security" description="Password and access">
        <DataBodyTemplate.Group layout="stacked" title="Security" description="Password and authentication.">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Require two-factor authentication</p>
            <Switch />
          </div>
        </DataBodyTemplate.Group>
      </DataBodyTemplate.Section>

      <DataBodyTemplate.Section id="billing" label="Billing" description="Plan and invoices">
        <DataBodyTemplate.Group layout="stacked" title="Billing" description="Plan and invoice settings.">
          <Button variant="outline" size="sm" className="h-8 text-xs">Manage Plan</Button>
        </DataBodyTemplate.Group>
      </DataBodyTemplate.Section>
    </DataBodyTemplate>
  )
}

export function buildSectionedBodyTemplateCode({ themeProp, layoutClassName }: TemplateCodeContext) {
  return [
    `import { DataBodyTemplate } from '@loykin/designkit'`,
    `import '@loykin/designkit/styles'`,
    '',
    `export function MyPage() {`,
    `  return (`,
    `    <DataBodyTemplate${themeProp}`,
    `      className="${layoutClassName}"`,
    `      title="Workspace Settings"`,
    `      actions={<button type="button">Save</button>}`,
    `    >`,
    `      <DataBodyTemplate.Section id="profile" label="Profile" description="Identity and contact">`,
    `        <DataBodyTemplate.Group layout="stacked" title="Profile">`,
    `          {/* form fields */}`,
    `        </DataBodyTemplate.Group>`,
    `      </DataBodyTemplate.Section>`,
    ``,
    `      <DataBodyTemplate.Section id="security" label="Security" description="Password and access">`,
    `        <DataBodyTemplate.Group layout="stacked" title="Security">`,
    `          {/* security fields */}`,
    `        </DataBodyTemplate.Group>`,
    `      </DataBodyTemplate.Section>`,
    `    </DataBodyTemplate>`,
    `  )`,
    `}`,
  ].join('\n')
}
