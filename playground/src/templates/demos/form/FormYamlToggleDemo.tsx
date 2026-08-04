import { useEffect, useState, type CSSProperties } from 'react'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import {
  Button,
  DataBodyTemplate,
  Input,
  Label,
  PageTopBar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@loykin/designkit'

interface MemberFormValues {
  name: string
  email: string
  role: string
  active: boolean
}

function toYaml(values: MemberFormValues) {
  return [
    `name: ${values.name}`,
    `email: ${values.email}`,
    `role: ${values.role}`,
    `active: ${values.active}`,
  ].join('\n')
}

function fromYaml(text: string): Partial<MemberFormValues> {
  const parsed: Partial<MemberFormValues> = {}
  for (const line of text.split('\n')) {
    const match = /^(name|email|role|active):\s*(.*)$/.exec(line.trim())
    if (!match) continue
    const [, key, rawValue] = match
    if (key === 'active') parsed.active = rawValue.trim() === 'true'
    else parsed[key as 'name' | 'email' | 'role'] = rawValue.trim()
  }
  return parsed
}

function IdentitySection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<MemberFormValues>()

  return (
    <DataBodyTemplate.Group
      layout="stacked"
      title="Identity"
      description="Basic information used throughout the workspace."
    >
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="yaml-member-name" className="text-xs">
            Name
          </Label>
          <Input
            id="yaml-member-name"
            {...register('name', { required: 'Enter a member name.' })}
            className="h-8 text-sm"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="yaml-member-email" className="text-xs">
            Email
          </Label>
          <Input
            id="yaml-member-email"
            type="email"
            {...register('email', { required: 'Enter an email address.' })}
            className="h-8 text-sm"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>
    </DataBodyTemplate.Group>
  )
}

function AccessSection() {
  const { control } = useFormContext<MemberFormValues>()

  return (
    <DataBodyTemplate.Group
      layout="stacked"
      title="Role & access"
      description="Choose the member's default permissions."
    >
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="yaml-member-role" className="text-xs">
            Role
          </Label>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="yaml-member-role" className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex items-center justify-between gap-4 py-1">
          <div>
            <p className="text-sm font-medium">Active account</p>
            <p className="text-xs text-muted-foreground">
              Inactive members cannot sign in to the workspace.
            </p>
          </div>
          <Controller
            control={control}
            name="active"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>
      </div>
    </DataBodyTemplate.Group>
  )
}

function YamlSection({ onApplied }: { onApplied: () => void }) {
  const { watch, setValue } = useFormContext<MemberFormValues>()
  const values = watch()
  const [draft, setDraft] = useState(() => toYaml(values))
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (!dirty) setDraft(toYaml(values))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.name, values.email, values.role, values.active, dirty])

  return (
    <DataBodyTemplate.Group
      layout="stacked"
      title="YAML"
      description="Raw source for the same record shown in the Form tab."
    >
      <textarea
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value)
          setDirty(true)
        }}
        spellCheck={false}
        className="h-40 w-full resize-none rounded-(--radius) border border-border bg-muted/25 p-3 font-mono text-xs leading-5 outline-none"
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground" role="status">
          {dirty ? 'Unapplied YAML changes.' : 'In sync with the Form tab.'}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          disabled={!dirty}
          onClick={() => {
            const parsed = fromYaml(draft)
            for (const [key, value] of Object.entries(parsed)) {
              setValue(key as keyof MemberFormValues, value as never, { shouldDirty: true })
            }
            setDirty(false)
            onApplied()
          }}
        >
          Apply to form
        </Button>
      </div>
    </DataBodyTemplate.Group>
  )
}

function MemberForm() {
  const [view, setView] = useState<'form' | 'yaml'>('form')
  const [saved, setSaved] = useState(false)
  const form = useForm<MemberFormValues>({
    defaultValues: {
      name: 'Sarah Kim',
      email: 'sarah@acme.com',
      role: 'editor',
      active: true,
    },
  })

  return (
    <FormProvider {...form}>
      <form className="contents" onSubmit={form.handleSubmit(() => setSaved(true))}>
        <Tabs value={view} onValueChange={(next) => setView(next as 'form' | 'yaml')}>
          <TabsList variant="line">
            <TabsTrigger value="form">Form</TabsTrigger>
            <TabsTrigger value="yaml">YAML</TabsTrigger>
          </TabsList>
          <TabsContent value="form" className="contents">
            <IdentitySection />
            <AccessSection />
          </TabsContent>
          <TabsContent value="yaml" className="contents">
            <YamlSection onApplied={() => setView('form')} />
          </TabsContent>
        </Tabs>
        <div className="flex items-center justify-between border-t border-border pt-(--designkit-panel-gap)">
          <p className="text-xs text-muted-foreground" role="status">
            {saved ? 'Example saved.' : 'Form and YAML edit the same record state.'}
          </p>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" className="h-8 text-xs">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-8 text-xs">
              Save
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export function FormYamlToggleDemo({ theme }: { theme?: CSSProperties }) {
  return (
    <DataBodyTemplate
      theme={theme}
      className="layout-form-yaml-toggle"
      topBar={<PageTopBar left="Prototype / Members / Add member" />}
      title="Add member"
      description="Prototype: switching between the stacked form and its raw YAML source."
    >
      <MemberForm />
    </DataBodyTemplate>
  )
}
