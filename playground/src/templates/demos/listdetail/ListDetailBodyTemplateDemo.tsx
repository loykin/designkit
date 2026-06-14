import { useState } from 'react'
import { ListDetailBodyTemplate, PageTopBar, Badge, Button } from '@loykin/designkit'
import { ChevronLeft, Circle, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { cn } from '@loykin/designkit'
import type { TemplateCodeContext } from '../../code'

// ─── Data ─────────────────────────────────────────────────────────────────────

type Priority = 'high' | 'medium' | 'low'
type Status   = 'open' | 'in-progress' | 'resolved'

interface Issue {
  id: string
  title: string
  status: Status
  priority: Priority
  assignee: string
  date: string
  body: string
}

const ISSUES: Issue[] = [
  { id: 'ISS-001', title: 'API rate limit errors on dashboard refresh', status: 'open',        priority: 'high',   assignee: 'Alex Kim',    date: 'Jun 12', body: 'Users report 429 errors when refreshing the dashboard in quick succession. Rate limiting logic needs to be revisited for burst traffic.' },
  { id: 'ISS-002', title: 'Search results not updating after filter change', status: 'in-progress', priority: 'medium', assignee: 'Sam Lee',     date: 'Jun 11', body: 'Applying a new filter while a previous search is in-flight causes stale results to appear. Need to cancel pending requests on filter change.' },
  { id: 'ISS-003', title: 'Export CSV missing timezone offset', status: 'open',        priority: 'medium', assignee: 'Jordan Park', date: 'Jun 10', body: 'Exported timestamps are in UTC with no offset annotation. Downstream tools interpret them incorrectly for users in UTC+/-N timezones.' },
  { id: 'ISS-004', title: 'Dark mode contrast on disabled inputs', status: 'resolved',    priority: 'low',    assignee: 'Taylor Ro',   date: 'Jun 9',  body: 'Disabled form fields had insufficient contrast in dark mode. Updated muted-foreground token to meet WCAG AA requirements.' },
  { id: 'ISS-005', title: 'Sidebar collapses on rapid tab switch', status: 'in-progress', priority: 'high',   assignee: 'Alex Kim',    date: 'Jun 8',  body: 'Rapidly switching between tabs while sidebar is animating causes it to end up in a collapsed state. Race condition in the animation handler.' },
  { id: 'ISS-006', title: 'Pagination resets on column sort', status: 'open',        priority: 'low',    assignee: 'Sam Lee',     date: 'Jun 7',  body: 'Sorting a column resets the user to page 1 even when remaining on the same dataset. Page index should only reset when filter/search changes.' },
]

const statusIcon: Record<Status, React.ReactNode> = {
  'open':        <Circle className="h-3.5 w-3.5 text-muted-foreground" />,
  'in-progress': <Clock className="h-3.5 w-3.5 text-blue-500" />,
  'resolved':    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
}

const priorityIcon: Record<Priority, React.ReactNode> = {
  high:   <AlertCircle className="h-3 w-3 text-destructive" />,
  medium: <AlertCircle className="h-3 w-3 text-amber-500" />,
  low:    <AlertCircle className="h-3 w-3 text-muted-foreground" />,
}

const statusVariant: Record<Status, 'default' | 'secondary' | 'outline'> = {
  'open':        'outline',
  'in-progress': 'secondary',
  'resolved':    'default',
}

// ─── List pane ────────────────────────────────────────────────────────────────

function IssueList({ selected, onSelect }: { selected: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="flex flex-col divide-y">
      {ISSUES.map((issue) => (
        <button
          key={issue.id}
          type="button"
          onClick={() => onSelect(issue.id)}
          className={cn(
            'flex flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-muted/50',
            selected === issue.id && 'bg-accent',
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            {statusIcon[issue.status]}
            <span className="truncate text-sm font-medium">{issue.title}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground pl-5">
            <span className="flex items-center gap-1">{priorityIcon[issue.priority]}{issue.priority}</span>
            <span>·</span>
            <span>{issue.assignee}</span>
            <span>·</span>
            <span>{issue.date}</span>
          </div>
        </button>
      ))}
    </div>
  )
}

// ─── Detail pane ──────────────────────────────────────────────────────────────

function IssueDetail({ issue, onBack }: { issue: Issue; onBack: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 border-b px-6 py-3 shrink-0">
        <Button variant="ghost" size="sm" className="h-7 gap-1 lg:hidden" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        <span className="text-xs text-muted-foreground font-mono">{issue.id}</span>
        <Badge variant={statusVariant[issue.status]} className="capitalize text-[10px] px-1.5 py-0">
          {issue.status.replace('-', ' ')}
        </Badge>
      </div>
      <div className="flex-1 overflow-auto px-6 py-5 space-y-5">
        <h2 className="text-base font-semibold leading-snug">{issue.title}</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
          <div className="text-muted-foreground">Priority</div>
          <div className="flex items-center gap-1 font-medium capitalize">
            {priorityIcon[issue.priority]} {issue.priority}
          </div>
          <div className="text-muted-foreground">Assignee</div>
          <div className="font-medium">{issue.assignee}</div>
          <div className="text-muted-foreground">Reported</div>
          <div className="font-medium">{issue.date}</div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1.5">Description</p>
          <p className="text-sm leading-relaxed">{issue.body}</p>
        </div>
      </div>
    </div>
  )
}

function EmptyDetail() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      Select an issue to view details
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

export function ListDetailBodyTemplateDemo({ theme }: { theme?: React.CSSProperties }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = ISSUES.find((i) => i.id === selectedId) ?? null

  return (
    <ListDetailBodyTemplate
      theme={theme}
      topBar={<PageTopBar left="Issues" />}
      list={<IssueList selected={selectedId} onSelect={setSelectedId} />}
      detail={selected ? <IssueDetail issue={selected} onBack={() => setSelectedId(null)} /> : undefined}
      emptyDetail={<EmptyDetail />}
    />
  )
}

export function buildListDetailBodyTemplateCode({ themeProp }: TemplateCodeContext) {
  return [
    `import { useState } from 'react'`,
    `import { ListDetailBodyTemplate, PageTopBar } from '@loykin/designkit'`,
    `import '@loykin/designkit/styles'`,
    ``,
    `type Item = { id: string; title: string }`,
    `const ITEMS: Item[] = []`,
    ``,
    `export function MyPage() {`,
    `  const [selectedId, setSelectedId] = useState<string | null>(null)`,
    `  const selected = ITEMS.find((i) => i.id === selectedId)`,
    ``,
    `  return (`,
    `    <ListDetailBodyTemplate${themeProp}`,
    `      topBar={<PageTopBar left="Items" />}`,
    `      list={`,
    `        <div>`,
    `          {ITEMS.map((item) => (`,
    `            <button key={item.id} onClick={() => setSelectedId(item.id)}>`,
    `              {item.title}`,
    `            </button>`,
    `          ))}`,
    `        </div>`,
    `      }`,
    `      detail={selected ? <div>{selected.title}</div> : undefined}`,
    `      emptyDetail={<div>Select an item</div>}`,
    `    />`,
    `  )`,
    `}`,
  ].join('\n')
}
