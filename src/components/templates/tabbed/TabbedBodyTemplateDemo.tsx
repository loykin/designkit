import { TabbedBodyTemplate, type TabbedTab } from './TabbedBodyTemplate'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CheckCircle2, Clock, AlertCircle, XCircle, Plus, Search } from 'lucide-react'

type Status   = 'open' | 'in-progress' | 'resolved' | 'closed'
type Priority = 'critical' | 'high' | 'medium' | 'low'

interface Issue {
  id: string
  title: string
  status: Status
  priority: Priority
  assignee: string
  created: string
}

const issues: Issue[] = [
  { id:'INC-001', title:'API gateway returning 502 on /auth endpoints',  status:'open',        priority:'critical', assignee:'Sarah K.',   created:'2h ago'  },
  { id:'INC-002', title:'Memory leak in data-processor worker threads',  status:'in-progress', priority:'high',     assignee:'Marcus L.',  created:'5h ago'  },
  { id:'INC-003', title:'Dashboard charts not rendering in Safari 17',   status:'open',        priority:'medium',   assignee:'Ji-Yeon P.', created:'1d ago'  },
  { id:'INC-004', title:'Slow query on users table (>3s)',               status:'resolved',    priority:'high',     assignee:'Alex C.',    created:'2d ago'  },
  { id:'INC-005', title:'Email notifications not sent for new signups',  status:'in-progress', priority:'medium',   assignee:'Dana W.',    created:'3d ago'  },
  { id:'INC-006', title:'CORS error on POST /api/v2/upload from mobile', status:'open',        priority:'high',     assignee:'Leo T.',     created:'4d ago'  },
  { id:'INC-007', title:'Cron expression parsing failure on scheduler',  status:'closed',      priority:'low',      assignee:'Mina S.',    created:'1w ago'  },
]

const statusIcon: Record<Status, React.ReactNode> = {
  'open':        <AlertCircle  className="h-3.5 w-3.5 text-destructive"      />,
  'in-progress': <Clock        className="h-3.5 w-3.5 text-yellow-500"       />,
  'resolved':    <CheckCircle2 className="h-3.5 w-3.5 text-primary"          />,
  'closed':      <XCircle      className="h-3.5 w-3.5 text-muted-foreground" />,
}

const priorityVariant: Record<Priority, 'destructive' | 'default' | 'secondary' | 'outline'> = {
  critical: 'destructive', high: 'default', medium: 'secondary', low: 'outline',
}

function IssueTable({ rows }: { rows: Issue[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-24">ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="w-24">Priority</TableHead>
          <TableHead className="w-28">Assignee</TableHead>
          <TableHead className="w-24">Created</TableHead>
          <TableHead className="w-16" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((issue) => (
          <TableRow key={issue.id} className="cursor-pointer">
            <TableCell className="font-mono text-xs text-muted-foreground">{issue.id}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {statusIcon[issue.status]}
                <span className="text-sm">{issue.title}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={priorityVariant[issue.priority]} className="text-xs capitalize">
                {issue.priority}
              </Badge>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">{issue.assignee}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{issue.created}</TableCell>
            <TableCell>
              <Button variant="ghost" size="sm" className="h-7 text-xs">View</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const counts = {
  open:          issues.filter((i) => i.status === 'open').length,
  'in-progress': issues.filter((i) => i.status === 'in-progress').length,
  resolved:      issues.filter((i) => i.status === 'resolved').length,
  closed:        issues.filter((i) => i.status === 'closed').length,
}

const demoTabs: TabbedTab[] = [
  { id: 'all',         label: 'All',         count: issues.length         },
  { id: 'open',        label: 'Open',        count: counts.open           },
  { id: 'in-progress', label: 'In Progress', count: counts['in-progress'] },
  { id: 'resolved',    label: 'Resolved',    count: counts.resolved       },
]

const demoSummary = (
  <div className="grid grid-cols-4 gap-[var(--dk-panel-gap)]">
    {([
      { label: 'Open',        count: counts.open,           Icon: AlertCircle,  cls: 'text-destructive'      },
      { label: 'In Progress', count: counts['in-progress'], Icon: Clock,        cls: 'text-yellow-500'       },
      { label: 'Resolved',    count: counts.resolved,       Icon: CheckCircle2, cls: 'text-primary'          },
      { label: 'Closed',      count: counts.closed,         Icon: XCircle,      cls: 'text-muted-foreground' },
    ] as const).map(({ label, count, Icon, cls }) => (
      <Card key={label}>
        <CardContent className="p-[calc(var(--dk-panel-gap)*0.75)] flex items-center gap-[calc(var(--dk-panel-gap)*0.75)]">
          <Icon className={`h-5 w-5 ${cls}`} />
          <div>
            <p className="text-xl font-bold tabular-nums">{count}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

function demoRenderTab(id: string) {
  const filtered = id === 'all' ? issues : issues.filter((i) => i.status === id)
  return <IssueTable rows={filtered} />
}

export function TabbedBodyTemplateDemo({ theme }: { theme?: React.CSSProperties }) {
  return (
    <TabbedBodyTemplate
      theme={theme}
      breadcrumb="Pages / Tabbed"
      title="Incidents"
      description="Incident queue grouped by status"
      tabs={demoTabs}
      renderTab={demoRenderTab}
      summary={demoSummary}
      toolbarLeft={
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search…" className="pl-8 h-8 w-52 text-xs" />
        </div>
      }
      toolbarRight={
        <Button size="sm" className="h-8 gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          New Incident
        </Button>
      }
    />
  )
}
