import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import type { TemplateCodeContext } from '../code'
import { LoginBodyTemplate, type LoginLayout, type LoginSide, type LoginCard, type LoginBg, type LoginCardWidth } from './LoginBodyTemplate'

export function LoginOtpDemo({
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
          <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to{' '}
            <span className="font-medium text-foreground">sarah@acme.com</span>
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Input
                key={i}
                maxLength={1}
                className="h-11 w-full text-center text-lg font-semibold tabular-nums p-0"
                defaultValue={i < 3 ? ['4', '8', '2'][i] : ''}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Didn't receive it?{' '}
            <a href="#" className="text-foreground hover:underline">
              Resend code
            </a>{' '}
            <span className="text-muted-foreground/60">(59s)</span>
          </p>
        </div>

        <Button type="submit" className="w-full h-9">Verify</Button>

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

export function buildLoginOtpCode({ themeProp }: TemplateCodeContext) {
  return [
    `import { LoginBodyTemplate } from '@loykin/designkit'`,
    `import '@loykin/designkit/styles'`,
    '',
    `export function OtpVerificationPage() {`,
    `  return (`,
    `    <LoginBodyTemplate${themeProp} layout="split">`,
    `      <div className="space-y-6">`,
    `        <h1 className="text-2xl font-semibold">Check your email</h1>`,
    `        {/* otp inputs */}`,
    `        <button type="submit" className="w-full">Verify</button>`,
    `      </div>`,
    `    </LoginBodyTemplate>`,
    `  )`,
    `}`,
  ].join('\n')
}
