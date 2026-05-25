import { Button, Input, Label } from '@loykin/designkit'
import { ArrowLeft } from 'lucide-react'
import type { TemplateCodeContext } from '../../code'
import { LoginBodyTemplate, type LoginLayout, type LoginSide, type LoginCard, type LoginBg, type LoginCardWidth } from '@loykin/designkit'

export function LoginForgotDemo({
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
          <h1 className="text-2xl font-semibold tracking-tight">Forgot password?</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" className="h-9" />
          </div>
        </div>

        <Button type="submit" className="w-full h-9">Send reset link</Button>

        <a
          href="#"
          className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </a>
      </form>
    </LoginBodyTemplate>
  )
}

export function buildLoginForgotCode({ themeProp }: TemplateCodeContext) {
  return [
    `import { LoginBodyTemplate } from '@loykin/designkit'`,
    `import '@loykin/designkit/styles'`,
    '',
    `export function ForgotPasswordPage() {`,
    `  return (`,
    `    <LoginBodyTemplate${themeProp} layout="split">`,
    `      <div className="space-y-6">`,
    `        <div className="space-y-1.5">`,
    `          <h1 className="text-2xl font-semibold">Forgot password?</h1>`,
    `          <p className="text-sm text-muted-foreground">We'll send you a reset link.</p>`,
    `        </div>`,
    `        {/* email input */}`,
    `        <button type="submit" className="w-full">Send reset link</button>`,
    `      </div>`,
    `    </LoginBodyTemplate>`,
    `  )`,
    `}`,
  ].join('\n')
}
