import { memo, useState } from 'react'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import {
  DataBodyTemplate,
  FormActions,
  FormField,
  Input,
  PageTopBar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@loykin/designkit'

interface MemberFormValues {
  name: string
  email: string
  role: string
  active: boolean
}

const IdentitySection = memo(function IdentitySection() {
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
        <FormField label="Name" htmlFor="guide-member-name" error={errors.name?.message}>
          <Input
            id="guide-member-name"
            {...register('name', { required: 'Enter a member name.' })}
            className="h-8 text-sm"
            aria-invalid={Boolean(errors.name)}
          />
        </FormField>
        <FormField
          label="Email"
          htmlFor="guide-member-email"
          error={errors.email?.message}
          helperText="Invitations and account notifications are sent to this address."
        >
          <Input
            id="guide-member-email"
            type="email"
            {...register('email', {
              required: 'Enter an email address.',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' },
            })}
            className="h-8 text-sm"
            aria-invalid={Boolean(errors.email)}
          />
        </FormField>
      </div>
    </DataBodyTemplate.Group>
  )
})

const AccessSection = memo(function AccessSection() {
  const { control } = useFormContext<MemberFormValues>()

  return (
    <DataBodyTemplate.Group
      layout="stacked"
      title="Role & access"
      description="Choose the member's default permissions."
    >
      <div className="space-y-3">
        <FormField label="Role" htmlFor="guide-member-role">
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="guide-member-role" className="h-8 text-sm">
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
        </FormField>
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
})

function MemberForm() {
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
        <IdentitySection />
        <AccessSection />
        <FormActions
          status={
            saved
              ? 'Example saved. Form state remains inside this form boundary.'
              : 'All fields are required unless marked optional.'
          }
          submitLabel="Add member"
        />
      </form>
    </FormProvider>
  )
}

export function FormWorkflowGuide({ theme }: { theme?: React.CSSProperties }) {
  return (
    <DataBodyTemplate
      theme={theme}
      className="layout-guide-form-workflow"
      topBar={<PageTopBar left="Guides / Forms / Add member" />}
      title="Add member"
      description="The canonical stacked form structure for create, edit, and settings pages."
    >
      <MemberForm />
    </DataBodyTemplate>
  )
}
