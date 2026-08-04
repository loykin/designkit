import { useState } from 'react'
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { DataGrid, DataGridPaginationBar, type DataGridColumnDef } from '@loykin/gridkit'
import {
  Badge,
  Button,
  DataBodyTemplate,
  Input,
  Label,
  PageBreadcrumb,
  PageTopBar,
  PanelTemplate,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@loykin/designkit'
import { SidePanelProvider, useSidePanel } from '@loykin/side-panel'
import { Filter, Plus, Search } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import type { SortingState } from '@tanstack/react-table'

type UserRole = 'Admin' | 'Editor' | 'Viewer'
type UserStatus = 'active' | 'invited' | 'suspended'

type User = {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  lastSeen: string
}

type Session = {
  id: string
  user: string
  device: string
  location: string
  status: 'active' | 'expired'
  lastActive: string
}

type HistoryEvent = {
  id: string
  actor: string
  action: 'user.created' | 'role.changed' | 'session.revoked'
  target: string
  occurredAt: string
  sequence: number
}

type PageResult<T> = {
  items: T[]
  total: number
}

const PAGE_SIZE = 6

const names = [
  'Sarah Kim',
  'Marcus Lee',
  'Ji-Yeon Park',
  'Alex Chen',
  'Dana White',
  'Leo Torres',
  'Mina Seo',
  'Ryan Patel',
  'Yuna Choi',
  'Tom Fischer',
  'Nora Singh',
  'Daniel Cho',
  'Amelia Garcia',
  'Jun Ito',
  'Priya Shah',
  'Owen Miller',
  'Sofia Rossi',
  'Noah Wilson',
]

let users: User[] = names.map((name, index) => ({
  id: `usr-${index + 1}`,
  name,
  email: `${name
    .toLowerCase()
    .replace(/[^a-z]+/g, '.')
    .replace(/\.$/, '')}@acme.com`,
  role: (['Admin', 'Editor', 'Viewer'] as const)[index % 3],
  status: (['active', 'active', 'invited', 'suspended'] as const)[index % 4],
  lastSeen: index % 4 === 2 ? 'Invitation pending' : `${index + 2} min ago`,
}))

const sessions: Session[] = names.slice(0, 15).map((name, index) => ({
  id: `ses-${index + 1}`,
  user: name,
  device: index % 2 === 0 ? 'Chrome on macOS' : 'Safari on iPhone',
  location: index % 3 === 0 ? 'Seoul, KR' : index % 3 === 1 ? 'Tokyo, JP' : 'Singapore, SG',
  status: index % 5 === 0 ? 'expired' : 'active',
  lastActive: `${index + 1} min ago`,
}))

let history: HistoryEvent[] = names.slice(0, 16).map((name, index) => ({
  id: `evt-${index + 1}`,
  actor: index % 3 === 0 ? 'System' : names[(index + 2) % names.length],
  action: (['user.created', 'role.changed', 'session.revoked'] as const)[index % 3],
  target: name,
  occurredAt: `${index + 1} hours ago`,
  sequence: names.length - index,
}))

const USERS_INITIAL_SORT: SortingState = [{ id: 'name', desc: false }]
const SESSIONS_INITIAL_SORT: SortingState = [{ id: 'user', desc: false }]
const HISTORY_INITIAL_SORT: SortingState = [{ id: 'occurredAt', desc: true }]

function sortRows<T>(
  rows: T[],
  sorting: SortingState,
  accessors: Record<string, (row: T) => string | number>,
) {
  const sort = sorting[0]
  const accessor = sort ? accessors[sort.id] : undefined
  if (!sort || !accessor) return rows

  return [...rows].sort((left, right) => {
    const leftValue = accessor(left)
    const rightValue = accessor(right)
    const comparison =
      typeof leftValue === 'number' && typeof rightValue === 'number'
        ? leftValue - rightValue
        : String(leftValue).localeCompare(String(rightValue))
    return sort.desc ? -comparison : comparison
  })
}

async function waitForMockApi() {
  await new Promise((resolve) => window.setTimeout(resolve, 550))
}

function paginate<T>(rows: T[], page: number): PageResult<T> {
  const start = (page - 1) * PAGE_SIZE
  return { items: rows.slice(start, start + PAGE_SIZE), total: rows.length }
}

async function listUsers(search: string, role: string, page: number, sorting: SortingState) {
  await waitForMockApi()
  const query = search.trim().toLowerCase()
  const filtered = users.filter(
    (user) =>
      (!query || `${user.name} ${user.email}`.toLowerCase().includes(query)) &&
      (role === 'all' || user.role === role),
  )
  return paginate(
    sortRows(filtered, sorting, {
      name: (user) => user.name,
      role: (user) => user.role,
      status: (user) => user.status,
    }),
    page,
  )
}

async function createUser(input: { name: string; email: string; role: UserRole }) {
  await waitForMockApi()
  const id = `usr-${Date.now()}`
  const user: User = {
    id,
    ...input,
    status: 'invited',
    lastSeen: 'Invitation pending',
  }
  users = [user, ...users]
  history = [
    {
      id: `evt-${Date.now()}`,
      actor: 'Current admin',
      action: 'user.created',
      target: user.name,
      occurredAt: 'Just now',
      sequence: Date.now(),
    },
    ...history,
  ]
  return user
}

async function listSessions(search: string, status: string, page: number, sorting: SortingState) {
  await waitForMockApi()
  const query = search.trim().toLowerCase()
  return paginate(
    sortRows(
      sessions.filter(
        (session) =>
          (!query || `${session.user} ${session.device}`.toLowerCase().includes(query)) &&
          (status === 'all' || session.status === status),
      ),
      sorting,
      {
        user: (session) => session.user,
        device: (session) => session.device,
        location: (session) => session.location,
        status: (session) => session.status,
      },
    ),
    page,
  )
}

async function listHistory(search: string, action: string, page: number, sorting: SortingState) {
  await waitForMockApi()
  const query = search.trim().toLowerCase()
  return paginate(
    sortRows(
      history.filter(
        (event) =>
          (!query || `${event.actor} ${event.target}`.toLowerCase().includes(query)) &&
          (action === 'all' || event.action === action),
      ),
      sorting,
      {
        actor: (event) => event.actor,
        action: (event) => event.action,
        target: (event) => event.target,
        occurredAt: (event) => event.sequence,
      },
    ),
    page,
  )
}

const userColumns: DataGridColumnDef<User>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'User',
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.email}</p>
      </div>
    ),
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <Badge variant="outline">{row.original.role}</Badge>,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
        {row.original.status}
      </Badge>
    ),
  },
  { id: 'lastSeen', accessorKey: 'lastSeen', header: 'Last seen', enableSorting: false },
]

const sessionColumns: DataGridColumnDef<Session>[] = [
  { id: 'user', accessorKey: 'user', header: 'User' },
  { id: 'device', accessorKey: 'device', header: 'Device' },
  { id: 'location', accessorKey: 'location', header: 'Location' },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <Badge variant="outline">{row.original.status}</Badge>,
  },
  { id: 'lastActive', accessorKey: 'lastActive', header: 'Last active', enableSorting: false },
]

const historyColumns: DataGridColumnDef<HistoryEvent>[] = [
  { id: 'actor', accessorKey: 'actor', header: 'Actor' },
  {
    id: 'action',
    accessorKey: 'action',
    header: 'Event',
    cell: ({ row }) => <code className="text-xs">{row.original.action}</code>,
  },
  { id: 'target', accessorKey: 'target', header: 'Target' },
  {
    id: 'occurredAt',
    accessorFn: (event) => event.sequence,
    header: 'Occurred',
    cell: ({ row }) => row.original.occurredAt,
  },
]

function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-7 w-56 pl-8 text-xs"
      />
    </div>
  )
}

function UserPanel({ user }: { user: User }) {
  const { close } = useSidePanel()
  return (
    <PanelTemplate
      eyebrow="User"
      title={user.name}
      footer={
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => void close()}>
            Close
          </Button>
        </div>
      }
    >
      <PanelTemplate.Section title="Details">
        <dl className="space-y-2">
          <PanelTemplate.Row label="Email">{user.email}</PanelTemplate.Row>
          <PanelTemplate.Row label="Role">{user.role}</PanelTemplate.Row>
          <PanelTemplate.Row label="Status" className="capitalize">
            {user.status}
          </PanelTemplate.Row>
        </dl>
      </PanelTemplate.Section>
    </PanelTemplate>
  )
}

function UsersTab({ onAddUser }: { onAddUser: () => void }) {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('all')
  const [page, setPage] = useState(1)
  const [sorting, setSorting] = useState<SortingState>(USERS_INITIAL_SORT)
  const { open } = useSidePanel()
  const query = useQuery({
    queryKey: ['resource-guide', 'users', search, role, page, sorting],
    queryFn: () => listUsers(search, role, page, sorting),
    placeholderData: keepPreviousData,
    refetchInterval: 8_000,
  })
  const hasData = query.data !== undefined

  function resetPage(next: () => void) {
    next()
    setPage(1)
  }

  return (
    <DataBodyTemplate.Resource
      toolbarLeft={
        <>
          <SearchField
            value={search}
            onChange={(value) => resetPage(() => setSearch(value))}
            placeholder="Search users…"
          />
          <Select value={role} onValueChange={(value) => resetPage(() => setRole(value ?? 'all'))}>
            <SelectTrigger size="sm" aria-label="Filter by role">
              <Filter />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Editor">Editor</SelectItem>
              <SelectItem value="Viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </>
      }
      toolbarRight={
        <Button size="sm" onClick={onAddUser}>
          <Plus /> Add user
        </Button>
      }
    >
      <DataGrid
        data={query.data?.items ?? []}
        columns={userColumns}
        getRowId={(row) => row.id}
        initialSorting={USERS_INITIAL_SORT}
        manualSorting
        onSortingChange={(nextSorting) => {
          setSorting(nextSorting)
          setPage(1)
        }}
        isLoading={query.isPending && !hasData}
        emptyMessage="No users match the current filters."
        tableWidthMode="fill-last"
        classNames={{ footer: 'pt-3' }}
        rowHeight={48}
        rowCursor
        onRowClick={(user) => open(<UserPanel user={user} />, { side: 'right', size: 420, resizable: true })}
        pagination={{
          pageSize: PAGE_SIZE,
          pageIndex: page - 1,
          pageCount: Math.max(1, Math.ceil((query.data?.total ?? 0) / PAGE_SIZE)),
          onPageChange: (pageIndex) => setPage(pageIndex + 1),
        }}
        footer={(table) => (
          <DataGridPaginationBar
            table={table}
            totalCount={query.data?.total ?? 0}
            pageSizes={[PAGE_SIZE]}
          />
        )}
      />
    </DataBodyTemplate.Resource>
  )
}

function SessionsTab() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [sorting, setSorting] = useState<SortingState>(SESSIONS_INITIAL_SORT)
  const query = useQuery({
    queryKey: ['resource-guide', 'sessions', search, status, page, sorting],
    queryFn: () => listSessions(search, status, page, sorting),
    placeholderData: keepPreviousData,
    refetchInterval: 8_000,
  })
  const hasData = query.data !== undefined

  return (
    <DataBodyTemplate.Resource
      toolbarLeft={
        <>
          <SearchField
            value={search}
            onChange={(value) => {
              setSearch(value)
              setPage(1)
            }}
            placeholder="Search sessions…"
          />
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value ?? 'all')
              setPage(1)
            }}
          >
            <SelectTrigger size="sm" aria-label="Filter by session status">
              <Filter />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sessions</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </>
      }
    >
      <DataGrid
        data={query.data?.items ?? []}
        columns={sessionColumns}
        getRowId={(row) => row.id}
        initialSorting={SESSIONS_INITIAL_SORT}
        manualSorting
        onSortingChange={(nextSorting) => {
          setSorting(nextSorting)
          setPage(1)
        }}
        isLoading={query.isPending && !hasData}
        emptyMessage="No sessions match the current filters."
        tableWidthMode="fill-last"
        classNames={{ footer: 'pt-3' }}
        rowHeight={44}
        pagination={{
          pageSize: PAGE_SIZE,
          pageIndex: page - 1,
          pageCount: Math.max(1, Math.ceil((query.data?.total ?? 0) / PAGE_SIZE)),
          onPageChange: (pageIndex) => setPage(pageIndex + 1),
        }}
        footer={(table) => (
          <DataGridPaginationBar
            table={table}
            totalCount={query.data?.total ?? 0}
            pageSizes={[PAGE_SIZE]}
          />
        )}
      />
    </DataBodyTemplate.Resource>
  )
}

function HistoryTab() {
  const [search, setSearch] = useState('')
  const [action, setAction] = useState('all')
  const [page, setPage] = useState(1)
  const [sorting, setSorting] = useState<SortingState>(HISTORY_INITIAL_SORT)
  const query = useQuery({
    queryKey: ['resource-guide', 'history', search, action, page, sorting],
    queryFn: () => listHistory(search, action, page, sorting),
    placeholderData: keepPreviousData,
    refetchInterval: 8_000,
  })
  const hasData = query.data !== undefined

  return (
    <DataBodyTemplate.Resource
      toolbarLeft={
        <>
          <SearchField
            value={search}
            onChange={(value) => {
              setSearch(value)
              setPage(1)
            }}
            placeholder="Search history…"
          />
          <Select
            value={action}
            onValueChange={(value) => {
              setAction(value ?? 'all')
              setPage(1)
            }}
          >
            <SelectTrigger size="sm" aria-label="Filter by event">
              <Filter />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All events</SelectItem>
              <SelectItem value="user.created">User created</SelectItem>
              <SelectItem value="role.changed">Role changed</SelectItem>
              <SelectItem value="session.revoked">Session revoked</SelectItem>
            </SelectContent>
          </Select>
        </>
      }
    >
      <DataGrid
        data={query.data?.items ?? []}
        columns={historyColumns}
        getRowId={(row) => row.id}
        initialSorting={HISTORY_INITIAL_SORT}
        manualSorting
        onSortingChange={(nextSorting) => {
          setSorting(nextSorting)
          setPage(1)
        }}
        isLoading={query.isPending && !hasData}
        emptyMessage="No history events match the current filters."
        tableWidthMode="fill-last"
        classNames={{ footer: 'pt-3' }}
        rowHeight={44}
        pagination={{
          pageSize: PAGE_SIZE,
          pageIndex: page - 1,
          pageCount: Math.max(1, Math.ceil((query.data?.total ?? 0) / PAGE_SIZE)),
          onPageChange: (pageIndex) => setPage(pageIndex + 1),
        }}
        footer={(table) => (
          <DataGridPaginationBar
            table={table}
            totalCount={query.data?.total ?? 0}
            pageSizes={[PAGE_SIZE]}
          />
        )}
      />
    </DataBodyTemplate.Resource>
  )
}

function UserListPage({
  theme,
  onAddUser,
}: {
  theme?: React.CSSProperties
  onAddUser: () => void
}) {
  return (
    <SidePanelProvider className="h-full min-h-0">
      <DataBodyTemplate
        theme={theme}
        className="layout-databody-managed-table-guide"
        topBar={<PageTopBar left={<PageBreadcrumb items={['Data', 'Users']} />} />}
        title="Users"
        description="Canonical managed-table composition with isolated tab queries."
      >
        <DataBodyTemplate.Tab id="users" label="Users">
          <UsersTab onAddUser={onAddUser} />
        </DataBodyTemplate.Tab>
        <DataBodyTemplate.Tab id="sessions" label="Sessions">
          <SessionsTab />
        </DataBodyTemplate.Tab>
        <DataBodyTemplate.Tab id="history" label="History">
          <HistoryTab />
        </DataBodyTemplate.Tab>
      </DataBodyTemplate>
    </SidePanelProvider>
  )
}

function UserCreatePage({
  theme,
  onCancel,
  onCreated,
  listPath,
}: {
  theme?: React.CSSProperties
  onCancel: () => void
  onCreated: () => void
  listPath: string
}) {
  const queryClient = useQueryClient()
  const [name, setName] = useState('New User')
  const [email, setEmail] = useState('new.user@acme.com')
  const [role, setRole] = useState<UserRole>('Viewer')
  const create = useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['resource-guide', 'users'] }),
        queryClient.invalidateQueries({ queryKey: ['resource-guide', 'history'] }),
      ])
      onCreated()
    },
  })

  return (
    <DataBodyTemplate
      theme={theme}
      className="layout-databody-managed-table-guide"
      topBar={
        <PageTopBar
          left={<PageBreadcrumb items={['Data', { label: 'Users', href: listPath }, 'Add user']} />}
        />
      }
      title="Add user"
      description="Create a user on a dedicated page with room for validation and future fields."
    >
      <DataBodyTemplate.Group
        layout="stacked"
        title="User information"
        description="Identity and access settings for the new account."
      >
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault()
            create.mutate({ name, email, role })
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="new-user-name" className="text-xs">
              Name
            </Label>
            <Input
              id="new-user-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-8 text-sm"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-user-email" className="text-xs">
              Email
            </Label>
            <Input
              id="new-user-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-8 text-sm"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-user-role" className="text-xs">
              Role
            </Label>
            <Select value={role} onValueChange={(value) => value && setRole(value as UserRole)}>
              <SelectTrigger id="new-user-role" className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-8 text-xs" disabled={create.isPending}>
              {create.isPending ? 'Creating…' : 'Create user'}
            </Button>
          </div>
        </form>
      </DataBodyTemplate.Group>
    </DataBodyTemplate>
  )
}

export function DataBodyManagedTableGuide({ theme }: { theme?: React.CSSProperties }) {
  const navigate = useNavigate()
  const params = useParams<'shell' | '*'>()
  const listPath = `/${params.shell ?? 'sidebar'}/databody-managed-table-guide`
  const isCreatePage = params['*'] === 'new'
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false, staleTime: 1_000 },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {isCreatePage ? (
        <UserCreatePage
          theme={theme}
          onCancel={() => navigate(listPath)}
          onCreated={() => navigate(listPath)}
          listPath={listPath}
        />
      ) : (
        <UserListPage theme={theme} onAddUser={() => navigate(`${listPath}/new`)} />
      )}
    </QueryClientProvider>
  )
}
