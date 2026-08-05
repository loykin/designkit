# Publishing Workflow Contract for AI

Use this guide to build a publishing experience where a content collection leads to a stable article URL. The executable reference is **Guides / Publishing / Blog → Article**.

## Identity

- Pattern ID: `publishing-workflow`
- Collection route template: `DataBodyTemplate`
- Article route template: `DetailBodyTemplate`
- Server state: TanStack Query
- Executable source: `playground/src/templates/demos/guides/PublishingWorkflowGuide.tsx`

The existing **Blog Feed** and **Article** template demos are visual references only. This Guide is the supported example of how those page shapes connect.

Read [AI UI Implementation Contract](./ai-ui-implementation-contract.md) first. It governs how this Guide's card grid and article content are built.

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

## Card and article presentation

Do not hand-roll the card grid or article body with raw `<div>`/Tailwind. Use these DesignKit components:

- `ArticleCardPreview` — the whole grid card: cover, category, title, excerpt, byline, read time. Pass `coverContent` for per-listing decoration (an icon, an overlay); do not reassemble the card shape from `InteractiveCard` + `ArticleCover` + `ArticleByline` by hand — that duplication is exactly why this component exists (it was copy-pasted near-verbatim between this guide and the Blog Feed demo before being promoted).
- `ArticleCover` / `ArticleByline` — the cover and byline building blocks `ArticleCardPreview` uses internally. Reach for them directly only outside the card shape, e.g. the article page's hero (`ArticleCover`) and header (`ArticleByline`). `tone` is a semantic value (`'violet' | 'emerald' | 'amber' | 'rose' | 'sky' | 'slate'`), not a raw gradient class string — sample data stores `accent: ArticleTone`, never a Tailwind string.
- `ArticleBody` — reading-width container with article typography for the article's prose.
- `ArticleBodySkeleton` — loading placeholder matching `ArticleBody`'s width.
- `ArticleToc` — the article aside's table of contents.

Article title, excerpt, and category stay as plain content passed into these components; only the reusable shell moves into DesignKit.

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
- [ ] The grid card uses `ArticleCardPreview`, not a hand-assembled `InteractiveCard` + `ArticleCover` + `ArticleByline` composition
- [ ] Article page presentation uses `ArticleBody`/`ArticleBodySkeleton` and `ArticleToc`, not hand-rolled `className` blocks
- [ ] Sample data stores a semantic `accent`/tone value, never a Tailwind gradient string
