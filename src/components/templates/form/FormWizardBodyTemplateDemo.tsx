import { useState } from 'react'
import {
  FormWizardBodyTemplate,
  type FormWizardStep,
  type FormWizardVariant,
} from '@/components/templates'
import { buildTopBar } from '@/components/templates/datapage/PageTopBar'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import type { TemplateCodeContext } from '../code'

const steps: FormWizardStep[] = [
  {
    key: 'account',
    title: 'Your Details',
    description: 'Create your account credentials.',
    content: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="wiz-first-name" className="text-xs">First Name</Label>
            <Input id="wiz-first-name" defaultValue="Sarah" className="h-8 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wiz-last-name" className="text-xs">Last Name</Label>
            <Input id="wiz-last-name" defaultValue="Kim" className="h-8 text-sm" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wiz-email" className="text-xs">Work Email</Label>
          <Input id="wiz-email" type="email" defaultValue="sarah@acme.com" className="h-8 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wiz-password" className="text-xs">Password</Label>
          <Input id="wiz-password" type="password" placeholder="••••••••" className="h-8 text-sm" />
          <p className="text-xs text-muted-foreground">At least 8 characters.</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wiz-confirm-password" className="text-xs">Confirm Password</Label>
          <Input id="wiz-confirm-password" type="password" placeholder="••••••••" className="h-8 text-sm" />
        </div>
      </div>
    ),
  },
  {
    key: 'role',
    title: 'Your Role',
    description: 'Tell us about yourself so we can tailor your experience.',
    content: (
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="wiz-job-title" className="text-xs">Job Title</Label>
          <Input id="wiz-job-title" defaultValue="Senior Frontend Engineer" className="h-8 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wiz-department" className="text-xs">Department</Label>
          <Select defaultValue="engineering">
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="ops">Operations</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wiz-team-size" className="text-xs">Team Size</Label>
          <Select defaultValue="11-50">
            <SelectTrigger id="wiz-team-size" className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1–10</SelectItem>
              <SelectItem value="11-50">11–50</SelectItem>
              <SelectItem value="51-200">51–200</SelectItem>
              <SelectItem value="200+">200+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    ),
  },
  {
    key: 'preferences',
    title: 'Preferences',
    description: 'Configure your defaults. You can change these anytime.',
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Timezone</Label>
            <Select defaultValue="asia-seoul">
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asia-seoul">Asia / Seoul</SelectItem>
                <SelectItem value="us-eastern">US / Eastern</SelectItem>
                <SelectItem value="us-pacific">US / Pacific</SelectItem>
                <SelectItem value="europe-london">Europe / London</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Date Format</Label>
            <Select defaultValue="ymd">
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-3 pt-1">
          {[
            { label: 'Email notifications', desc: 'Get notified of important activity.', on: true },
            { label: 'Weekly digest', desc: 'A weekly summary email every Monday.', on: false },
            { label: 'Browser push', desc: 'Real-time desktop notifications.', on: true },
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
      </div>
    ),
  },
  {
    key: 'review',
    title: 'Review & Confirm',
    description: 'Check your details before creating the account.',
    content: (
      <div className="space-y-4">
        <div className="rounded-lg border divide-y">
          {[
            { label: 'Name', value: 'Sarah Kim' },
            { label: 'Email', value: 'sarah@acme.com' },
            { label: 'Department', value: 'Engineering' },
            { label: 'Timezone', value: 'Asia / Seoul' },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-xs text-muted-foreground w-28 shrink-0">{row.label}</span>
              <span className="text-sm font-medium flex-1">{row.value}</span>
              <Badge variant="outline" className="text-[10px] h-5">
                Edit
              </Badge>
            </div>
          ))}
        </div>
        <div className="flex items-start gap-2.5 pt-1">
          <Checkbox id="terms" className="mt-0.5" />
          <Label
            htmlFor="terms"
            className="text-xs text-muted-foreground leading-relaxed cursor-pointer"
          >
            I agree to the{' '}
            <span className="text-foreground underline underline-offset-2">Terms of Service</span>{' '}
            and <span className="text-foreground underline underline-offset-2">Privacy Policy</span>
            .
          </Label>
        </div>
      </div>
    ),
  },
]

export function FormWizardBodyTemplateDemo({
  theme,
  variant,
  topBarShow,
  topBarVariant,
  topBarBg,
}: {
  theme?: React.CSSProperties
  variant?: FormWizardVariant
  topBarShow?: string
  topBarVariant?: string
  topBarBg?: string
}) {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <FormWizardBodyTemplate
      theme={theme}
      variant={variant}
      topBar={buildTopBar({ topBarShow, topBarVariant, topBarBg, left: 'Pages / Form / Wizard' })}
      title="Create Account"
      steps={steps}
      activeStep={activeStep}
      onNext={() => setActiveStep((s) => Math.min(s + 1, steps.length - 1))}
      onBack={() => setActiveStep((s) => Math.max(s - 1, 0))}
      onFinish={() => setActiveStep(0)}
    />
  )
}

export function buildFormWizardBodyTemplateCode({ themeProp }: TemplateCodeContext) {
  return [
    `import { useState } from 'react'`,
    `import { FormWizardBodyTemplate, type FormWizardStep } from '@loykin/designkit'`,
    `import '@loykin/designkit/styles'`,
    '',
    `const steps: FormWizardStep[] = [`,
    `  { key: 'info',   title: 'Basic Info',    content: <div>{/* step 1 */}</div> },`,
    `  { key: 'config', title: 'Configuration', content: <div>{/* step 2 */}</div> },`,
    `  { key: 'review', title: 'Review',         content: <div>{/* step 3 */}</div> },`,
    `]`,
    '',
    `export function MyPage() {`,
    `  const [step, setStep] = useState(0)`,
    `  return (`,
    `    <FormWizardBodyTemplate${themeProp}`,
    `      title="Setup Wizard"`,
    `      steps={steps}`,
    `      activeStep={step}`,
    `      onNext={() => setStep((s) => Math.min(s + 1, steps.length - 1))}`,
    `      onBack={() => setStep((s) => Math.max(s - 1, 0))}`,
    `      onFinish={() => { /* handle finish */ }}`,
    `    />`,
    `  )`,
    `}`,
  ].join('\n')
}
