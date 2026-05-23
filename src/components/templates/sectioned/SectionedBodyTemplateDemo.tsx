import { useState } from 'react'
import { SectionedBodyTemplate, type SectionedBodyTemplateSection } from '@/components/templates'
import { DataBodyTemplate } from '@/components/templates/databody/DataBodyTemplate'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { TemplateCodeContext } from '../code'

const sections: SectionedBodyTemplateSection[] = [
  { id: 'profile', label: 'Profile', description: 'Identity and contact' },
  { id: 'security', label: 'Security', description: 'Password and access' },
  { id: 'billing', label: 'Billing', description: 'Plan and invoices' },
]

export function SectionedBodyTemplateDemo({ theme }: { theme?: React.CSSProperties }) {
  const [active, setActive] = useState('profile')

  return (
    <SectionedBodyTemplate
      theme={theme}
      breadcrumb="Pages / Sectioned"
      title="Workspace Settings"
      description="Section navigation connected to body panels."
      actions={<Button size="sm" className="h-8 text-xs">Save</Button>}
      sections={sections}
      activeSection={active}
      onSectionChange={setActive}
    >
      <SectionedBodyTemplate.Panel id="profile">
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
      </SectionedBodyTemplate.Panel>

      <SectionedBodyTemplate.Panel id="security">
        <DataBodyTemplate.Group layout="stacked" title="Security" description="Password and authentication.">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Require two-factor authentication</p>
            <Switch />
          </div>
        </DataBodyTemplate.Group>
      </SectionedBodyTemplate.Panel>

      <SectionedBodyTemplate.Panel id="billing">
        <DataBodyTemplate.Group layout="stacked" title="Billing" description="Plan and invoice settings.">
          <Button variant="outline" size="sm" className="h-8 text-xs">Manage Plan</Button>
        </DataBodyTemplate.Group>
      </SectionedBodyTemplate.Panel>
    </SectionedBodyTemplate>
  )
}

export function buildSectionedBodyTemplateCode({ themeProp, layoutClassName }: TemplateCodeContext) {
  return [
    `import { useState } from 'react'`,
    `import { DataBodyTemplate, SectionedBodyTemplate, type SectionedBodyTemplateSection } from '@loykin/designkit'`,
    `import '@loykin/designkit/styles'`,
    '',
    `const sections: SectionedBodyTemplateSection[] = [`,
    `  { id: 'profile', label: 'Profile' },`,
    `  { id: 'security', label: 'Security' },`,
    `]`,
    '',
    `export function MyPage() {`,
    `  const [active, setActive] = useState('profile')`,
    `  return (`,
    `    <SectionedBodyTemplate${themeProp}`,
    `      className="${layoutClassName}"`,
    `      title="Workspace Settings"`,
    `      actions={<button type="button">Save</button>}`,
    `      sections={sections}`,
    `      activeSection={active}`,
    `      onSectionChange={setActive}`,
    `    >`,
    `      <SectionedBodyTemplate.Panel id="profile">`,
    `        <DataBodyTemplate.Group layout="stacked" title="Profile">`,
    `          {/* form fields */}`,
    `        </DataBodyTemplate.Group>`,
    `      </SectionedBodyTemplate.Panel>`,
    ``,
    `      <SectionedBodyTemplate.Panel id="security">`,
    `        <DataBodyTemplate.Group layout="stacked" title="Security">`,
    `          {/* security fields */}`,
    `        </DataBodyTemplate.Group>`,
    `      </SectionedBodyTemplate.Panel>`,
    `    </SectionedBodyTemplate>`,
    `  )`,
    `}`,
  ].join('\n')
}
