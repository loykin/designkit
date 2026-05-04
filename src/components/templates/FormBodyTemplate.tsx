import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FormSection {
  title: string
  description?: string
  content: React.ReactNode
}

export interface FormBodyTemplateProps {
  title?: string
  description?: string
  actions?: React.ReactNode
  sections?: FormSection[]
  /** 'single' = centered single card | 'split' = left label + right input */
  layout?: 'single' | 'split'
}

// ─── Demo defaults ────────────────────────────────────────────────────────────

const demoSections: FormSection[] = [
  {
    title: 'Personal Information',
    description: 'Update your name and contact details.',
    content: (
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>First Name</Label>
          <Input defaultValue="Sarah" />
        </div>
        <div className="space-y-1.5">
          <Label>Last Name</Label>
          <Input defaultValue="Kim" />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label>Email</Label>
          <Input type="email" defaultValue="sarah@acme.com" />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label>Bio</Label>
          <textarea
            className="w-full h-20 rounded-[--radius] border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            defaultValue="Frontend engineer focused on design systems."
          />
        </div>
      </div>
    ),
  },
  {
    title: 'Notifications',
    description: 'Choose what you want to be notified about.',
    content: (
      <div className="space-y-3">
        {[
          { label: 'New comments',     sub: 'Get notified when someone comments on your post' },
          { label: 'Mentions',         sub: 'Get notified when you are mentioned' },
          { label: 'Weekly digest',    sub: 'Receive a weekly summary of activity' },
          { label: 'Security alerts',  sub: 'Get notified about security events' },
        ].map((item, i) => (
          <div key={item.label} className="flex items-start justify-between gap-4 py-2 border-b last:border-0">
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.sub}</p>
            </div>
            <input type="checkbox" defaultChecked={i < 2} className="mt-0.5 rounded" />
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Danger Zone',
    description: 'Irreversible actions.',
    content: (
      <div className="flex items-center justify-between p-3 rounded-[--radius] border border-destructive/30 bg-destructive/5">
        <div>
          <p className="text-sm font-medium">Delete account</p>
          <p className="text-xs text-muted-foreground">Permanently delete your account and all data.</p>
        </div>
        <Button variant="destructive" size="sm">Delete</Button>
      </div>
    ),
  },
]

// ─── Template ─────────────────────────────────────────────────────────────────

export function FormBodyTemplate({
  title = 'Account Settings',
  description = 'Manage your account preferences.',
  actions,
  sections = demoSections,
  layout = 'split',
}: FormBodyTemplateProps) {
  return (
    <div className="h-full overflow-auto">
      <div className="px-6 py-6 space-y-6">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-semibold">{title}</h1>
            {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
          </div>
          {actions ?? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Cancel</Button>
              <Button size="sm">Save Changes</Button>
            </div>
          )}
        </div>

        <Separator />

        {/* Sections */}
        {sections.map((section, i) => (
          <div key={i}>
            {layout === 'split' ? (
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium">{section.title}</p>
                    {i === 2 && <Badge variant="destructive" className="text-xs">Danger</Badge>}
                  </div>
                  {section.description && (
                    <p className="text-xs text-muted-foreground">{section.description}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <Card>
                    <CardContent className="p-4">{section.content}</CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{section.title}</CardTitle>
                  {section.description && <p className="text-sm text-muted-foreground">{section.description}</p>}
                </CardHeader>
                <CardContent>{section.content}</CardContent>
              </Card>
            )}
            {i < sections.length - 1 && <Separator className="mt-6" />}
          </div>
        ))}
      </div>
    </div>
  )
}
