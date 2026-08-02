# Kubernetes Workspace Contract for AI

Use this contract for operational resource browsers where people repeatedly inspect a collection, compare resource state, and open logs or a shell without losing list context.

The executable reference is available at:

- `/sidebar/kubernetes-workspace-guide`
- `/header/kubernetes-workspace-guide`

The `DataBodyTemplate / Kubernetes` entry is a visual API reference backed by the same composition. The **Guides / Operations / Kubernetes Workspace** entry is the normative workflow contract.

## 1. Workflow identity

This is one workspace with three distinct interaction layers:

1. The resource table owns discovery, search, filters, refresh, sorting, and selection context.
2. A right SidePanel owns concise inspection of the selected resource.
3. A bottom Control Dock owns persistent work such as logs, shell sessions, and cluster events.

Do not flatten these concerns into one table component. Keep query state, selected-resource inspection, and long-running tools independently replaceable.

## 2. Required composition

- Use one `DataBodyTemplate` as the only page-level template.
- Put GridKit `GlobalSearch` and a BaseKit `FilterInput` (`type: 'select'`, keyed to the namespace column) in the DataGrid header slots. GridKit's own `SelectFilter`/`MultiSelectFilter` do not expose a `size`/`className` prop, so they cannot be sized to match `GlobalSearch`; `FilterInput` can.
- Use BaseKit `SidePanelProvider` with DesignKit `PanelTemplate` for row inspection. Put `Shell`/`Logs` (and any other panel-opening actions) in `PanelTemplate`'s `actions` slot next to the title, not in `footer` — footer is for closing/committing the panel, not for opening other tools. Render `Close` as a plain icon button (no confirmation) since dismissing a read-only inspection panel is not a destructive action.
- Use BaseKit `ControlBarProvider` as the tab and persistence model for the bottom dock.
- Keep Kubernetes API clients, authorization, watches, and mutations in the consuming application.
- Keep GridKit, `FilterInput`, SidePanel, and Control Bar as application or Playground integrations; they are not DesignKit runtime dependencies.

## 3. Resource collection boundary

Create a named resource component such as `PodsResource`. It owns:

- collection query parameters and result rendering;
- search and filter state;
- column definitions and row actions;
- opening the selected resource in the SidePanel;
- opening resource tools in the Control Dock.

The route or workspace component owns only cluster context, page hierarchy, providers, and layout. It must not absorb every table and panel implementation detail.

For server-backed data, put search, namespace, sorting, pagination or cursor, and refresh inputs into one query model. Preserve the previous successful result during background refresh when possible. Show initial loading, empty, filtered-empty, permission failure, and refresh failure as distinct states.

## 4. Row interaction contract

Clicking a Pod row opens a read-oriented detail SidePanel. It must not implicitly open logs or start a shell.

The detail panel should show enough information to decide the next action:

- status, readiness, restarts, and age;
- node, owner/controller, and QoS class;
- namespace and stable resource name;
- explicit `Logs` and `Shell` actions.

Use a full detail route only when the resource has deep navigation, editable configuration, history, or a stable URL that users must share. Use the SidePanel for quick inspection that should preserve table position and filters.

Row-level Logs and Shell icon buttons may remain for expert access. They must stop row-click propagation and have accessible names.

## 5. Control Dock contract

Logs, shell sessions, and cluster events are persistent workspace tools, not transient popovers.

- Keep the dock visible at the bottom even with zero tabs.
- The empty dock is 36px tall and communicates `No active resource panels`.
- Opening a tool expands the dock to its working height.
- The dock participates in the workspace flex layout. It must reduce the table region rather than overlap or cover rows.
- Closing the last tab returns to the empty dock; it does not remove the dock.
- Deduplicate tools by tool type and resource identity. Reopening an existing Logs or Shell tool activates its tab.
- Collapsing preserves tabs and active state.
- Events are cluster-scoped; Logs and Shell are resource-scoped.

The Control Bar package supplies the headless tab model. The application owns the domain-specific dock chrome and tool renderers.

## 6. Spacing and resizing

- The table region must remain `min-height: 0` so it can shrink when the dock expands.
- The SidePanel must be mounted inside the workspace provider boundary, not around the app shell.
- The content area's bottom padding must equal its horizontal page padding. A table border touching the viewport edge reads as clipped even when it technically fits.
- Do not add a second page shell, header, or navigation sidebar inside the demo.
- Verify the same composition in both SidebarShell and HeaderShell.

## 7. Actions and state

Refresh belongs in the table header because it reloads the collection. Search and namespace filtering belong together without decorative separators that imply unrelated groups.

Do not add aggregate status counters merely to fill header space. Add a summary only when it supports an operational decision and is driven by the same query scope as the table.

For real clusters:

- disable or hide Shell when the user lacks permission;
- make container selection explicit for multi-container Pods;
- stream Logs and Shell through cancellable connections;
- announce connection, reconnecting, and terminal states;
- clean up watches and streams when their dock tab closes;
- avoid persisting credentials or log contents in local storage.

## 8. Reference shape

```tsx
function PodsResource() {
  const controlBar = useControlBar()
  const sidePanel = useSidePanel()
  const query = usePodsQuery()

  const inspectPod = (pod: Pod) => {
    sidePanel.open(
      <PodDetailPanel
        pod={pod}
        onOpenLogs={() => openPodTool(controlBar, 'logs', pod)}
        onOpenShell={() => openPodTool(controlBar, 'shell', pod)}
      />,
      { side: 'right', size: 420, resizable: true },
    )
  }

  return (
    <DataGrid
      data={query.data}
      columns={columns}
      onRowClick={inspectPod}
      headerLeft={(table) => (
        <>
          <GlobalSearch table={table} />
          <FilterInput
            config={namespaceFilterConfig}
            value={(table.getColumn('namespace')?.getFilterValue() as string) ?? null}
            onChange={(next) => table.getColumn('namespace')?.setFilterValue(next ?? undefined)}
          />
        </>
      )}
    />
  )
}

function KubernetesWorkspace() {
  return (
    <ControlBarProvider persistKey="kubernetes-workspace">
      <SidePanelProvider className="h-full min-h-0">
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          <DataBodyTemplate>{/* PodsResource */}</DataBodyTemplate>
          <KubernetesControlDock />
        </div>
      </SidePanelProvider>
    </ControlBarProvider>
  )
}
```

## 9. Review checklist

- [ ] There is exactly one page-level template and one app shell.
- [ ] Search is GridKit `GlobalSearch` and the namespace control is a BaseKit `FilterInput`, both in the table header.
- [ ] `GlobalSearch`, `FilterInput`, and any header `Button`s render at the same height and corner radius — verify computed style, not just class names, since GridKit/BaseKit and DesignKit resolve `--radius` independently.
- [ ] Row click opens a Pod detail SidePanel.
- [ ] Logs and Shell are explicit actions, not implicit row-click behavior.
- [ ] Logs, Shell, and any other panel-opening actions live in `PanelTemplate`'s `actions` slot next to the title; `footer` is reserved for closing/committing, and `Close` is a plain icon button, not a confirmation.
- [ ] Row action buttons stop propagation and have accessible names.
- [ ] Detail, collection query, and dock tools have separate component/state boundaries.
- [ ] Tool tabs deduplicate by type and resource identity.
- [ ] The empty Control Dock remains visible after the final tab closes.
- [ ] Expanding the dock reflows the table and never overlays it.
- [ ] Bottom content padding equals horizontal content padding.
- [ ] Loading, empty, permission, refresh failure, and stream failure states are defined.
- [ ] The SidebarShell and HeaderShell routes both show exactly one navigation shell.
