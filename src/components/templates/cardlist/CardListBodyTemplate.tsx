import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Star, GitFork } from 'lucide-react'

// ─── Public API ───────────────────────────────────────────────────────────────

export interface CardItem {
  id:          string
  title:       string
  description: string
  tags?:       string[]
  meta?:       { label: string; icon?: React.ReactNode }[]
  badge?:      string
  footer?:     React.ReactNode
}

export interface CardListBodyTemplateProps {
  theme?:       React.CSSProperties
  title?:       string
  /** Slot: replaces toolbar actions */
  actions?:     React.ReactNode
  items?:       CardItem[]
  /** Number of columns: 2 | 3 | 4 (default: 3) */
  columns?:     2 | 3 | 4
  /** Slot: replaces the filter/sort row */
  filters?:     React.ReactNode
}

// ─── Demo defaults ────────────────────────────────────────────────────────────

const langDot: Record<string, string> = {
  TypeScript: 'bg-blue-500', Python: 'bg-yellow-500',
  Go: 'bg-cyan-500', Rust: 'bg-orange-500', Java: 'bg-red-400',
}

const demoItems: CardItem[] = [
  { id:'1', title:'data-voyager',    badge:'TypeScript', description:'SQL query builder and data explorer with AI assist',             tags:['data','sql','ai'],           meta:[{ label:'1.2k', icon:<Star className="h-3 w-3"/> },{ label:'89', icon:<GitFork className="h-3 w-3"/> },{ label:'2h ago' }] },
  { id:'2', title:'designkit',       badge:'TypeScript', description:'shadcn/ui layout template previewer and configurator',           tags:['ui','shadcn'],               meta:[{ label:'847',  icon:<Star className="h-3 w-3"/> },{ label:'62', icon:<GitFork className="h-3 w-3"/> },{ label:'4h ago' }] },
  { id:'3', title:'ml-pipeline',     badge:'Python',     description:'Distributed ML training pipeline with auto-scaling',            tags:['ml','pipeline'],             meta:[{ label:'3.4k', icon:<Star className="h-3 w-3"/> },{ label:'241',icon:<GitFork className="h-3 w-3"/> },{ label:'1d ago' }] },
  { id:'4', title:'edge-router',     badge:'Rust',       description:'High-performance edge router written in Rust',                  tags:['networking','perf'],         meta:[{ label:'2.1k', icon:<Star className="h-3 w-3"/> },{ label:'97', icon:<GitFork className="h-3 w-3"/> },{ label:'3d ago' }] },
  { id:'5', title:'kafka-bridge',    badge:'Go',         description:'Kafka ↔ REST bridge with schema registry support',              tags:['kafka','streaming'],         meta:[{ label:'678',  icon:<Star className="h-3 w-3"/> },{ label:'45', icon:<GitFork className="h-3 w-3"/> },{ label:'5d ago' }] },
  { id:'6', title:'auth-service',    badge:'Go',         description:'OAuth2/OIDC microservice with JWT and refresh tokens',          tags:['auth','security'],           meta:[{ label:'521',  icon:<Star className="h-3 w-3"/> },{ label:'38', icon:<GitFork className="h-3 w-3"/> },{ label:'1w ago' }] },
  { id:'7', title:'scheduler-core',  badge:'Java',       description:'Distributed job scheduler with cron and priority queues',      tags:['scheduler','distributed'],   meta:[{ label:'389',  icon:<Star className="h-3 w-3"/> },{ label:'27', icon:<GitFork className="h-3 w-3"/> },{ label:'2w ago' }] },
  { id:'8', title:'log-aggregator',  badge:'Go',         description:'Lightweight log aggregation and alerting daemon',               tags:['logging','observability'],   meta:[{ label:'294',  icon:<Star className="h-3 w-3"/> },{ label:'19', icon:<GitFork className="h-3 w-3"/> },{ label:'3w ago' }] },
]

const colClass = { 2: 'grid-cols-2', 3: 'grid-cols-2 xl:grid-cols-3', 4: 'grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' }

// ─── Template ─────────────────────────────────────────────────────────────────

export function CardListBodyTemplate({
  theme,
  title   = 'Repositories',
  actions,
  items   = demoItems,
  columns = 3,
  filters,
}: CardListBodyTemplateProps) {
  return (
    <div className="layout-cardlist h-full flex flex-col bg-background text-foreground" style={theme}>
      <div className="flex items-center gap-2 px-6 py-3 border-b shrink-0">
        <h1 className="text-sm font-semibold mr-auto">{title}</h1>
        {filters ?? (
          <>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search…" className="pl-8 h-8 w-52 text-xs" />
            </div>
            <Select defaultValue="updated">
              <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last updated</SelectItem>
                <SelectItem value="stars">Most stars</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
        {actions ?? <Button size="sm" className="h-8 text-xs">New repo</Button>}
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className={`grid gap-4 ${colClass[columns]}`}>
          {items.map((item) => (
            <Card key={item.id} className="flex flex-col hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold truncate">{item.title}</p>
                  {item.badge && (
                    <div className="flex items-center gap-1 shrink-0">
                      <div className={`h-2 w-2 rounded-full ${langDot[item.badge] ?? 'bg-muted'}`} />
                      <span className="text-[10px] text-muted-foreground">{item.badge}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                  {item.description}
                </p>
                {item.tags && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              {(item.meta || item.footer) && (
                <CardFooter className="px-4 py-3 border-t flex items-center gap-3 text-[10px] text-muted-foreground">
                  {item.footer ?? item.meta?.map((m, i) => (
                    <span key={i} className={['flex items-center gap-1', i === (item.meta!.length - 1) ? 'ml-auto' : ''].join(' ')}>
                      {m.icon}{m.label}
                    </span>
                  ))}
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
