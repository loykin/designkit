import { CardListBodyTemplate, type CardItem } from './CardListBodyTemplate'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GitFork, Search, Star } from 'lucide-react'

const demoItems: CardItem[] = [
  {
    id: '1', title: 'data-voyager', badge: 'TypeScript', badgeColor: '#3b82f6',
    description: 'SQL query builder and data explorer with AI assist',
    tags: ['data', 'sql', 'ai'],
    meta: [{ label: '1.2k', icon: <Star className="h-3 w-3" /> }, { label: '89', icon: <GitFork className="h-3 w-3" /> }, { label: '2h ago' }],
  },
  {
    id: '2', title: 'designkit', badge: 'TypeScript', badgeColor: '#3b82f6',
    description: 'shadcn/ui layout template previewer and configurator',
    tags: ['ui', 'shadcn'],
    meta: [{ label: '847', icon: <Star className="h-3 w-3" /> }, { label: '62', icon: <GitFork className="h-3 w-3" /> }, { label: '4h ago' }],
  },
  {
    id: '3', title: 'ml-pipeline', badge: 'Python', badgeColor: '#eab308',
    description: 'Distributed ML training pipeline with auto-scaling',
    tags: ['ml', 'pipeline'],
    meta: [{ label: '3.4k', icon: <Star className="h-3 w-3" /> }, { label: '241', icon: <GitFork className="h-3 w-3" /> }, { label: '1d ago' }],
  },
  {
    id: '4', title: 'edge-router', badge: 'Rust', badgeColor: '#f97316',
    description: 'High-performance edge router written in Rust',
    tags: ['networking', 'perf'],
    meta: [{ label: '2.1k', icon: <Star className="h-3 w-3" /> }, { label: '97', icon: <GitFork className="h-3 w-3" /> }, { label: '3d ago' }],
  },
  {
    id: '5', title: 'kafka-bridge', badge: 'Go', badgeColor: '#06b6d4',
    description: 'Kafka ↔ REST bridge with schema registry support',
    tags: ['kafka', 'streaming'],
    meta: [{ label: '678', icon: <Star className="h-3 w-3" /> }, { label: '45', icon: <GitFork className="h-3 w-3" /> }, { label: '5d ago' }],
  },
  {
    id: '6', title: 'auth-service', badge: 'Go', badgeColor: '#06b6d4',
    description: 'OAuth2/OIDC microservice with JWT and refresh tokens',
    tags: ['auth', 'security'],
    meta: [{ label: '521', icon: <Star className="h-3 w-3" /> }, { label: '38', icon: <GitFork className="h-3 w-3" /> }, { label: '1w ago' }],
  },
  {
    id: '7', title: 'scheduler-core', badge: 'Java', badgeColor: '#f87171',
    description: 'Distributed job scheduler with cron and priority queues',
    tags: ['scheduler', 'distributed'],
    meta: [{ label: '389', icon: <Star className="h-3 w-3" /> }, { label: '27', icon: <GitFork className="h-3 w-3" /> }, { label: '2w ago' }],
  },
  {
    id: '8', title: 'log-aggregator', badge: 'Go', badgeColor: '#06b6d4',
    description: 'Lightweight log aggregation and alerting daemon',
    tags: ['logging', 'observability'],
    meta: [{ label: '294', icon: <Star className="h-3 w-3" /> }, { label: '19', icon: <GitFork className="h-3 w-3" /> }, { label: '3w ago' }],
  },
]

export function CardListBodyTemplateDemo({ theme }: { theme?: React.CSSProperties }) {
  return (
    <CardListBodyTemplate
      theme={theme}
      breadcrumb="Pages / Card List"
      title="Repositories"
      actions={<Button size="sm" className="h-8 text-xs">New repo</Button>}
      items={demoItems}
      columns={3}
      toolbarLeft={
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search…" className="pl-8 h-8 w-52 text-xs" />
        </div>
      }
      toolbarRight={
        <Select defaultValue="updated">
          <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="updated">Last updated</SelectItem>
            <SelectItem value="stars">Most stars</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      }
    />
  )
}
