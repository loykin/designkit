import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2 } from 'lucide-react'
import type { TemplateCodeContext } from '../code'
import { LoginBodyTemplate, type LoginLayout, type LoginSide, type LoginCard, type LoginBg, type LoginCardWidth } from './LoginBodyTemplate'

export function LoginResetDemo({
  theme,
  loginLayout,
  loginSide,
  loginCard,
  loginBg,
  loginCardWidth,
}: {
  theme?: React.CSSProperties
  loginLayout?: string
  loginSide?: string
  loginCard?: string
  loginBg?: string
  loginCardWidth?: string
}) {
  return (
    <LoginBodyTemplate
      theme={theme}
      layout={(loginLayout as LoginLayout) ?? 'centered'}
      side={(loginSide as LoginSide) ?? 'left'}
      card={(loginCard as LoginCard) ?? 'card'}
      bg={(loginBg as LoginBg) ?? 'default'}
      cardWidth={(loginCardWidth as LoginCardWidth) ?? 'sm'}
    >
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">Set new password</h1>
          <p className="text-sm text-muted-foreground">
            Must be at least 8 characters.
          </p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="new-password" className="text-xs">New Password</Label>
            <Input id="new-password" type="password" placeholder="••••••••" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm-password" className="text-xs">Confirm Password</Label>
            <Input id="confirm-password" type="password" placeholder="••••••••" className="h-9" />
          </div>
          <div className="space-y-1.5 pt-1">
            {['At least 8 characters', 'One uppercase letter', 'One number'].map((rule) => (
              <div key={rule} className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                {rule}
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full h-9">Update password</Button>
      </form>
    </LoginBodyTemplate>
  )
}

export function buildLoginResetCode({ themeProp }: TemplateCodeContext) {
  return [
    `import { LoginBodyTemplate } from '@loykin/designkit'`,
    `import '@loykin/designkit/styles'`,
    '',
    `export function ResetPasswordPage() {`,
    `  return (`,
    `    <LoginBodyTemplate${themeProp} layout="split">`,
    `      <div className="space-y-6">`,
    `        <h1 className="text-2xl font-semibold">Set new password</h1>`,
    `        {/* password inputs */}`,
    `        <button type="submit" className="w-full">Update password</button>`,
    `      </div>`,
    `    </LoginBodyTemplate>`,
    `  )`,
    `}`,
  ].join('\n')
}
