# Stacked Form Workflow Contract for AI

Use this contract for create, edit, and settings forms. It standardizes the visual structure and component boundaries. It does not prescribe a form-state, validation, routing, or data-fetching library.

## Canonical reference

- Pattern ID: `form-workflow`
- Playground: **Guides / Forms / Stacked Form**
- Page template: `DataBodyTemplate`
- Section primitive: `DataBodyTemplate.Group layout="stacked"`

The existing **DataBodyTemplate / Form / Horizontal**, **Stacked**, and **Inline** entries are visual API references. When generating a product form, follow this guide instead of selecting among those demos.

Read [AI UI Implementation Contract](./ai-ui-implementation-contract.md) first.

The executable Playground example uses React Hook Form to demonstrate shared state across modular section components, controlled DesignKit inputs, and field-level errors. React Hook Form is a Playground implementation choice, not a DesignKit dependency or part of this visual contract.

## Non-negotiable visual contract

1. Render the form as a full route page by default. Do not use a Sheet for ordinary create, edit, or settings work.
2. Keep the route hierarchy in `PageTopBar`: for example, `Resources / Members / Add member`.
3. Use one `DataBodyTemplate` page root.
4. Use the stacked form shape for create, edit, and settings pages. Do not switch to `horizontal` or `inline` because the domain changed.
5. Divide the form into one or more `DataBodyTemplate.Group layout="stacked"` sections according to meaning, not visual preference.
6. Wrap each field in `FormField` (label, control, and `error`/`helperText`) instead of hand-rolling a `space-y-1.5` + `Label` block; keep the fields inside a group at `space-y-3`.
7. Use DesignKit controls and the established compact control sizing: `h-8 text-sm` for inputs and selects.
8. End the form in `FormActions` (`status`, `submitLabel`, `onCancel`) instead of hand-rolling the bottom action row — it already puts Cancel before the right-aligned primary submit action and renders the divider above it. Do not add a second divider around it.
9. Pass validation text to `FormField`'s `error` prop; pass form-level failure to `FormActions`' `status` prop, inside the same form boundary.
10. A submitting, refreshing, or validation state must not replace or flash the page header or unrelated groups.

## Module boundary contract

Treat each semantic group like tab-scoped content: implement it as a named component instead of one large page function.

- The route component owns only `DataBodyTemplate`, breadcrumb, title, and route-level description.
- A form component owns the submit boundary and bottom actions.
- Each section component returns one stacked `DataBodyTemplate.Group`.
- Section-only state and asynchronous work stay in that section component when possible.
- Shared form state may be provided by the form component through props, context, React Hook Form, or another application-selected mechanism.
- Do not lift section-only pending, error, or refresh state into the page header.
- Do not nest another page-level template inside the form or a Group.

Separating components is a behavior boundary, not permission to change their layout. Every section still uses the same stacked Group contract.

## Save boundaries

The visual system remains the same; only form ownership changes.

| Workflow                                     | Form ownership                           | Actions                                                         |
| -------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------- |
| Create or edit one record                    | One form owns all stacked sections       | One bottom action row after the final section                   |
| Settings saved as one document               | One form owns all stacked sections       | One bottom action row after the final section                   |
| Settings with independently saved categories | Each section component owns its own form | Each stacked section ends with its own right-aligned action row |

Do not create separate forms merely because the screen contains multiple Groups. Split forms only when the server-side save boundaries are genuinely independent.

## Canonical composition

The following is the concrete React Hook Form composition used by the Playground. Applications may replace React Hook Form, but must preserve the same component and visual boundaries.

```tsx
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'

interface MemberFormValues {
  name: string
  email: string
  role: string
  active: boolean
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
      description="Basic account information."
    >
      <div className="space-y-3">
        <FormField label="Name" htmlFor="member-name" error={errors.name?.message}>
          <Input
            id="member-name"
            {...register('name', { required: 'Enter a member name.' })}
            aria-invalid={Boolean(errors.name)}
            className="h-8 text-sm"
          />
        </FormField>
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
      description="Default workspace permissions."
    >
      <div className="space-y-3">
        <FormField label="Role" htmlFor="member-role">
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="member-role" className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>{/* roles */}</SelectContent>
              </Select>
            )}
          />
        </FormField>
        <Controller
          control={control}
          name="active"
          render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
        />
      </div>
    </DataBodyTemplate.Group>
  )
}

function MemberForm() {
  const form = useForm<MemberFormValues>({
    defaultValues: {
      name: '',
      email: '',
      role: 'viewer',
      active: true,
    },
  })

  const submitMember = (values: MemberFormValues) => {
    // Application-owned mutation or submit behavior.
  }

  return (
    <FormProvider {...form}>
      <form className="contents" onSubmit={form.handleSubmit(submitMember)}>
        <IdentitySection />
        <AccessSection />
        <FormActions submitLabel="Save" />
      </form>
    </FormProvider>
  )
}

export function MemberCreatePage() {
  return (
    <DataBodyTemplate
      topBar={<PageTopBar left="Resources / Members / Add member" />}
      title="Add member"
      description="Create a workspace member."
    >
      <MemberForm />
    </DataBodyTemplate>
  )
}
```

React Hook Form is used here to prove that independently implemented Group components can share one form boundary. It remains a Playground-only dependency. Replacing it with ordinary React state, Formik, or another form tool must not change the rendered structure.

## Settings with independent saves

When settings categories save independently, retain the same stacked appearance and move each form boundary into its section component.

```tsx
function ProfileSettingsSection() {
  return (
    <DataBodyTemplate.Group layout="stacked" title="Profile">
      <form className="space-y-3" onSubmit={saveProfile}>
        {/* profile fields */}
        <div className="flex justify-end">
          <Button type="submit" size="sm" className="h-8 text-xs">
            Save profile
          </Button>
        </div>
      </form>
    </DataBodyTemplate.Group>
  )
}
```

## Review checklist

- Create, edit, and settings screens all use the stacked shape.
- The page is a route rather than a Sheet unless the task explicitly requires a constrained secondary edit.
- Breadcrumb, title, Groups, fields, and actions follow the same vertical order.
- Groups are named components and unrelated section state is not owned by the route header.
- Group count follows the information model; it does not select a different layout.
- Form and validation libraries remain application choices.
- Bottom actions belong to the form that they submit.
- Fields use `FormField`, not a hand-rolled `space-y-1.5` + `Label` block.
- The bottom action row uses `FormActions`, not a hand-rolled Cancel/submit `div`.
