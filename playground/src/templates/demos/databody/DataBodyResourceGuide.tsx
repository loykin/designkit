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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@loykin/designkit'
import { Filter, Plus, Search } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import type { TemplateCodeContext } from '../../code'

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
}))

async function waitForMockApi() {
  await new Promise((resolve) => window.setTimeout(resolve, 550))
}

function paginate<T>(rows: T[], page: number): PageResult<T> {
  const start = (page - 1) * PAGE_SIZE
  return { items: rows.slice(start, start + PAGE_SIZE), total: rows.length }
}

async function listUsers(search: string, role: string, page: number) {
  await waitForMockApi()
  const query = search.trim().toLowerCase()
  const filtered = users.filter(
    (user) =>
      (!query || `${user.name} ${user.email}`.toLowerCase().includes(query)) &&
      (role === 'all' || user.role === role),
  )
  return paginate(filtered, page)
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
    },
    ...history,
  ]
  return user
}

async function listSessions(search: string, status: string, page: number) {
  await waitForMockApi()
  const query = search.trim().toLowerCase()
  return paginate(
    sessions.filter(
      (session) =>
        (!query || `${session.user} ${session.device}`.toLowerCase().includes(query)) &&
        (status === 'all' || session.status === status),
    ),
    page,
  )
}

async function listHistory(search: string, action: string, page: number) {
  await waitForMockApi()
  const query = search.trim().toLowerCase()
  return paginate(
    history.filter(
      (event) =>
        (!query || `${event.actor} ${event.target}`.toLowerCase().includes(query)) &&
        (action === 'all' || event.action === action),
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
  { id: 'lastSeen', accessorKey: 'lastSeen', header: 'Last seen' },
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
  { id: 'lastActive', accessorKey: 'lastActive', header: 'Last active' },
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
  { id: 'occurredAt', accessorKey: 'occurredAt', header: 'Occurred' },
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

function UserDetailSheet({ user, onClose }: { user?: User; onClose: () => void }) {
  return (
    <Sheet open={Boolean(user)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="data-[side=right]:sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{user?.name}</SheetTitle>
          <SheetDescription>User details remain open during list refreshes.</SheetDescription>
        </SheetHeader>
        {user && (
          <div className="grid gap-4 px-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p>{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Role</p>
              <p>{user.role}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="capitalize">{user.status}</p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

function UsersTab({ onAddUser }: { onAddUser: () => void }) {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<User>()
  const query = useQuery({
    queryKey: ['resource-guide', 'users', search, role, page],
    queryFn: () => listUsers(search, role, page),
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
      refreshing={query.isFetching && hasData}
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
        isLoading={query.isPending && !hasData}
        emptyMessage="No users match the current filters."
        tableWidthMode="fill-last"
        classNames={{ footer: 'pt-3' }}
        rowHeight={48}
        rowCursor
        onRowClick={setSelectedUser}
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
      <UserDetailSheet user={selectedUser} onClose={() => setSelectedUser(undefined)} />
    </DataBodyTemplate.Resource>
  )
}

function SessionsTab() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const query = useQuery({
    queryKey: ['resource-guide', 'sessions', search, status, page],
    queryFn: () => listSessions(search, status, page),
    placeholderData: keepPreviousData,
    refetchInterval: 8_000,
  })
  const hasData = query.data !== undefined

  return (
    <DataBodyTemplate.Resource
      refreshing={query.isFetching && hasData}
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
  const query = useQuery({
    queryKey: ['resource-guide', 'history', search, action, page],
    queryFn: () => listHistory(search, action, page),
    placeholderData: keepPreviousData,
    refetchInterval: 8_000,
  })
  const hasData = query.data !== undefined

  return (
    <DataBodyTemplate.Resource
      refreshing={query.isFetching && hasData}
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
    <DataBodyTemplate
      theme={theme}
      className="layout-databody-resource-guide"
      topBar={<PageTopBar left={<PageBreadcrumb items={['Data', 'Users']} />} />}
      title="Users"
      description="Canonical resource-management composition with isolated tab queries."
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
      className="layout-databody-resource-guide"
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

export function DataBodyResourceGuide({ theme }: { theme?: React.CSSProperties }) {
  const navigate = useNavigate()
  const params = useParams<'shell' | '*'>()
  const listPath = `/${params.shell ?? 'sidebar'}/databody-resource-guide`
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

export function buildDataBodyResourceGuideCode({ themeProp }: TemplateCodeContext) {
  return [
    `import { QueryClient, QueryClientProvider } from '@tanstack/react-query'`,
    `import { DataBodyTemplate, PageBreadcrumb, PageTopBar } from '@loykin/designkit'`,
    `import '@loykin/designkit/styles'`,
    '',
    `const queryClient = new QueryClient()`,
    '',
    `export function UsersPage() {`,
    `  return (`,
    `    <QueryClientProvider client={queryClient}>`,
    `      <DataBodyTemplate${themeProp}`,
    `        topBar={<PageTopBar left={<PageBreadcrumb items={['Data', 'Users']} />} />}`,
    `        title="Users"`,
    `      >`,
    `        <DataBodyTemplate.Tab id="users" label="Users">`,
    `          <UsersTab />`,
    `        </DataBodyTemplate.Tab>`,
    `        <DataBodyTemplate.Tab id="sessions" label="Sessions">`,
    `          <SessionsTab />`,
    `        </DataBodyTemplate.Tab>`,
    `        <DataBodyTemplate.Tab id="history" label="History">`,
    `          <HistoryTab />`,
    `        </DataBodyTemplate.Tab>`,
    `      </DataBodyTemplate>`,
    `    </QueryClientProvider>`,
    `  )`,
    `}`,
    '',
    `function UsersTab() {`,
    `  // Own this tab's query, search, filters, actions, selection, and pagination here.`,
    `  return <DataBodyTemplate.Resource>{/* toolbar + DataGrid + pagination */}</DataBodyTemplate.Resource>`,
    `}`,
  ].join('\n')
}
