# Publishing Workflow Contract for AI

Use this guide to build a publishing experience where a content collection leads to a stable article URL. The executable reference is **Guides / Publishing / Blog → Article**.

## Identity

- Pattern ID: `publishing-workflow`
- Collection route template: `DataBodyTemplate`
- Article route template: `DetailBodyTemplate`
- Server state: TanStack Query
- Executable source: `playground/src/templates/demos/guides/PublishingWorkflowGuide.tsx`

The existing **Blog Feed** and **Article** template demos are visual references only. This Guide is the supported example of how those page shapes connect.

## Route contract

```text
/journal                 → searchable, newest-first article collection
/journal/:articleSlug    → linkable article destination
```

Card selection uses React Router navigation. Browser Back returns to the collection. The article breadcrumb links to the collection route. Do not open a long article in a Sheet or simulate the route with `selectedArticle` component state.

## Query ownership

- `PublishingList` owns `['publishing', 'articles']` and collection search/sort state.
- `PublishingArticle` owns `['publishing', 'article', slug]`.
- Initial collection loading shows card skeletons through GridKit `isLoading`.
- Background collection refetch preserves existing cards.
- Article loading affects only the article route.

## Layout and action rules

- Collection-wide actions such as **New article** may appear in the collection page header.
- Search and category filters belong with the collection, above its cards.
- Card-local actions stay on the card; selecting the card navigates.
- Article actions such as Save or Share belong in the article header.
- Render one page-level template per route. Never put `DetailBodyTemplate` inside `DataBodyTemplate.Body`.

## Deterministic ordering

The mock API returns articles newest first and the GridKit collection declares the same initial published-date sort. In a real API, send sort parameters to the server and include them in the query key. Never sort humanized labels such as “2 hours ago”.

## AI reconstruction checklist

- [ ] Real collection and article routes
- [ ] `DataBodyTemplate` collection and `DetailBodyTemplate` article
- [ ] Independent TanStack Query boundaries
- [ ] Card click navigates to the article slug
- [ ] Breadcrumb returns to the collection
- [ ] Initial loading is local to the destination content
- [ ] Existing content remains visible during background refetch
- [ ] No nested page templates and no article Sheet
