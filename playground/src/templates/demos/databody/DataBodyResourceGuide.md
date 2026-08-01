# DataBodyTemplate resource-page contract for AI

Use this contract when implementing or revising a tabbed resource-management page with `@loykin/designkit`, `@loykin/gridkit`, and TanStack Query.

## Required page hierarchy

```tsx
<DataBodyTemplate
  topBar={<PageTopBar left={<PageBreadcrumb items={['Data', 'Users']} />} />}
  title="Users"
  description="..."
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
```

Each tab component must render one `DataBodyTemplate.Resource`. Do not nest another page-level template inside `DataBodyTemplate`.

## Page navigation rules

- Keep the hierarchy visible through `topBar` with `PageTopBar` and `PageBreadcrumb`.
- A list page identifies its collection, for example `Data / Users`.
- A create page extends the hierarchy, for example `Data / Users / Add user`; make the Users crumb navigate back to the list route.
- Do not remove the breadcrumb when moving between list, detail, create, or edit pages.

## Ownership rules

- The page header contains only page-scoped title, description, status, or actions that remain valid for every tab.
- Never place a tab-specific action, filter, query status, or pagination control in the page header.
- Each tab is a separate React component and owns its query, search, filters, page state, mutations, and detail selection.
- Query keys must include every server-state input: tab/resource name, search, filters, and page.
- Switching or refreshing one tab must not replace, reset, or flash the entire page or another tab.

## Resource toolbar rules

```tsx
<DataBodyTemplate.Resource
  toolbarLeft={<>{/* search, then filters */}</>}
  toolbarRight={<>{/* Add, Export, or other resource actions */}</>}
  refreshing={query.isFetching && !query.isLoading}
  footer={/* optional resource-level footer */}
>
  {/* DataGrid */}
</DataBodyTemplate.Resource>
```

- Put search first and filters after it in `toolbarLeft`.
- Put `Add user` and similar resource actions in `toolbarRight`.
- Keep compact toolbar controls aligned at `28px` (`h-7`).
- Do not add a manual Refresh button when background refetch already provides the required behavior. If the product explicitly requires one, keep it inside the resource toolbar, never the page header.

## Query and refresh rules

- Use TanStack Query inside the owning tab component, not at the page-template level.
- Use `placeholderData: keepPreviousData` for paginated queries.
- Show a blocking loader only when loading with no existing rows.
- During background refetch, preserve the table and use `Resource.refreshing`; do not replace the grid with a spinner or skeleton.
- Do not key or remount the tab, resource container, or grid from `isFetching`, query results, or a refresh timestamp.
- Invalidate only the affected resource query after a mutation.

## Grid and pagination rules

- Render GridKit `DataGrid` inside `DataBodyTemplate.Resource`.
- Use GridKit's controlled pagination instead of building a second pagination UI.
- Convert the app's one-based page to GridKit's zero-based `pageIndex` at the boundary.
- Render `DataGridPaginationBar` through the grid's `footer` slot.
- Add separation through the public footer slot: `classNames={{ footer: 'pt-3' }}`. Do not patch GridKit's internal DOM with global CSS.
- Search, filter, action, and pagination controls should use the same compact height.

## List, detail, and form destinations

```text
User list page
├─ Select row → concise read-only detail Sheet
├─ Add user   → dedicated create page
└─ Edit user  → dedicated edit page
```

- The resource list is a page.
- A create or edit form is a dedicated page by default. Navigate from `Add user` to that page so validation, permissions, help text, responsive layout, and future fields have enough room.
- Compose the form with the existing `DataBodyTemplate.Group layout="stacked"` pattern. Preserve its page padding and content width; do not add an arbitrary centered `max-width` wrapper or a second action divider.
- A Sheet is for concise, mostly read-only detail that benefits from keeping the list visible. It is not the default container for forms.
- Promote detail to a page when it becomes long, editable, multi-section, permission-sensitive, or independently linkable.
- Use a modal only for short confirmation or narrowly scoped input, not general entity creation.
- Keep the form mutation in the form page. After success, invalidate only the relevant resource queries and navigate back to the list or the created entity.

## Completion checklist

- [ ] There is exactly one page-level template and one application shell.
- [ ] The list and form pages retain their breadcrumb hierarchy.
- [ ] Tabs are directly below the page header.
- [ ] Every tab has an isolated component and TanStack Query lifecycle.
- [ ] Search and filters are on the left; resource actions are on the right.
- [ ] No tab-dependent control appears in the page header.
- [ ] Background refresh preserves existing rows without flashing the whole resource group.
- [ ] GridKit owns pagination and its footer has `pt-3` separation.
- [ ] Toolbar and pagination controls are `28px` high.
- [ ] Create and edit forms use dedicated pages unless a documented constraint justifies an overlay.
- [ ] Concise read-only row detail opens in a Sheet; complex detail uses a page.
- [ ] The implementation imports only public package entry points.
