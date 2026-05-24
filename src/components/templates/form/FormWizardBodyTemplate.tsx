import { Fragment } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DataPage } from '@/components/templates/datapage/DataPage'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export type FormWizardVariant = 'card' | 'plain'

export interface FormWizardStep {
  key: string
  title: string
  description?: string
  content: React.ReactNode
}

export interface FormWizardBodyTemplateProps {
  theme?: React.CSSProperties
  title?: string
  breadcrumb?: React.ReactNode
  variant?: FormWizardVariant
  steps: FormWizardStep[]
  activeStep: number
  onNext?: () => void
  onBack?: () => void
  onFinish?: () => void
}

export function FormWizardBodyTemplate({
  theme,
  title,
  breadcrumb,
  variant = 'plain',
  steps,
  activeStep,
  onNext,
  onBack,
  onFinish,
}: FormWizardBodyTemplateProps) {
  const current = steps[activeStep]
  const isLast = activeStep === steps.length - 1

  return (
    <DataPage className="layout-form-wizard" style={theme}>
      <DataPage.Header>
        <DataPage.TitleBlock title={title} breadcrumb={breadcrumb} />
      </DataPage.Header>

      {/* Step indicator */}
      <div className="shrink-0 px-[var(--dk-page-padding-x)] pb-4">
        <div className="flex items-center">
          {steps.map((step, i) => (
            <Fragment key={step.key}>
              {i > 0 && (
                <div
                  className={cn(
                    'mx-3 h-px flex-1',
                    i <= activeStep ? 'bg-primary/50' : 'bg-border',
                  )}
                />
              )}
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors',
                    i < activeStep
                      ? 'bg-primary text-primary-foreground'
                      : i === activeStep
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-1'
                        : 'bg-muted text-muted-foreground',
                  )}
                >
                  {i < activeStep ? <Check className="h-3 w-3" /> : i + 1}
                </div>
                <span
                  className={cn(
                    'hidden text-xs font-medium sm:block',
                    i === activeStep ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {step.title}
                </span>
              </div>
            </Fragment>
          ))}
        </div>
      </div>

      <DataPage.Content>
        {current &&
          (variant === 'card' ? (
            <Card>
              <CardContent className="p-[var(--dk-panel-gap)]">
                <div className="mb-5">
                  <h2 className="text-sm font-semibold">{current.title}</h2>
                  {current.description && (
                    <p className="mt-1 text-xs text-muted-foreground">{current.description}</p>
                  )}
                </div>
                {current.content}
              </CardContent>
            </Card>
          ) : (
            <div>
              <div className="mb-5">
                <h2 className="text-sm font-semibold">{current.title}</h2>
                {current.description && (
                  <p className="mt-1 text-xs text-muted-foreground">{current.description}</p>
                )}
              </div>
              {current.content}
            </div>
          ))}
      </DataPage.Content>

      <DataPage.Footer>
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={onBack}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Step {activeStep + 1} of {steps.length}
            </span>
            {isLast ? (
              <Button size="sm" className="h-8 text-xs" onClick={onFinish}>
                Finish
              </Button>
            ) : (
              <Button size="sm" className="h-8 text-xs" onClick={onNext}>
                Continue
              </Button>
            )}
          </div>
        </div>
      </DataPage.Footer>
    </DataPage>
  )
}
