import { useState, useRef, useCallback } from 'react'
import { WorkbenchBodyTemplate, PageTopBar, Button, Badge } from '@loykin/designkit'
import { cn } from '@loykin/designkit'
import { DataGridAgentChat } from '@loykin/gridkit'
import type { AgentChatEvent } from '@loykin/gridkit'
import { Send, Database, MessageSquare, Plus } from 'lucide-react'
import type { TemplateCodeContext } from '../../code'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Session {
  id: string
  title: string
  preview: string
  events: AgentChatEvent[]
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_EVENTS: AgentChatEvent[] = [
  {
    id: 'u1', type: 'message', role: 'user',
    content: 'How many active users do we have this month?',
  },
  {
    id: 'st1', type: 'status', label: 'Analyzing request…', status: 'complete',
  },
  {
    id: 'tc1', type: 'tool_call', name: 'query_database', status: 'complete',
    input: { sql: "SELECT COUNT(*) FROM users WHERE last_active >= date_trunc('month', now())" },
  },
  {
    id: 'tr1', type: 'tool_result', name: 'query_database',
    output: { rows: [{ count: 4218 }], duration_ms: 38 },
  },
  {
    id: 'a1', type: 'message', role: 'assistant',
    content: 'You have **4,218 active users** this month — up 12% from last month (3,766).',
  },
  {
    id: 'u2', type: 'message', role: 'user',
    content: 'Break it down by subscription plan.',
  },
  {
    id: 'st2', type: 'status', label: 'Querying plan distribution…', status: 'complete',
  },
  {
    id: 'tc2', type: 'tool_call', name: 'query_database', status: 'complete',
    input: { sql: 'SELECT plan, COUNT(*) AS users FROM subscriptions WHERE active = true GROUP BY plan ORDER BY users DESC' },
  },
  {
    id: 'tr2', type: 'tool_result', name: 'query_database',
    output: { rows: [{ plan: 'free', users: 2840 }, { plan: 'pro', users: 1102 }, { plan: 'enterprise', users: 276 }], duration_ms: 21 },
  },
  {
    id: 'art1', type: 'artifact', kind: 'table', title: 'Active Users by Plan',
    data: [
      { plan: 'Free',       users: 2840, share: '67%' },
      { plan: 'Pro',        users: 1102, share: '26%' },
      { plan: 'Enterprise', users: 276,  share: '7%'  },
    ],
  },
  {
    id: 'a2', type: 'message', role: 'assistant',
    content: 'Free accounts dominate at 67%. Pro is 26% — strong upgrade potential. Enterprise at 7% likely drives the most revenue per seat.',
  },
]

const SESSIONS: Session[] = [
  { id: 'sess-1', title: 'Monthly active users', preview: 'How many active users…', events: SEED_EVENTS },
  { id: 'sess-2', title: 'Revenue by region',     preview: 'Show me Q2 revenue…',   events: [] },
  { id: 'sess-3', title: 'Churn analysis',        preview: 'Which cohorts churned…', events: [] },
]

// ─── Simulated response ───────────────────────────────────────────────────────

let _seq = 100

function nextId() { return `gen-${++_seq}` }

const RESPONSES = [
  (q: string): AgentChatEvent[] => [
    { id: nextId(), type: 'status',      label: `Processing: "${q}"`, status: 'complete' },
    { id: nextId(), type: 'tool_call',   name: 'query_database', status: 'complete', input: { sql: `SELECT * FROM metrics WHERE topic = '${q.toLowerCase().split(' ')[0]}'` } },
    { id: nextId(), type: 'tool_result', name: 'query_database', output: { rows: 14, duration_ms: 27 } },
    { id: nextId(), type: 'message',     role: 'assistant', content: `I found 14 matching records. The trend over the last 30 days shows a steady 8% week-over-week increase. Want me to break this down further?` },
  ],
  (q: string): AgentChatEvent[] => [
    { id: nextId(), type: 'status',      label: 'Running analysis…', status: 'complete' },
    { id: nextId(), type: 'tool_call',   name: 'compute_stats', status: 'complete', input: { metric: q, window: '30d' } },
    { id: nextId(), type: 'tool_result', name: 'compute_stats', output: { mean: 1842, p50: 1654, p95: 3201 } },
    { id: nextId(), type: 'artifact',    kind: 'table', title: 'Statistical Summary', data: [{ stat: 'Mean', value: 1842 }, { stat: 'P50', value: 1654 }, { stat: 'P95', value: 3201 }] },
    { id: nextId(), type: 'message',     role: 'assistant', content: 'The P95 is about 2× the median — there are outliers worth investigating. Should I identify which segments are driving the tail?' },
  ],
]

let _responseIdx = 0

// ─── Custom renders ───────────────────────────────────────────────────────────

function ToolCallBlock({ name, input }: { name: string; input?: unknown }) {
  return (
    <div className="rounded border border-border bg-muted/40 px-3 py-2 text-xs font-mono">
      <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
        <Database className="h-3 w-3" />
        <span className="font-sans font-medium">{name}</span>
      </div>
      {input !== undefined && (
        <pre className="text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap break-words text-foreground/80">
          {typeof input === 'object' && input !== null && 'sql' in input
            ? String((input as { sql: unknown }).sql)
            : JSON.stringify(input, null, 2)}
        </pre>
      )}
    </div>
  )
}

function ArtifactTable({ data, title }: { data: Record<string, unknown>[]; title?: React.ReactNode }) {
  if (!data?.length) return null
  const cols = Object.keys(data[0])
  return (
    <div className="rounded border border-border overflow-hidden text-xs">
      {title && (
        <div className="flex items-center gap-1.5 border-b bg-muted/50 px-3 py-1.5 font-medium text-muted-foreground">
          <Database className="h-3 w-3" />
          {title}
        </div>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-muted/30">
            {cols.map((col) => (
              <th key={col} className="px-3 py-1.5 text-left font-medium text-muted-foreground capitalize">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
              {cols.map((col) => (
                <td key={col} className="px-3 py-1.5">{String(row[col] ?? '')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Input footer ─────────────────────────────────────────────────────────────

function ChatInput({ onSend, disabled }: { onSend: (msg: string) => void; disabled?: boolean }) {
  const [value, setValue] = useState('')

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  return (
    <div className="flex items-end gap-2 border-t px-4 py-3">
      <textarea
        className="flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring min-h-[36px] max-h-[120px]"
        placeholder="Ask anything about your data…"
        rows={1}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
        }}
      />
      <Button size="sm" className="h-9 w-9 p-0 shrink-0" onClick={submit} disabled={disabled || !value.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </div>
  )
}

// ─── Session list (left pane) ─────────────────────────────────────────────────

function SessionList({ sessions, activeId, onSelect, onNew }: {
  sessions: Session[]
  activeId: string
  onSelect: (id: string) => void
  onNew: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b shrink-0">
        <span className="text-xs font-medium text-muted-foreground">Conversations</span>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onNew}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto divide-y">
        {sessions.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            className={cn(
              'w-full text-left px-3 py-2.5 transition-colors hover:bg-muted/50',
              activeId === s.id && 'bg-accent',
            )}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <MessageSquare className="h-3 w-3 shrink-0 text-muted-foreground" />
              <p className="text-xs font-medium truncate">{s.title}</p>
            </div>
            <p className="text-[11px] text-muted-foreground truncate pl-5">{s.preview}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

export function AgentChatDemo({ theme }: { theme?: React.CSSProperties }) {
  const [sessions, setSessions]     = useState<Session[]>(SESSIONS)
  const [activeId, setActiveId]     = useState('sess-1')
  const [isTyping, setIsTyping]     = useState(false)
  const timeoutsRef                 = useRef<ReturnType<typeof setTimeout>[]>([])

  const activeSession = sessions.find((s) => s.id === activeId) ?? sessions[0]

  const patchSession = useCallback((id: string, patch: (prev: AgentChatEvent[]) => AgentChatEvent[]) => {
    setSessions((ss) => ss.map((s) => s.id === id ? { ...s, events: patch(s.events) } : s))
  }, [])

  const handleSend = useCallback((text: string) => {
    const sid = activeId
    const userEvent: AgentChatEvent = { id: nextId(), type: 'message', role: 'user', content: text }

    patchSession(sid, (prev) => [...prev, userEvent])
    setIsTyping(true)

    const replyEvents = RESPONSES[_responseIdx++ % RESPONSES.length](text)

    replyEvents.forEach((ev, i) => {
      const t = setTimeout(() => {
        patchSession(sid, (prev) => [...prev, ev])
        if (i === replyEvents.length - 1) setIsTyping(false)
      }, 600 + i * 700)
      timeoutsRef.current.push(t)
    })
  }, [activeId, patchSession])

  const handleNew = useCallback(() => {
    const id = `sess-${Date.now()}`
    setSessions((ss) => [...ss, { id, title: 'New conversation', preview: '', events: [] }])
    setActiveId(id)
  }, [])

  return (
    <WorkbenchBodyTemplate
      theme={theme}
      topBar={
        <PageTopBar
          variant="default"
          left={
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                Data Agent
              </Badge>
            </div>
          }
        />
      }
      leftPaneWidth={220}
      leftPane={
        <SessionList
          sessions={sessions}
          activeId={activeId}
          onSelect={setActiveId}
          onNew={handleNew}
        />
      }
      mainPane={
        <DataGridAgentChat
          key={activeId}
          events={activeSession.events}
          fillParent
          stickToBottom
          scrollbar={{ mode: 'custom' }}
          styles={{ root: { '--gridkit-container-border': 'transparent', '--gridkit-radius': '0px' } as React.CSSProperties }}
          emptyContent={
            <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
              <Database className="h-8 w-8 opacity-30" />
              <p className="text-sm">Ask anything about your data</p>
            </div>
          }
          footer={<ChatInput onSend={handleSend} disabled={isTyping} />}
          renderToolCall={(event) => (
            <ToolCallBlock name={event.name} input={event.input} />
          )}
          renderArtifact={(event) =>
            event.kind === 'table'
              ? <ArtifactTable data={event.data as Record<string, unknown>[]} title={event.title} />
              : undefined
          }
        />
      }
    />
  )
}

export function buildAgentChatCode({ themeProp }: TemplateCodeContext) {
  return [
    `import { useState } from 'react'`,
    `import { WorkbenchBodyTemplate, PageTopBar } from '@loykin/designkit'`,
    `import { DataGridAgentChat } from '@loykin/gridkit'`,
    `import type { AgentChatEvent } from '@loykin/gridkit'`,
    `import '@loykin/designkit/styles'`,
    ``,
    `type Session = { id: string; title: string; events: AgentChatEvent[] }`,
    ``,
    `const SESSIONS: Session[] = [`,
    `  { id: 's1', title: 'Monthly active users', events: [`,
    `    { id: '1', type: 'message', role: 'user', content: 'How many active users?' },`,
    `    { id: '2', type: 'tool_call', name: 'query_database', status: 'complete',`,
    `      input: { sql: 'SELECT COUNT(*) FROM users WHERE active = true' } },`,
    `    { id: '3', type: 'tool_result', name: 'query_database', output: { count: 4218 } },`,
    `    { id: '4', type: 'message', role: 'assistant', content: '4,218 active users this month.' },`,
    `  ] },`,
    `]`,
    ``,
    `export function MyPage() {`,
    `  const [activeId, setActiveId] = useState(SESSIONS[0].id)`,
    `  const session = SESSIONS.find((s) => s.id === activeId) ?? SESSIONS[0]`,
    ``,
    `  return (`,
    `    <WorkbenchBodyTemplate${themeProp}`,
    `      topBar={<PageTopBar left="Data Agent" />}`,
    `      leftPaneWidth={220}`,
    `      leftPane={`,
    `        <div className="flex flex-col divide-y">`,
    `          {SESSIONS.map((s) => (`,
    `            <button key={s.id} onClick={() => setActiveId(s.id)}>`,
    `              {s.title}`,
    `            </button>`,
    `          ))}`,
    `        </div>`,
    `      }`,
    `      mainPane={`,
    `        <DataGridAgentChat`,
    `          key={activeId}`,
    `          events={session.events}`,
    `          fillParent`,
    `          stickToBottom`,
    `          renderToolCall={(e) => <pre>{JSON.stringify(e.input, null, 2)}</pre>}`,
    `        />`,
    `      }`,
    `    />`,
    `  )`,
    `}`,
  ].join('\n')
}
