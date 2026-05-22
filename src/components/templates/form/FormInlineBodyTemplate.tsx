import { createContext, useContext } from 'react'
import { cn } from '@/lib/utils'
import { DataPage } from '@/components/templates/datapage/DataPage'

// ─── Variant ──────────────────────────────────────────────────────────────────

export type FormInlineGroupVariant = 'bordered' | 'plain'

const FormInlineBodyTemplateCtx = createContext<{ variant: FormInlineGroupVariant }>({ variant: 'bordered' })

// ─── Row ──────────────────────────────────────────────────────────────────────

export interface FormInlineRowProps {
  label: string
  description?: string
  required?: boolean
  children?: React.ReactNode
}

function FormInlineRow({ label, description, required, children }: FormInlineRowProps) {
  return (
    <div
      className="grid items-start gap-x-4 px-4 py-3"
      style={{ gridTemplateColumns: 'var(--dk-form-label-w, 11rem) 1fr' }}
    >
      <div className="pt-1">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">{label}</span>
          {required && <span className="text-destructive text-xs leading-none">*</span>}
        </div>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className={cn('min-w-0', !description && 'flex items-center')}>
        {children}
      </div>
    </div>
  )
}

// ─── Group ────────────────────────────────────────────────────────────────────

export interface FormInlineGroupProps {
  title?: string
  description?: string
  variant?: FormInlineGroupVariant
  children?: React.ReactNode
}

function FormInlineGroup({ title, description, variant: variantProp, children }: FormInlineGroupProps) {
  const { variant: ctxVariant } = useContext(FormInlineBodyTemplateCtx)
  const variant = variantProp ?? ctxVariant

  return (
    <div>
      {(title || description) && (
        <div className="mb-2">
          {title && <h2 className="text-sm font-semibold">{title}</h2>}
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className={cn(
        'overflow-hidden rounded-[var(--radius)] divide-y',
        variant === 'bordered' ? 'border' : '',
      )}>
        {children}
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface FormInlineBodyTemplateProps {
  theme?: React.CSSProperties
  title?: string
  description?: React.ReactNode
  breadcrumb?: React.ReactNode
  actions?: React.ReactNode
  variant?: FormInlineGroupVariant
  children?: React.ReactNode
}

function FormInlineBodyTemplateRoot({
  theme,
  title,
  description,
  breadcrumb,
  actions,
  variant = 'bordered',
  children,
}: FormInlineBodyTemplateProps) {
  return (
    <FormInlineBodyTemplateCtx.Provider value={{ variant }}>
      <DataPage className="layout-form-inline" style={theme}>
        <DataPage.Header>
          <DataPage.TitleBlock title={title} description={description} breadcrumb={breadcrumb} />
          <DataPage.Actions>{actions}</DataPage.Actions>
        </DataPage.Header>

        <DataPage.Content>
          <div className="space-y-[calc(var(--dk-panel-gap)*2)]">{children}</div>
        </DataPage.Content>
      </DataPage>
    </FormInlineBodyTemplateCtx.Provider>
  )
}

export const FormInlineBodyTemplate = Object.assign(FormInlineBodyTemplateRoot, {
  Group: FormInlineGroup,
  Row: FormInlineRow,
})
