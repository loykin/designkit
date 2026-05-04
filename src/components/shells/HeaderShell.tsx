import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Bell, Settings } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeaderShellProps {
  /** Header slot: override entire header contents */
  header?: React.ReactNode
  children: React.ReactNode
}

// ─── Demo header ──────────────────────────────────────────────────────────────

const demoNav = ['Overview', 'Users', 'Products', 'Reports', 'Settings']

function DemoHeaderContent() {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 mr-6">
        <div className="h-7 w-7 rounded-[--radius] bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
          A
        </div>
        <span className="text-sm font-semibold">Acme Corp</span>
      </div>

      {/* Nav links */}
      <nav className="flex items-center gap-1">
        {demoNav.map((item) => (
          <button
            key={item}
            className={[
              'px-3 py-1.5 text-sm rounded-[--radius] transition-colors',
              item === 'Users'
                ? 'bg-accent text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent',
            ].join(' ')}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2">
        <button className="h-8 w-8 flex items-center justify-center rounded-[--radius] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
        </button>
        <button className="h-8 w-8 flex items-center justify-center rounded-[--radius] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <Settings className="h-4 w-4" />
        </button>
        <Separator orientation="vertical" className="h-5" />
        <Avatar className="h-7 w-7 cursor-pointer">
          <AvatarFallback className="text-xs bg-primary/20 text-primary">JD</AvatarFallback>
        </Avatar>
      </div>
    </>
  )
}

// ─── Shell ────────────────────────────────────────────────────────────────────

export function HeaderShell({ header, children }: HeaderShellProps) {
  return (
    <div className="h-full flex flex-col">
      <header className="flex h-12 shrink-0 items-center border-b px-4 bg-background">
        {header ?? <DemoHeaderContent />}
      </header>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
