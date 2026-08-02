# Managed Table Pattern Contract for AI

This is the normative implementation contract for a tabbed administrative table built with `@loykin/designkit`, `@loykin/gridkit`, TanStack Query, and React Router. Copy this entire document into an AI task before asking it to create or revise the page.

The Playground's **Guides / Resource Management / Managed Table** screen is the executable end-to-end reference. Its records are sample data; the pattern is defined by the table responsibilities and template composition below, not by that data domain. If an implementation differs from this contract, revise the implementation rather than inventing a local layout.

## Pattern identity and reference registry

- Pattern ID: `managed-table`
- Primary list template: `DataBodyTemplate`
- Full-detail template when required: `DetailBodyTemplate`
- Multi-step create/edit template when required: `FormWizardBodyTemplate`
- Resource boundary: `DataBodyTemplate.Resource`
- Executable pattern route: `/sidebar/databody-managed-table-guide` and `/header/databody-managed-table-guide`
- Executable pattern source: `playground/src/templates/demos/databody/DataBodyManagedTableGuide.tsx`

| Status               | Playground reference                           | Role in this pattern                                                                   |
| -------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------- |
| Executable pattern   | `Guides / Resource Management / Managed Table` | Complete list, tabs, queries, create route, form, pagination, and concise detail Sheet |
| Supporting reference | `DataBodyTemplate / Table / Standard`          | Base GridKit table composition and table sizing                                        |
| Supporting reference | `DataBodyTemplate / Form / Stacked`            | Create/edit form spacing, padding, and action alignment                                |
| Supporting reference | `DetailBodyTemplate / Detail / Record`         | Full-page destination when detail outgrows a Sheet                                     |
| Supporting reference | `FormWizardBodyTemplate / Wizard`              | Multi-step destination when create/edit outgrows a stacked form                        |
| Counterexample       | `DashboardBodyTemplate / Dashboard`            | Monitoring panels are not an administrative table                                      |
| Counterexample       | `BrowseBodyTemplate / Browse`                  | Consumer discovery is not an administrative resource list                              |

Only the entry marked **Executable pattern** implements this pattern end to end. Supporting references define the correct destination or visual sub-composition; they are not additional domain implementations of Managed Table.

## Pattern composition map

| Responsibility                                     | Primary API                                      | Playground example to inspect                  |
| -------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------- |
| Collection list, tabs, search, filters, pagination | `DataBodyTemplate` + `DataBodyTemplate.Resource` | `Guides / Resource Management / Managed Table` |
| Base table behavior                                | GridKit `DataGrid`                               | `DataBodyTemplate / Table / Standard`          |
| Simple create/edit route                           | stacked `DataBodyTemplate.Group`                 | `DataBodyTemplate / Form / Stacked`            |
| Concise read-only inspection                       | `Sheet`                                          | `Managed Table` row detail                     |
| Complex full-page detail route                     | `DetailBodyTemplate`                             | `DetailBodyTemplate / Detail / Record`         |
| Multi-step create/edit route                       | `FormWizardBodyTemplate`                         | `FormWizardBodyTemplate / Wizard`              |
| Destructive confirmation                           | `AlertDialog`                                    | UI primitive contract                          |

## Pattern applicability

Use this pattern when the screen manages a collection of repeated server records with most of these responsibilities: search or filters, resource-scoped actions, pagination, background refresh, and row inspection. The record name does not select the pattern; the screen responsibilities do.

## When not to use this pattern

| Screen shape                                            | Prefer                                              | Reason                                                  |
| ------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------- |
| Metrics and monitoring panels                           | `DashboardBodyTemplate`                             | The primary unit is a panel, not a record collection    |
| One entity with many editable settings sections         | `DataBodyTemplate.Section` or grouped form page     | There is no collection resource boundary                |
| Consumer catalog or faceted discovery                   | `BrowseBodyTemplate`                                | Browsing and comparison dominate administration         |
| Multi-step provisioning                                 | `FormWizardBodyTemplate`                            | Ordered steps and validation dominate the flow          |
| Long or multi-section record detail                     | `DetailBodyTemplate`                                | The entity itself is the page                           |
| Persistent master-detail workspace                      | `ListDetailBodyTemplate` or `WorkbenchBodyTemplate` | List and detail are simultaneously primary panes        |
| Small static list with no query, filters, or pagination | Plain `DataBodyTemplate` content                    | `Resource` and TanStack Query add unnecessary structure |

## Pattern selection questions

Choose `managed-table` when the answers are mostly yes:

1. Is the primary object a collection of repeated records?
2. Does the collection own search, filters, pagination, polling, or server state?
3. Are actions such as create or export scoped to that collection or active tab?
4. Should concise row inspection preserve the list context?
5. Can create/edit and complex detail use independent routes?

If the first two answers are no, do not use this pattern. This pattern may use different page-level templates on different routes, but each route still renders exactly one page-level template. Never nest those templates inside one another.

## Scope

This guide covers three destinations for any managed resource:

```text
/<resources>
├─ select row    → concise read-only detail Sheet
├─ create action → /<resources>/new create page
└─ edit action   → /<resources>/:resourceId/edit page
```

It does not define every `DataBodyTemplate` use case. Settings, dashboards, long-form detail pages, and wizards have separate patterns.

## Destination decision

| User intent                                                                     | Default destination   | Reason                                                                  |
| ------------------------------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------- |
| Browse, search, filter, paginate                                                | Page                  | Stable, linkable working context                                        |
| Inspect concise read-only row information                                       | Sheet                 | Preserves list context                                                  |
| Create or edit an entity                                                        | Page with its own URL | Space for validation, permissions, responsive layout, and future fields |
| Inspect long, editable, multi-section, permission-sensitive, or linkable detail | Page with its own URL | Sheet constraints are no longer appropriate                             |
| Confirm a destructive action or collect one narrowly scoped value               | Modal                 | Short, blocking decision                                                |

A Sheet is not the default form container. Do not put general create or edit forms in a Sheet merely because the trigger originates in a table.

## Route and page hierarchy

Use real routes and browser history. Do not simulate navigation with component state such as `view === 'create'`. The `/users` routes below are concrete examples; substitute the target collection route.

```tsx
<Routes>
  <Route path="/users" element={<UsersListPage />} />
  <Route path="/users/new" element={<UserCreatePage />} />
  <Route path="/users/:userId/edit" element={<UserEditPage />} />
</Routes>
```

Every destination retains its breadcrumb:

```tsx
// List
<PageTopBar left={<PageBreadcrumb items={['Data', 'Users']} />} />

// Create
<PageTopBar
  left={
    <PageBreadcrumb
      items={['Data', { label: 'Users', href: '/users' }, 'Add user']}
    />
  }
/>
```

The collection crumb on create, edit, and full-detail pages must navigate back to the list route.

## List-page hierarchy

Use exactly one application shell and one page-level template. Tabs are direct children of the page template. Each tab delegates to an isolated resource component.

```tsx
function UsersListPage() {
  return (
    <DataBodyTemplate
      topBar={<PageTopBar left={<PageBreadcrumb items={['Data', 'Users']} />} />}
      title="Users"
      description="Manage users, sessions, and account history."
    >
      <DataBodyTemplate.Tab id="users" label="Users">
        <UsersTab />
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
```

Do not nest another page-level template inside `DataBodyTemplate`. Do not place tab-dependent controls in the page header or top bar.

## Tab and query ownership

Each tab must be a separate React component and own all state that affects its resource:

- TanStack Query and query key
- Search and filters
- Pagination
- Row selection and concise detail Sheet
- Mutations that belong to the list itself

Query keys include every server-state input:

```tsx
const [search, setSearch] = useState('')
const [role, setRole] = useState('all')
const [page, setPage] = useState(1)

const usersQuery = useQuery({
  queryKey: ['users', search, role, page],
  queryFn: () => listUsers({ search, role, page }),
  placeholderData: keepPreviousData,
  refetchInterval: 8_000,
})

const hasData = usersQuery.data !== undefined
```

Do not call every tab's query in the page parent and select data with an `activeTab` conditional.

## Resource toolbar

Search and filters go on the left. Resource actions go on the right. `Add user` remains beneath the Users tab even though it navigates to another page.

```tsx
<DataBodyTemplate.Resource
  toolbarLeft={
    <>
      <UserSearch value={search} onChange={setSearchAndResetPage} />
      <RoleFilter value={role} onChange={setRoleAndResetPage} />
    </>
  }
  toolbarRight={
    <Button size="sm" onClick={() => navigate('/users/new')}>
      Add user
    </Button>
  }
>
  {/* DataGrid */}
</DataBodyTemplate.Resource>
```

Resource toolbar rules:

- Search comes before filters in `toolbarLeft`.
- Create, export, and view actions belong in `toolbarRight`.
- Table-toolbar controls are compact: `28px` (`h-7`).
- Do not place filters in `toolbarRight`.
- Do not move `Add user` into the page header.
- Do not add a manual Refresh button when background refetch is sufficient. If explicitly required by the product, keep it in the resource toolbar.

## Async refresh behavior

Do not equate `isFetching` with an empty loading state.

| Query state                        | Existing rows | Presentation                                            |
| ---------------------------------- | ------------- | ------------------------------------------------------- |
| `isPending && data === undefined`  | None          | Grid body loading state                                 |
| `isFetching && data !== undefined` | Preserve      | Keep the grid unchanged; no indicator by default        |
| `isError && data !== undefined`    | Preserve      | Non-destructive stale-data notice                       |
| `isError && data === undefined`    | None          | Error and retry in the resource body                    |
| Empty result                       | None          | Grid empty state while retaining toolbar and pagination |

During background refresh:

- Preserve the `DataGrid`, toolbar, footer, current page, and selected detail.
- Do not replace the resource group with a spinner or skeleton.
- Do not derive a React `key` from `isFetching`, query results, or a refresh timestamp.
- Keep automatic polling silent by default. A repeating `Refreshing` label creates unnecessary motion and toolbar reflow.
- `Resource.refreshing` is opt-in for an explicit user-initiated refresh or a product where freshness feedback is operationally important. When used, require both `query.isFetching` and existing data.
- Initial loading with no data belongs to GridKit's `isLoading` skeleton state, not `Resource.refreshing`.

After a mutation, invalidate only the affected resource keys. Do not invalidate a broad page key that refetches unrelated tabs.

## Sorting and stable ordering

Every table declares an initial order. Do not rely on source-array order or the timing of query responses.

- Client-side tables use GridKit `initialSorting`.
- Server-paginated tables keep `SortingState` in the resource component, include it in the TanStack Query key, pass `manualSorting`, and sort in the query/API before slicing the requested page.
- Reset to page one when sorting changes.
- Human labels such as `12 min ago` are display values, not sort keys. Use a timestamp, sequence, or numeric `accessorFn` while rendering the human label from `row.original`.
- Add a stable tie-breaker such as the record ID when equal primary values are possible.
- A draggable table is the exception: its persisted manual order is authoritative and column sorting is disabled.

```tsx
const INITIAL_SORTING: SortingState = [{ id: 'name', desc: false }]
const [sorting, setSorting] = useState<SortingState>(INITIAL_SORTING)

const query = useQuery({
  queryKey: ['users', search, role, page, sorting],
  queryFn: () => listUsers({ search, role, page, sorting }),
})

<DataGrid
  initialSorting={INITIAL_SORTING}
  manualSorting
  onSortingChange={(nextSorting) => {
    setSorting(nextSorting)
    setPage(1)
  }}
/>
```

Sorting must happen before pagination in `listUsers`. Sorting only the six rows already returned for the current page produces a false order across pages.

## GridKit pagination

GridKit owns its pagination UI. Do not build a second paginator and do not pass GridKit pagination through `DataBodyTemplate.Resource.footer`.

```tsx
<DataGrid
  data={usersQuery.data?.items ?? []}
  columns={userColumns}
  getRowId={(row) => row.id}
  isLoading={usersQuery.isPending && !hasData}
  tableWidthMode="fill-last"
  classNames={{ footer: 'pt-3' }}
  pagination={{
    pageSize: PAGE_SIZE,
    pageIndex: page - 1,
    pageCount: Math.max(1, Math.ceil((usersQuery.data?.total ?? 0) / PAGE_SIZE)),
    onPageChange: (pageIndex) => setPage(pageIndex + 1),
  }}
  footer={(table) => (
    <DataGridPaginationBar
      table={table}
      totalCount={usersQuery.data?.total ?? 0}
      pageSizes={[PAGE_SIZE]}
    />
  )}
/>
```

Grid rules:

- Convert the application's one-based page to GridKit's zero-based `pageIndex` only at the grid boundary.
- Use the public GridKit `footer` slot and `DataGridPaginationBar`.
- Use `classNames={{ footer: 'pt-3' }}` for the required `12px` separation from the table.
- Pagination controls are `28px` high, matching the resource toolbar.
- Do not target GridKit's internal DOM with global CSS.

## Create and edit form page

Create and edit forms use the established Form / Stacked composition. Preserve the template-owned page width and padding.

```tsx
function UserCreatePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const createUser = useMutation({
    mutationFn: createUserRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
      navigate('/users')
    },
  })

  return (
    <DataBodyTemplate
      topBar={
        <PageTopBar
          left={<PageBreadcrumb items={['Data', { label: 'Users', href: '/users' }, 'Add user']} />}
        />
      }
      title="Add user"
      description="Create a user account."
    >
      <DataBodyTemplate.Group
        layout="stacked"
        title="User information"
        description="Identity and access settings for the new account."
      >
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="user-name" className="text-xs">
              Name
            </Label>
            <Input id="user-name" className="h-8 text-sm" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="user-email" className="text-xs">
              Email
            </Label>
            <Input id="user-email" type="email" className="h-8 text-sm" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="user-role" className="text-xs">
              Role
            </Label>
            <Select defaultValue="Viewer">
              <SelectTrigger id="user-role" className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>{/* roles */}</SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => navigate('/users')}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-8 text-xs">
              Create user
            </Button>
          </div>
        </form>
      </DataBodyTemplate.Group>
    </DataBodyTemplate>
  )
}
```

Form rules:

- Form controls and buttons are `32px` (`h-8`); this differs from the table toolbar's `28px` controls.
- Use `space-y-3` for the form and `space-y-1.5` within each field.
- Use the full content width supplied by the stacked group.
- Do not add `mx-auto`, an arbitrary `max-w-*`, extra horizontal padding, a nested card, or a second action divider.
- The form page owns its mutation. After success, invalidate the narrowest affected queries and navigate to the list or created entity.

## Concise detail Sheet

Keep the list mounted while showing concise, mostly read-only row information:

```tsx
<Sheet open={Boolean(selectedUser)} onOpenChange={(open) => !open && clearSelection()}>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>{selectedUser?.name}</SheetTitle>
      <SheetDescription>User details</SheetDescription>
    </SheetHeader>
    {/* concise read-only fields */}
  </SheetContent>
</Sheet>
```

If the detail gains editing, multiple sections, complex permissions, a long history, or a need for a shareable URL, replace the Sheet with a detail page. Do not gradually turn the Sheet into a full page inside an overlay.

## Public API boundary

Import components only from public entry points:

```tsx
import { DataBodyTemplate, PageBreadcrumb, PageTopBar } from '@loykin/designkit'
import { DataGrid, DataGridPaginationBar } from '@loykin/gridkit'
```

Do not import package-internal source paths. Do not add TanStack Query, React Router, or domain-specific data fetching to DesignKit's core package; those remain application concerns.

## Required acceptance checks

- [ ] Exactly one application shell and one page-level template are visible.
- [ ] The list, `/new`, and edit routes are real URLs, not component-state modes.
- [ ] List, create, edit, and full-detail pages retain their breadcrumb hierarchy.
- [ ] Tabs are directly below the page header.
- [ ] Each tab is an isolated component with its own query and state.
- [ ] Search and filters are on the left; resource actions are on the right.
- [ ] No tab-dependent control appears in the page header.
- [ ] Initial loading uses the GridKit skeleton while background refresh preserves existing rows.
- [ ] Automatic polling is silent; any visible `refreshing` state is explicitly justified.
- [ ] GridKit owns controlled pagination and footer rendering.
- [ ] The GridKit footer has `pt-3` separation.
- [ ] Table toolbar and pagination controls are `28px` high.
- [ ] Form controls and buttons are `32px` high.
- [ ] The stacked form has no arbitrary max-width wrapper or extra action divider.
- [ ] Create and edit use pages; concise read-only detail uses a Sheet.
- [ ] Complex detail uses a page.
- [ ] Only public package entry points are imported.
- [ ] The experience is visually checked in both Sidebar and Header shells.
