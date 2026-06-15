import React from 'react'
import {
  PanelTemplate,
  DataPage,
  PageTopBar,
  Badge,
  Button,
  cn,
} from '@loykin/designkit'
import { SidePanelProvider, useSidePanel } from '@loykin/side-panel'
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Play,
  ExternalLink,
  RotateCcw,
  XCircle,
} from 'lucide-react'
import type { TemplateCodeContext } from '../../code'

// ─── Types & data ─────────────────────────────────────────────────────────────

type RunStatus = 'success' | 'running' | 'failed' | 'queued'

interface PipelineStep {
  name: string
  status: RunStatus
  duration?: string
}

interface PipelineRun {
  id: string
  pipeline: string
  branch: string
  commit: string
  status: RunStatus
  duration: string
  startedAt: string
  triggeredBy: string
  steps: PipelineStep[]
}

const RUNS: PipelineRun[] = [
  {
    id: 'run-4821',
    pipeline: 'api-gateway / deploy',
    branch: 'main',
    commit: 'a3f9c12',
    status: 'success',
    duration: '4m 12s',
    startedAt: 'Today, 14:32',
    triggeredBy: 'Alex Kim',
    steps: [
      { name: 'Checkout',      status: 'success', duration: '3s' },
      { name: 'Install deps',  status: 'success', duration: '42s' },
      { name: 'Type check',    status: 'success', duration: '18s' },
      { name: 'Test',          status: 'success', duration: '1m 34s' },
      { name: 'Build',         status: 'success', duration: '1m 02s' },
      { name: 'Deploy',        status: 'success', duration: '33s' },
    ],
  },
  {
    id: 'run-4820',
    pipeline: 'auth-service / ci',
    branch: 'feat/oauth2',
    commit: 'b7d2e55',
    status: 'failed',
    duration: '2m 08s',
    startedAt: 'Today, 13:51',
    triggeredBy: 'Sam Lee',
    steps: [
      { name: 'Checkout',      status: 'success', duration: '2s' },
      { name: 'Install deps',  status: 'success', duration: '39s' },
      { name: 'Type check',    status: 'success', duration: '15s' },
      { name: 'Test',          status: 'failed',  duration: '1m 12s' },
      { name: 'Build',         status: 'queued' },
      { name: 'Deploy',        status: 'queued' },
    ],
  },
  {
    id: 'run-4819',
    pipeline: 'pipeline-worker / release',
    branch: 'main',
    commit: 'c1a8f33',
    status: 'running',
    duration: '1m 45s',
    startedAt: 'Today, 13:44',
    triggeredBy: 'Jordan Park',
    steps: [
      { name: 'Checkout',      status: 'success', duration: '2s' },
      { name: 'Install deps',  status: 'success', duration: '41s' },
      { name: 'Type check',    status: 'success', duration: '17s' },
      { name: 'Test',          status: 'running' },
      { name: 'Build',         status: 'queued' },
      { name: 'Deploy',        status: 'queued' },
    ],
  },
  {
    id: 'run-4818',
    pipeline: 'scheduler / ci',
    branch: 'fix/cron-tz',
    commit: 'd4b6a90',
    status: 'success',
    duration: '3m 29s',
    startedAt: 'Today, 12:17',
    triggeredBy: 'Taylor Ro',
    steps: [
      { name: 'Checkout',      status: 'success', duration: '3s' },
      { name: 'Install deps',  status: 'success', duration: '44s' },
      { name: 'Type check',    status: 'success', duration: '19s' },
      { name: 'Test',          status: 'success', duration: '1m 50s' },
      { name: 'Build',         status: 'success', duration: '53s' },
      { name: 'Deploy',        status: 'success', duration: '0s' },
    ],
  },
  {
    id: 'run-4817',
    pipeline: 'notifier / deploy',
    branch: 'main',
    commit: 'e9c3d77',
    status: 'queued',
    duration: '—',
    startedAt: 'Today, 12:05',
    triggeredBy: 'Alex Kim',
    steps: [
      { name: 'Checkout',      status: 'queued' },
      { name: 'Install deps',  status: 'queued' },
      { name: 'Type check',    status: 'queued' },
      { name: 'Test',          status: 'queued' },
      { name: 'Build',         status: 'queued' },
      { name: 'Deploy',        status: 'queued' },
    ],
  },
]

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_ICON: Record<RunStatus, React.ReactNode> = {
  success: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
  running: <Clock        className="h-3.5 w-3.5 text-blue-500 animate-pulse" />,
  failed:  <XCircle     className="h-3.5 w-3.5 text-destructive" />,
  queued:  <Circle      className="h-3.5 w-3.5 text-muted-foreground" />,
}

const STATUS_BADGE_VARIANT: Record<RunStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  success: 'default',
  running: 'secondary',
  failed:  'destructive',
  queued:  'outline',
}

const STATUS_LABEL: Record<RunStatus, string> = {
  success: 'Success',
  running: 'Running',
  failed:  'Failed',
  queued:  'Queued',
}

// ─── Panel content ────────────────────────────────────────────────────────────

function RunPanel({ run }: { run: PipelineRun }) {
  const { close } = useSidePanel()
  return (
    <PanelTemplate
      eyebrow={run.id}
      title={run.pipeline}
      actions={
        <>
          <Button variant="ghost" size="icon-sm" title="Re-run">
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" title="Open in new tab">
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </>
      }
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => void close()}>Close</Button>
          <Button size="sm">View Logs</Button>
        </div>
      }
    >
      <PanelTemplate.Section title="Status">
        <div className="flex items-center gap-2">
          {STATUS_ICON[run.status]}
          <span className="text-sm font-medium">{STATUS_LABEL[run.status]}</span>
          <span className="text-xs text-muted-foreground">· {run.duration}</span>
        </div>
      </PanelTemplate.Section>

      <PanelTemplate.Section title="Details">
        <div className="space-y-2 text-sm">
          {[
            ['Branch',      run.branch],
            ['Commit',      run.commit],
            ['Started',     run.startedAt],
            ['Triggered by', run.triggeredBy],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-24 shrink-0 text-xs text-muted-foreground">{label}</span>
              <span className="min-w-0 truncate font-mono text-xs">{value}</span>
            </div>
          ))}
        </div>
      </PanelTemplate.Section>

      <PanelTemplate.Section title="Steps">
        <div className="space-y-1">
          {run.steps.map((step) => (
            <div
              key={step.name}
              className="flex items-center gap-2.5 rounded-(--radius) px-2 py-1.5 hover:bg-muted/50"
            >
              <span className="shrink-0">{STATUS_ICON[step.status]}</span>
              <span className={cn('flex-1 text-xs', step.status === 'queued' && 'text-muted-foreground')}>
                {step.name}
              </span>
              {step.duration && (
                <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                  {step.duration}
                </span>
              )}
            </div>
          ))}
        </div>
      </PanelTemplate.Section>
    </PanelTemplate>
  )
}

// ─── Run list row ─────────────────────────────────────────────────────────────

function RunRow({ run, onOpen }: { run: PipelineRun; onOpen: (run: PipelineRun) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(run)}
      className="flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-muted/40 last:border-b-0"
    >
      <span className="shrink-0">{STATUS_ICON[run.status]}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{run.pipeline}</p>
        <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
          {run.branch} · {run.commit}
        </p>
      </div>
      <div className="hidden shrink-0 items-center gap-2 sm:flex">
        <Badge variant={STATUS_BADGE_VARIANT[run.status]} className="text-[10px] px-1.5 py-0">
          {STATUS_LABEL[run.status]}
        </Badge>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-mono text-xs text-muted-foreground">{run.duration}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">{run.triggeredBy}</p>
      </div>
    </button>
  )
}

// ─── Inner demo (needs useSidePanel) ─────────────────────────────────────────

function PanelTemplateDemoInner({ theme }: { theme?: React.CSSProperties }) {
  const { open } = useSidePanel()

  const openRun = (run: PipelineRun) => {
    open(<RunPanel run={run} />, { size: 440, resizable: true })
  }

  return (
    <DataPage className="layout-panel" style={theme}>
      <div className="shrink-0">
        <PageTopBar
          left="CI/CD / Pipeline Runs"
          right={
            <Button size="sm" className="h-7 gap-1.5 text-xs">
              <Play className="h-3 w-3" />
              Trigger Run
            </Button>
          }
        />
      </div>
      <DataPage.Header>
        <DataPage.TitleBlock title="Pipeline Runs" description="Click any run to inspect details in the side panel." />
        <DataPage.Actions>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <AlertCircle className="h-3 w-3 text-destructive" />
              1 failed
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3 text-blue-500" />
              1 running
            </Badge>
          </div>
        </DataPage.Actions>
      </DataPage.Header>
      <DataPage.Content padding="none">
        <div className="overflow-auto h-full">
          <div className="divide-y divide-border">
            {RUNS.map((run) => (
              <RunRow key={run.id} run={run} onOpen={openRun} />
            ))}
          </div>
        </div>
      </DataPage.Content>
    </DataPage>
  )
}

// ─── Exported demo ────────────────────────────────────────────────────────────

export function PanelTemplateDemo({ theme }: { theme?: React.CSSProperties }) {
  return (
    <SidePanelProvider className="flex-1 min-h-0">
      <PanelTemplateDemoInner theme={theme} />
    </SidePanelProvider>
  )
}

export function buildPanelTemplateCode({ themeProp }: TemplateCodeContext) {
  return [
    `import { PanelTemplate, DataPage, PageTopBar } from '@loykin/designkit'`,
    `import { SidePanelProvider, useSidePanel } from '@loykin/side-panel'`,
    `import '@loykin/side-panel/styles'`,
    ``,
    `function ItemPanel({ item }: { item: Item }) {`,
    `  const { close } = useSidePanel()`,
    `  return (`,
    `    <PanelTemplate`,
    `      eyebrow={item.id}`,
    `      title={item.name}`,
    `      actions={<Button variant="ghost" size="icon-sm"><ExternalLink className="h-3.5 w-3.5" /></Button>}`,
    `      footer={`,
    `        <div className="flex justify-end gap-2">`,
    `          <Button variant="outline" size="sm" onClick={() => void close()}>Close</Button>`,
    `          <Button size="sm">Save</Button>`,
    `        </div>`,
    `      }`,
    `    >`,
    `      <PanelTemplate.Section title="Details">`,
    `        {/* detail fields */}`,
    `      </PanelTemplate.Section>`,
    `      <PanelTemplate.Section title="Steps">`,
    `        {/* steps or sub-items */}`,
    `      </PanelTemplate.Section>`,
    `    </PanelTemplate>`,
    `  )`,
    `}`,
    ``,
    `function MyPage() {`,
    `  const { open } = useSidePanel()`,
    `  return (`,
    `    <SidePanelProvider>`,
    `      <DataPage${themeProp}>`,
    `        <PageTopBar left="My Page" />`,
    `        {/* list of items — click to open panel */}`,
    `        {items.map((item) => (`,
    `          <button key={item.id} onClick={() => open(<ItemPanel item={item} />, { size: 440 })}>`,
    `            {item.name}`,
    `          </button>`,
    `        ))}`,
    `      </DataPage>`,
    `    </SidePanelProvider>`,
    `  )`,
    `}`,
  ].join('\n')
}
