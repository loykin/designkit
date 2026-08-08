import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface FormFieldProps {
  label: React.ReactNode
  htmlFor: string
  /** Validation failure for this field. Takes precedence over `helperText`. */
  error?: React.ReactNode
  /** Non-error supporting text shown when there is no `error`. */
  helperText?: React.ReactNode
  className?: string
  children: React.ReactNode
}

/**
 * The label + control + helper/error wrapper every stacked form field uses
 * (see the form-workflow guide contract). Compose the control itself
 * (`Input`, `Select`, …) as `children`; this owns only the surrounding shape.
 */
export function FormField({ label, htmlFor, error, helperText, className, children }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={htmlFor} className="text-xs">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  )
}

export interface FormActionsProps {
  /** Optional status or form-level message, left-aligned before the buttons. */
  status?: React.ReactNode
  cancelLabel?: React.ReactNode
  onCancel?: () => void
  cancelDisabled?: boolean
  submitLabel: React.ReactNode
  submitDisabled?: boolean
  className?: string
}

/**
 * The bottom action row every stacked form ends with: an optional status
 * message, then Cancel before the right-aligned primary submit action, per
 * the form-workflow guide contract. Always renders the divider above the
 * actions — do not add a second one around this component.
 */
export function FormActions({
  status,
  cancelLabel = 'Cancel',
  onCancel,
  cancelDisabled,
  submitLabel,
  submitDisabled,
  className,
}: FormActionsProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 border-t border-border pt-(--designkit-panel-gap)',
        status ? 'justify-between' : 'justify-end',
        className,
      )}
    >
      {status && (
        <p className="text-xs text-muted-foreground" role="status">
          {status}
        </p>
      )}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={onCancel}
          disabled={cancelDisabled}
        >
          {cancelLabel}
        </Button>
        <Button type="submit" size="sm" className="h-8 text-xs" disabled={submitDisabled}>
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
