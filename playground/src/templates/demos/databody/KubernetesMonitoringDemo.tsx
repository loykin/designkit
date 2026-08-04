import { useMemo } from 'react'
import type { CSSProperties, MouseEvent } from 'react'
import type { Table } from '@tanstack/react-table'
import { DataGrid, GlobalSearch, type DataGridColumnDef } from '@loykin/gridkit'
import { ControlBar, ControlBarProvider, registerTabType, useControlBar } from '@loykin/control-bar'
import { SidePanelProvider, useSidePanel } from '@loykin/side-panel'
import { FilterInput, type FilterInputConfig } from '@loykin/filter-input'
import { Badge, Button, DataBodyTemplate, PageTopBar, PanelTemplate } from '@loykin/designkit'
import { Clock3, RefreshCw, ScrollText, SquareTerminal, X } from 'lucide-react'

type PodStatus = 'Running' | 'Succeeded' | 'Failed' | 'Pending'

interface PodRow {
  id: string
  name: string
  namespace: string
  ready: string
  restarts: number
  controlledBy: string
  node: string
  qos: string
  age: string
  status: PodStatus
}

interface PodPanelData {
  pod: string
  namespace: string
  container: string
}

interface ClusterEventData {
  cluster: string
}

interface PodsResourceProps {
  pods: PodRow[]
}

interface PodDetailPanelProps {
  pod: PodRow
  onOpenLogs: () => void
  onOpenShell: () => void
}

const pods: PodRow[] = [
  {
    id: '1',
    name: 'coredns-668d6bf9bc-2kqnf',
    namespace: 'kube-system',
    ready: '1/1',
    restarts: 0,
    controlledBy: 'ReplicaSet',
    node: 'desktop-control-plane',
    qos: 'Burstable',
    age: '12d',
    status: 'Running',
  },
  {
    id: '2',
    name: 'coredns-668d6bf9bc-rj24f',
    namespace: 'kube-system',
    ready: '1/1',
    restarts: 0,
    controlledBy: 'ReplicaSet',
    node: 'desktop-control-plane',
    qos: 'Burstable',
    age: '12d',
    status: 'Running',
  },
  {
    id: '3',
    name: 'etcd-desktop-control-plane',
    namespace: 'kube-system',
    ready: '1/1',
    restarts: 0,
    controlledBy: 'Node',
    node: 'desktop-control-plane',
    qos: 'Burstable',
    age: '12d',
    status: 'Running',
  },
  {
    id: '4',
    name: 'kindnet-7z8lm',
    namespace: 'kube-system',
    ready: '1/1',
    restarts: 1,
    controlledBy: 'DaemonSet',
    node: 'desktop-control-plane',
    qos: 'Guaranteed',
    age: '12d',
    status: 'Running',
  },
  {
    id: '5',
    name: 'kube-apiserver-desktop-control-plane',
    namespace: 'kube-system',
    ready: '1/1',
    restarts: 0,
    controlledBy: 'Node',
    node: 'desktop-control-plane',
    qos: 'Burstable',
    age: '12d',
    status: 'Running',
  },
  {
    id: '6',
    name: 'metrics-server-75bf66d978-9kb8m',
    namespace: 'kube-system',
    ready: '1/1',
    restarts: 2,
    controlledBy: 'ReplicaSet',
    node: 'desktop-control-plane',
    qos: 'Burstable',
    age: '8d',
    status: 'Running',
  },
  {
    id: '7',
    name: 'piper-agent-77d7c8d7b9-xkc2z',
    namespace: 'default',
    ready: '1/1',
    restarts: 0,
    controlledBy: 'ReplicaSet',
    node: 'desktop-worker',
    qos: 'BestEffort',
    age: '3h',
    status: 'Running',
  },
  {
    id: '8',
    name: 'piper-agent-job-29188410-g4m9w',
    namespace: 'default',
    ready: '0/1',
    restarts: 0,
    controlledBy: 'Job',
    node: 'desktop-worker',
    qos: 'BestEffort',
    age: '22m',
    status: 'Succeeded',
  },
  {
    id: '9',
    name: 'registry-6f6bf57c9f-2p4ln',
    namespace: 'default',
    ready: '0/1',
    restarts: 4,
    controlledBy: 'ReplicaSet',
    node: 'desktop-worker',
    qos: 'Burstable',
    age: '51m',
    status: 'Failed',
  },
  {
    id: '10',
    name: 'web-6db6f8c9f8-jt6s4',
    namespace: 'production',
    ready: '0/1',
    restarts: 0,
    controlledBy: 'ReplicaSet',
    node: 'desktop-worker',
    qos: 'Burstable',
    age: '4m',
    status: 'Pending',
  },
]

const namespaces = Array.from(new Set(pods.map((pod) => pod.namespace))).sort()

const namespaceFilterConfig: FilterInputConfig = {
  key: 'namespace',
  type: 'select',
  placeholder: 'Namespace',
  options: namespaces.map((namespace) => ({ label: namespace, value: namespace })),
  behavior: { clearable: true },
}

const statusVariant = {
  Running: 'default',
  Succeeded: 'secondary',
  Failed: 'destructive',
  Pending: 'outline',
} as const

function LogPanel({ pod, namespace, container }: PodPanelData) {
  return (
    <div className="h-full overflow-auto bg-background p-3 font-mono text-xs leading-5 text-foreground">
      <div className="mb-2 text-muted-foreground">
        Streaming {namespace}/{pod} · container/{container}
      </div>
      <div>2026-08-03T01:42:11.306Z INFO starting health probe server on :8081</div>
      <div>2026-08-03T01:42:11.448Z INFO connected to kubernetes API</div>
      <div>2026-08-03T01:42:12.021Z INFO cache synchronization completed</div>
      <div className="text-primary">2026-08-03T01:42:16.912Z INFO ready to receive traffic</div>
    </div>
  )
}

function ShellPanel({ pod, namespace, container }: PodPanelData) {
  return (
    <div className="h-full overflow-auto bg-background p-3 font-mono text-xs leading-5 text-foreground">
      <div className="mb-2 text-muted-foreground">
        kubectl exec · {namespace}/{pod} · {container}
      </div>
      <div>
        $ kubectl exec -it {pod} -n {namespace} -- /bin/sh
      </div>
      <div className="text-primary">/{' #'} _</div>
    </div>
  )
}

function ClusterEventsPanel({ cluster }: ClusterEventData) {
  return (
    <div className="h-full overflow-auto bg-background p-3 text-xs text-foreground">
      <div className="mb-2 font-medium">Events · {cluster}</div>
      <div className="grid grid-cols-[5rem_6rem_minmax(0,1fr)] gap-x-3 gap-y-2 font-mono">
        <span className="text-muted-foreground">2m</span>
        <span>Normal</span>
        <span>Scheduled production/web-6db6f8c9f8-jt6s4 on desktop-worker</span>
        <span className="text-muted-foreground">7m</span>
        <span className="text-destructive">Warning</span>
        <span>BackOff restarting failed container registry</span>
        <span className="text-muted-foreground">18m</span>
        <span>Normal</span>
        <span>Completed job/default/piper-agent-job-29188410</span>
      </div>
    </div>
  )
}

function PodDetailPanel({ pod, onOpenLogs, onOpenShell }: PodDetailPanelProps) {
  const { close } = useSidePanel()

  return (
    <PanelTemplate
      eyebrow={`Pod · ${pod.namespace}`}
      title={pod.name}
      status={<Badge variant={statusVariant[pod.status]}>{pod.status}</Badge>}
      actions={
        <>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Open shell for ${pod.name}`}
            onClick={onOpenShell}
          >
            <SquareTerminal />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Open logs for ${pod.name}`}
            onClick={onOpenLogs}
          >
            <ScrollText />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Close" onClick={() => void close()}>
            <X />
          </Button>
        </>
      }
    >
      <PanelTemplate.Section title="Overview">
        <dl className="space-y-2">
          <PanelTemplate.Row label="Status">{pod.status}</PanelTemplate.Row>
          <PanelTemplate.Row label="Ready">{pod.ready}</PanelTemplate.Row>
          <PanelTemplate.Row label="Restarts">{pod.restarts}</PanelTemplate.Row>
          <PanelTemplate.Row label="Age">{pod.age}</PanelTemplate.Row>
        </dl>
      </PanelTemplate.Section>

      <PanelTemplate.Section title="Placement">
        <dl className="space-y-2">
          <PanelTemplate.Row label="Node">{pod.node}</PanelTemplate.Row>
          <PanelTemplate.Row label="Controlled by">{pod.controlledBy}</PanelTemplate.Row>
          <PanelTemplate.Row label="QoS class">{pod.qos}</PanelTemplate.Row>
        </dl>
      </PanelTemplate.Section>

      <PanelTemplate.Section title="Identity">
        <dl className="space-y-2">
          <PanelTemplate.Row label="Namespace">{pod.namespace}</PanelTemplate.Row>
          <PanelTemplate.Row label="Name">{pod.name}</PanelTemplate.Row>
        </dl>
      </PanelTemplate.Section>
    </PanelTemplate>
  )
}

registerTabType<PodPanelData>('kubernetes-logs', {
  label: 'Logs',
  icon: <ScrollText className="size-3.5" />,
  render: (data) => <LogPanel {...data} />,
})

registerTabType<PodPanelData>('kubernetes-shell', {
  label: 'Shell',
  icon: <SquareTerminal className="size-3.5" />,
  render: (data) => <ShellPanel {...data} />,
})

registerTabType<ClusterEventData>('kubernetes-events', {
  label: 'Events',
  icon: <Clock3 className="size-3.5" />,
  render: (data) => <ClusterEventsPanel {...data} />,
})

function NamespaceFilter({ table }: { table: Table<PodRow> }) {
  const column = table.getColumn('namespace')
  const value = (column?.getFilterValue() as string | undefined) ?? null

  return (
    <FilterInput
      config={namespaceFilterConfig}
      value={value}
      onChange={(next) => column?.setFilterValue(next ?? undefined)}
    />
  )
}

function PodsResource({ pods }: PodsResourceProps) {
  const { open, activate, tabs } = useControlBar()
  const { open: openSidePanel } = useSidePanel()

  const openPodPanel = (type: 'kubernetes-logs' | 'kubernetes-shell', pod: PodRow) => {
    const label = `${type === 'kubernetes-logs' ? 'Logs' : 'Shell'} · ${pod.name}`
    const existingTab = tabs.find((tab) => tab.type === type && tab.label === label)

    if (existingTab) {
      activate(existingTab.id)
      return
    }

    open<PodPanelData>({
      type,
      label,
      data: { pod: pod.name, namespace: pod.namespace, container: pod.name.split('-')[0] },
    })
  }

  const openPodDetails = (pod: PodRow) => {
    openSidePanel(
      <PodDetailPanel
        pod={pod}
        onOpenLogs={() => openPodPanel('kubernetes-logs', pod)}
        onOpenShell={() => openPodPanel('kubernetes-shell', pod)}
      />,
      { side: 'right', size: 420, minSize: 340, maxSize: 560, resizable: true },
    )
  }

  const openClusterEvents = () => {
    const existingTab = tabs.find((tab) => tab.type === 'kubernetes-events')
    if (existingTab) {
      activate(existingTab.id)
      return
    }

    open<ClusterEventData>({
      type: 'kubernetes-events',
      label: 'Cluster events',
      data: { cluster: 'docker-desktop' },
    })
  }

  const columns = useMemo<DataGridColumnDef<PodRow>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 270,
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      },
      {
        accessorKey: 'namespace',
        header: 'Namespace',
        cell: ({ row }) => <span className="text-primary">{row.original.namespace}</span>,
      },
      { accessorKey: 'ready', header: 'Ready', size: 72 },
      { accessorKey: 'restarts', header: 'Restarts', size: 82 },
      {
        accessorKey: 'controlledBy',
        header: 'Controlled By',
        cell: ({ row }) => <span className="text-primary">{row.original.controlledBy}</span>,
      },
      {
        accessorKey: 'node',
        header: 'Node',
        cell: ({ row }) => <span className="text-primary">{row.original.node}</span>,
      },
      { accessorKey: 'qos', header: 'QoS', size: 100 },
      { accessorKey: 'age', header: 'Age', size: 70 },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 110,
        cell: ({ row }) => (
          <Badge variant={statusVariant[row.original.status]} className="font-normal">
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: 'actions',
        size: 76,
        header: () => null,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-0.5">
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={`Open logs for ${row.original.name}`}
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation()
                openPodPanel('kubernetes-logs', row.original)
              }}
            >
              <ScrollText />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={`Open shell for ${row.original.name}`}
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation()
                openPodPanel('kubernetes-shell', row.original)
              }}
            >
              <SquareTerminal />
            </Button>
          </div>
        ),
      },
    ],
    [activate, open, tabs],
  )

  return (
    <DataGrid
      data={pods}
      columns={columns}
      getRowId={(row) => row.id}
      onRowClick={openPodDetails}
      rowCursor
      tableWidthMode="fill-last"
      fillParent
      headerLeft={(table) => (
        <>
          <GlobalSearch table={table} placeholder="Search pods..." />
          <NamespaceFilter table={table} />
        </>
      )}
      headerRight={
        <>
          <Button variant="ghost" size="sm" onClick={openClusterEvents}>
            <Clock3 />
            Events
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-[var(--gridkit-radius)] text-xs"
          >
            <RefreshCw />
            Refresh
          </Button>
        </>
      }
    />
  )
}

function KubernetesControlDock() {
  // TODO(basekit): remove this wrapper once @loykin/control-bar's <ControlBar>
  // supports an always-visible empty state (see
  // basekit/docs/control-bar-always-visible-dock.md). The guide requires the
  // dock to stay visible at zero tabs; ControlBar currently unmounts instead.
  const { tabs } = useControlBar()

  if (tabs.length === 0) {
    return (
      <div
        aria-label="Resource panels"
        className="flex h-9 shrink-0 items-center border-t border-border bg-muted/50 px-3 text-xs text-muted-foreground"
      >
        No active resource panels
      </div>
    )
  }

  return <ControlBar />
}

interface KubernetesWorkspaceProps {
  theme?: CSSProperties
  guide?: boolean
}

function KubernetesWorkspace({ theme, guide = false }: KubernetesWorkspaceProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden" style={theme}>
      <div className="min-h-0 flex-1">
        <DataBodyTemplate
          theme={theme}
          className={guide ? 'layout-guide-kubernetes-workspace' : 'layout-databody-kubernetes'}
          topBar={
            <PageTopBar
              left={
                guide
                  ? 'Guides / Operations / Kubernetes Workspace'
                  : 'Kubernetes / docker-desktop / Workloads'
              }
            />
          }
          title="Pods"
          description="Inspect workload health and open logs or a shell without leaving the resource list."
          contentClassName="min-h-0 pb-(--designkit-page-padding-x)"
        >
          <DataBodyTemplate.Body className="h-full min-h-0">
            <PodsResource pods={pods} />
          </DataBodyTemplate.Body>
        </DataBodyTemplate>
      </div>
      <KubernetesControlDock />
    </div>
  )
}

export function KubernetesMonitoringDemo({ theme }: { theme?: CSSProperties }) {
  return (
    <ControlBarProvider persistKey="designkit-kubernetes-workspace-v2">
      <SidePanelProvider className="layout-databody-kubernetes h-full min-h-0" style={theme}>
        <KubernetesWorkspace theme={theme} />
      </SidePanelProvider>
    </ControlBarProvider>
  )
}

export function KubernetesWorkspaceGuide({ theme }: { theme?: CSSProperties }) {
  return (
    <ControlBarProvider persistKey="designkit-kubernetes-workspace-guide-v1">
      <SidePanelProvider
        className="layout-guide-kubernetes-workspace h-full min-h-0"
        style={theme}
      >
        <KubernetesWorkspace theme={theme} guide />
      </SidePanelProvider>
    </ControlBarProvider>
  )
}
