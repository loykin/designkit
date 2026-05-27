import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
  Badge,
  Button,
  Input,
  PageTopBar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  WorkbenchBodyTemplate,
} from '@loykin/designkit'
import {
  ChevronDown,
  Database,
  FileCode2,
  PanelRightClose,
  PanelRightOpen,
  Play,
  Save,
  Search,
  SlidersHorizontal,
  Wand2,
  X,
} from 'lucide-react'
import type { TemplateCodeContext } from '../../code'

function PaneHeader({
  title,
  right,
}: {
  title: string
  right?: ReactNode
}) {
  return (
    <div className="flex h-10 shrink-0 items-center justify-between border-b px-3">
      <span className="text-xs font-medium">{title}</span>
      {right && <div className="flex items-center gap-1">{right}</div>}
    </div>
  )
}

function InspectorSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="border-b p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold">{title}</h3>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

function PanelPreview() {
  const bars = [46, 58, 42, 76, 61, 88, 72, 95, 64, 79, 68, 84]

  return (
    <div className="h-full bg-background p-4">
      <div className="flex h-full flex-col overflow-hidden rounded-(--radius) border bg-card">
        <div className="flex h-9 shrink-0 items-center justify-between border-b px-3">
          <span className="text-xs font-medium">Request latency</span>
          <span className="text-[11px] text-muted-foreground">now-6h to now</span>
        </div>
        <div className="relative min-h-0 flex-1 p-4">
          <div className="absolute inset-x-4 top-1/4 border-t border-dashed" />
          <div className="absolute inset-x-4 top-1/2 border-t border-dashed" />
          <div className="absolute inset-x-4 top-3/4 border-t border-dashed" />
          <div className="relative flex h-full items-end gap-2">
            {bars.map((height, index) => (
              <div key={index} className="flex min-w-0 flex-1 flex-col justify-end">
                <div
                  className="rounded-t-sm bg-primary/75"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PanelInspector() {
  return (
    <div className="flex h-full flex-col">
      <PaneHeader title="Panel options" />
      <div className="min-h-0 flex-1 overflow-auto">
        <InspectorSection title="Visualization">
          <Field label="Type">
            <Select defaultValue="timeseries">
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="timeseries">Time series</SelectItem>
                <SelectItem value="bar">Bar chart</SelectItem>
                <SelectItem value="table">Table</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Stacking">
            <Select defaultValue="none">
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="percent">Percent</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </InspectorSection>
        <InspectorSection title="Field">
          <Field label="Unit">
            <Input defaultValue="milliseconds" className="h-8 text-xs" />
          </Field>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-medium text-muted-foreground">Show points</span>
            <Switch defaultChecked />
          </div>
        </InspectorSection>
        <InspectorSection title="Thresholds">
          <Field label="Warning">
            <Input defaultValue="200" className="h-8 text-xs" />
          </Field>
          <Field label="Critical">
            <Input defaultValue="500" className="h-8 text-xs" />
          </Field>
        </InspectorSection>
      </div>
    </div>
  )
}

function QueryPane() {
  return (
    <div className="flex h-full flex-col bg-background">
      <PaneHeader
        title="Query"
        right={
          <>
            <Button variant="ghost" size="icon-xs"><Wand2 /></Button>
            <Button variant="outline" size="xs"><Play />Run</Button>
          </>
        }
      />
      <div className="grid min-h-0 flex-1 grid-cols-[14rem_minmax(0,1fr)]">
        <div className="border-r p-3">
          <div className="mb-2 text-[11px] font-medium text-muted-foreground">Data source</div>
          <Select defaultValue="prometheus">
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="prometheus">Prometheus</SelectItem>
              <SelectItem value="postgres">Postgres</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <textarea
          className="h-full resize-none bg-muted/25 p-3 font-mono text-xs leading-5 outline-none"
          defaultValue={'histogram_quantile(0.95,\n  sum(rate(http_request_duration_seconds_bucket[5m])) by (le)\n)'}
        />
      </div>
    </div>
  )
}

export function WorkbenchPanelEditorDemo({ theme }: { theme?: CSSProperties }) {
  const [rightCollapsed, setRightCollapsed] = useState(false)
  const [bottomCollapsed, setBottomCollapsed] = useState(false)

  return (
    <WorkbenchBodyTemplate
      theme={theme}
      className="layout-workbench-panel-editor"
      topBar={
        <PageTopBar
          left="Dashboards / Infrastructure / Edit panel"
          right={
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="sm"><X />Cancel</Button>
              <Button variant="outline" size="sm">Apply</Button>
              <Button size="sm"><Save />Save</Button>
            </div>
          }
        />
      }
      headerRight={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBottomCollapsed((value) => !value)}
          >
            <FileCode2 />Query
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setRightCollapsed((value) => !value)}
          >
            {rightCollapsed ? <PanelRightOpen /> : <PanelRightClose />}
          </Button>
        </>
      }
      title="Panel editor"
      description="Latency panel"
      mainPane={<PanelPreview />}
      rightPane={<PanelInspector />}
      bottomPane={<QueryPane />}
      rightPaneCollapsed={rightCollapsed}
      bottomPaneCollapsed={bottomCollapsed}
      rightPaneWidth={340}
      bottomPaneHeight={220}
    />
  )
}

const schemas = [
  ['public.users', ['id', 'email', 'plan', 'created_at']],
  ['public.sessions', ['id', 'user_id', 'started_at', 'duration_ms']],
  ['billing.invoices', ['id', 'account_id', 'amount', 'status']],
]

function SchemaBrowser() {
  return (
    <div className="flex h-full flex-col">
      <PaneHeader title="Schema" />
      <div className="border-b p-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input className="h-8 pl-7 text-xs" placeholder="Search tables" />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-2">
        {schemas.map(([table, columns]) => (
          <div key={table} className="mb-2 rounded-(--radius) border bg-background">
            <div className="flex h-8 items-center gap-2 border-b px-2">
              <Database className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="truncate text-xs font-medium">{table}</span>
            </div>
            <div className="py-1">
              {(columns as string[]).map((column) => (
                <div key={column} className="px-7 py-1 text-[11px] text-muted-foreground">
                  {column}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SqlEditor() {
  return (
    <div className="flex h-full flex-col bg-background">
      <PaneHeader
        title="retention.sql"
        right={<Badge variant="outline" className="h-5 rounded-md px-1.5 text-[10px]">Postgres</Badge>}
      />
      <textarea
        className="min-h-0 flex-1 resize-none bg-muted/20 p-4 font-mono text-xs leading-6 outline-none"
        spellCheck={false}
        defaultValue={[
          'select',
          '  date_trunc(\'day\', started_at) as day,',
          '  count(distinct user_id) as active_users,',
          '  percentile_cont(0.95) within group (order by duration_ms) as p95_duration',
          'from public.sessions',
          'where started_at >= now() - interval \'30 days\'',
          'group by 1',
          'order by 1 desc;',
        ].join('\n')}
      />
    </div>
  )
}

function ResultsPane() {
  const rows = [
    ['2026-05-28', '18,420', '842'],
    ['2026-05-27', '18,109', '801'],
    ['2026-05-26', '17,884', '823'],
    ['2026-05-25', '17,201', '788'],
  ]

  return (
    <div className="flex h-full flex-col bg-background">
      <PaneHeader
        title="Results"
        right={<span className="text-[11px] text-muted-foreground">4 rows in 182 ms</span>}
      />
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-muted">
            <tr>
              {['day', 'active_users', 'p95_duration'].map((column) => (
                <th key={column} className="border-b px-3 py-2 font-medium">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-b">
                {row.map((cell) => (
                  <td key={cell} className="px-3 py-2 text-muted-foreground">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function WorkbenchSqlEditorDemo({ theme }: { theme?: CSSProperties }) {
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [bottomCollapsed, setBottomCollapsed] = useState(false)

  return (
    <WorkbenchBodyTemplate
      theme={theme}
      className="layout-workbench-sql-editor"
      topBar={
        <PageTopBar
          left="Data / Query editor"
          right={
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm"><SlidersHorizontal />Explain</Button>
              <Button size="sm"><Play />Run</Button>
            </div>
          }
        />
      }
      headerRight={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLeftCollapsed((value) => !value)}
          >
            <Database />Schema
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBottomCollapsed((value) => !value)}
          >
            Results
          </Button>
        </>
      }
      title="SQL editor"
      description="Warehouse analytics"
      leftPane={<SchemaBrowser />}
      mainPane={<SqlEditor />}
      bottomPane={<ResultsPane />}
      leftPaneCollapsed={leftCollapsed}
      bottomPaneCollapsed={bottomCollapsed}
      leftPaneWidth={280}
      bottomPaneHeight={230}
    />
  )
}

export function buildWorkbenchTemplateCode({ themeProp, definition }: TemplateCodeContext) {
  const isSql = definition.id === 'workbench-sql-editor'

  return `import { WorkbenchBodyTemplate, PageTopBar, Button } from '@loykin/designkit'

export function ${isSql ? 'SqlEditorPage' : 'PanelEditorPage'}() {
  return (
    <WorkbenchBodyTemplate
      theme={${themeProp}}
      topBar={<PageTopBar left="${isSql ? 'Data / Query editor' : 'Dashboards / Edit panel'}" />}
      title="${isSql ? 'SQL editor' : 'Panel editor'}"
      headerRight={<Button variant="outline" size="sm">${isSql ? 'Run' : 'Query'}</Button>}
      leftPane={${isSql ? '<SchemaBrowser />' : 'undefined'}}
      mainPane={${isSql ? '<SqlEditor />' : '<PanelPreview />'}}
      rightPane={${isSql ? 'undefined' : '<PanelInspector />'}}
      bottomPane={${isSql ? '<ResultsGrid />' : '<QueryEditor />'}}
      resizable
    />
  )
}
`
}
