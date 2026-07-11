import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { DataGrid, type DataGridColumnDef } from '@loykin/gridkit'
import {
  Badge,
  Button,
  DataBodyTemplate,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@loykin/designkit'
import { Database, MoreVertical, RefreshCw, Search } from 'lucide-react'

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

const pods: PodRow[] = [
  { id: '1', name: 'coredns-668d6bf9bc-2kqnf', namespace: 'kube-system', ready: '1/1', restarts: 0, controlledBy: 'ReplicaSet', node: 'desktop-control-plane', qos: 'Burstable', age: '12d', status: 'Running' },
  { id: '2', name: 'coredns-668d6bf9bc-rj24f', namespace: 'kube-system', ready: '1/1', restarts: 0, controlledBy: 'ReplicaSet', node: 'desktop-control-plane', qos: 'Burstable', age: '12d', status: 'Running' },
  { id: '3', name: 'etcd-desktop-control-plane', namespace: 'kube-system', ready: '1/1', restarts: 0, controlledBy: 'Node', node: 'desktop-control-plane', qos: 'Burstable', age: '12d', status: 'Running' },
  { id: '4', name: 'kindnet-7z8lm', namespace: 'kube-system', ready: '1/1', restarts: 1, controlledBy: 'DaemonSet', node: 'desktop-control-plane', qos: 'Guaranteed', age: '12d', status: 'Running' },
  { id: '5', name: 'kube-apiserver-desktop-control-plane', namespace: 'kube-system', ready: '1/1', restarts: 0, controlledBy: 'Node', node: 'desktop-control-plane', qos: 'Burstable', age: '12d', status: 'Running' },
  { id: '6', name: 'metrics-server-75bf66d978-9kb8m', namespace: 'kube-system', ready: '1/1', restarts: 2, controlledBy: 'ReplicaSet', node: 'desktop-control-plane', qos: 'Burstable', age: '8d', status: 'Running' },
  { id: '7', name: 'piper-agent-77d7c8d7b9-xkc2z', namespace: 'default', ready: '1/1', restarts: 0, controlledBy: 'ReplicaSet', node: 'desktop-worker', qos: 'BestEffort', age: '3h', status: 'Running' },
  { id: '8', name: 'piper-agent-job-29188410-g4m9w', namespace: 'default', ready: '0/1', restarts: 0, controlledBy: 'Job', node: 'desktop-worker', qos: 'BestEffort', age: '22m', status: 'Succeeded' },
  { id: '9', name: 'registry-6f6bf57c9f-2p4ln', namespace: 'default', ready: '0/1', restarts: 4, controlledBy: 'ReplicaSet', node: 'desktop-worker', qos: 'Burstable', age: '51m', status: 'Failed' },
  { id: '10', name: 'web-6db6f8c9f8-jt6s4', namespace: 'production', ready: '0/1', restarts: 0, controlledBy: 'ReplicaSet', node: 'desktop-worker', qos: 'Burstable', age: '4m', status: 'Pending' },
]

const workloadTabs = [
  ['overview', 'Overview'],
  ['pods', 'Pods'],
  ['deployments', 'Deployments'],
  ['daemonsets', 'DaemonSets'],
  ['statefulsets', 'StatefulSets'],
  ['replicasets', 'ReplicaSets'],
  ['jobs', 'Jobs'],
  ['cronjobs', 'CronJobs'],
] as const

const statusVariant = {
  Running: 'default',
  Succeeded: 'secondary',
  Failed: 'destructive',
  Pending: 'outline',
} as const

const columns: DataGridColumnDef<PodRow>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: 270,
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: 'namespace',
    header: 'Namespace',
    cell: ({ row }) => <span className="text-primary underline-offset-2 hover:underline">{row.original.namespace}</span>,
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
    size: 42,
    header: () => null,
    cell: () => (
      <Button variant="ghost" size="icon-xs" aria-label="Pod actions">
        <MoreVertical />
      </Button>
    ),
  },
]

export function KubernetesMonitoringDemo({ theme }: { theme?: CSSProperties }) {
  const [activeResource, setActiveResource] = useState('pods')
  const [namespace, setNamespace] = useState('all')
  const [search, setSearch] = useState('')

  const visiblePods = useMemo(() => {
    const query = search.trim().toLowerCase()
    return pods.filter(
      (pod) =>
        (namespace === 'all' || pod.namespace === namespace) &&
        (!query || pod.name.toLowerCase().includes(query) || pod.namespace.toLowerCase().includes(query)),
    )
  }, [namespace, search])

  const activeLabel = workloadTabs.find(([id]) => id === activeResource)?.[1] ?? 'Pods'

  return (
    <DataBodyTemplate
      theme={theme}
      className="layout-databody-kubernetes"
      title={activeLabel}
      description={`${visiblePods.length} resources in docker-desktop`}
      activeTab={activeResource}
      onTabChange={setActiveResource}
      contentClassName="min-h-0"
      actions={
        <Button variant="outline" size="sm">
          <RefreshCw />
          Refresh
        </Button>
      }
      toolbarLeft={
        <>
          <Select value={namespace} onValueChange={(value) => value && setNamespace(value)}>
            <SelectTrigger className="w-44">
              <Database />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All namespaces</SelectItem>
              <SelectItem value="default">default</SelectItem>
              <SelectItem value="kube-system">kube-system</SelectItem>
              <SelectItem value="production">production</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Search ${activeLabel.toLowerCase()}...`}
              className="pl-8"
            />
          </div>
        </>
      }
    >
      {workloadTabs.map(([id, label]) => (
        <DataBodyTemplate.Tab key={id} id={id} label={label} count={id === 'pods' ? visiblePods.length : undefined}>
          <div className="h-[calc(100vh-17rem)] min-h-72">
            <DataGrid
              data={visiblePods}
              columns={columns}
              getRowId={(row) => row.id}
              tableWidthMode="fill-last"
              fillParent
            />
          </div>
        </DataBodyTemplate.Tab>
      ))}
    </DataBodyTemplate>
  )
}
