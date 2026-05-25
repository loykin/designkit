import { Button, Checkbox, Input, Label } from '@loykin/designkit'
import type { TemplateCodeContext } from '../../code'
import { LoginBodyTemplate, type LoginLayout, type LoginSide, type LoginCard, type LoginBg, type LoginCardWidth } from '@loykin/designkit'

export function LoginBodyTemplateDemo({
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
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground">Enter your email and password to continue.</p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs">Password</Label>
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Forgot password?
              </a>
            </div>
            <Input id="password" type="password" placeholder="••••••••" className="h-9" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-xs font-normal text-muted-foreground cursor-pointer">
              Remember me for 30 days
            </Label>
          </div>
        </div>

        <Button type="submit" className="w-full h-9">Sign in</Button>

        <p className="text-center text-xs text-muted-foreground">
          Don't have an account?{' '}
          <a href="#" className="text-foreground hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </LoginBodyTemplate>
  )
}

export function buildLoginBodyTemplateCode({ themeProp }: TemplateCodeContext) {
  return [
    `import { LoginBodyTemplate } from '@loykin/designkit'`,
    `import '@loykin/designkit/styles'`,
    '',
    `export function LoginPage() {`,
    `  return (`,
    `    <LoginBodyTemplate${themeProp} layout="split">`,
    `      <div className="space-y-6">`,
    `        <div className="space-y-1.5">`,
    `          <h1 className="text-2xl font-semibold">Sign in</h1>`,
    `          <p className="text-sm text-muted-foreground">Enter your credentials.</p>`,
    `        </div>`,
    `        {/* form fields */}`,
    `        <button type="submit" className="w-full">Sign in</button>`,
    `      </div>`,
    `    </LoginBodyTemplate>`,
    `  )`,
    `}`,
  ].join('\n')
}
