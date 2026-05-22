import { createContext, useContext } from 'react'
import { cn } from '@/lib/utils'
import { DataPage } from '@/components/templates/datapage/DataPage'
import { Card, CardContent } from '@/components/ui/card'

// ─── Variant ──────────────────────────────────────────────────────────────────

export type FormStackedGroupVariant = 'plain' | 'card'

const FormStackedBodyTemplateCtx = createContext<{ variant: FormStackedGroupVariant }>({ variant: 'plain' })

// ─── Group ────────────────────────────────────────────────────────────────────

export interface FormStackedGroupProps {
  title: string
  description?: string
  danger?: boolean
  variant?: FormStackedGroupVariant
  children?: React.ReactNode
}

function FormStackedGroupWrapper({
  variant,
  children,
}: {
  variant: FormStackedGroupVariant
  children: React.ReactNode
}) {
  if (variant === 'card') {
    return (
      <Card>
        <CardContent className="p-[var(--dk-panel-gap)]">{children}</CardContent>
      </Card>
    )
  }
  return <>{children}</>
}

function FormStackedGroup({ title, description, danger, variant: variantProp, children }: FormStackedGroupProps) {
  const { variant: ctxVariant } = useContext(FormStackedBodyTemplateCtx)
  const variant = variantProp ?? ctxVariant

  return (
    <div className="py-[var(--dk-panel-gap)]">
      <h2 className={cn('text-sm font-semibold', danger && 'text-destructive')}>{title}</h2>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      )}
      <div className="mt-4">
        <FormStackedGroupWrapper variant={variant}>{children}</FormStackedGroupWrapper>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface FormStackedBodyTemplateProps {
  theme?: React.CSSProperties
  title?: string
  description?: React.ReactNode
  breadcrumb?: React.ReactNode
  actions?: React.ReactNode
  variant?: FormStackedGroupVariant
  children?: React.ReactNode
}

function FormStackedBodyTemplateRoot({
  theme,
  title,
  description,
  breadcrumb,
  actions,
  variant = 'plain',
  children,
}: FormStackedBodyTemplateProps) {
  return (
    <FormStackedBodyTemplateCtx.Provider value={{ variant }}>
      <DataPage className="layout-form-stacked" style={theme}>
        <DataPage.Header>
          <DataPage.TitleBlock title={title} description={description} breadcrumb={breadcrumb} />
          <DataPage.Actions>{actions}</DataPage.Actions>
        </DataPage.Header>

        <DataPage.Content>
          <div className="divide-y">{children}</div>
        </DataPage.Content>
      </DataPage>
    </FormStackedBodyTemplateCtx.Provider>
  )
}

export const FormStackedBodyTemplate = Object.assign(FormStackedBodyTemplateRoot, {
  Group: FormStackedGroup,
})
