# AI UI Implementation Contract

This contract applies to every Guide in `docs/guides/`. Read it once, then read the specific Guide for the workflow you are building. It exists because an executable Guide demo teaches by example — an AI session copies what the code *does* more strongly than what the prose *says*. If a Guide's TSX is full of one-off Tailwind, that reads as "styling is done ad hoc here," no matter what the Markdown claims.

## Mandatory implementation order

1. Select the closest executable Guide (`docs/guides/manifest.json`).
2. Use the page template that Guide documents.
3. Fill the template's documented slots before creating wrapper layouts.
4. Use existing DesignKit or bundled shadcn components.
5. Use an existing named variant for a supported visual difference.
6. If a visual difference is reusable, add or extend a named component or variant — see `AGENTS.md`'s Implementation Priority.
7. Use custom CSS only when the requirement is content-specific, integration-specific, and cannot be represented by an existing template, slot, component, or variant.

Custom CSS is not forbidden. It must not read as the default way to build a screen.

## Forbidden patterns

- Reimplementing page-level layout (reading width, article typography, card elevation, section spacing) with raw `<div>` + Tailwind when a DesignKit component or variant already expresses it.
- Overriding padding, width, typography hierarchy, or responsive behavior that a template already owns.
- Storing Tailwind utility strings in domain/sample data (e.g. `accent: 'from-violet-500/80 ...'`). Store a semantic value (`accent: 'violet'`) and map it through a component or variant instead — an AI session should never need to invent gradient utility combinations.
- Copying the same hand-rolled visual pattern into more than one Guide. The second occurrence is the signal to promote it to a component (see `InteractiveCard`, born from the same hover/elevation block appearing in four demos).

## Classifying a `className`/`style` you're about to write

- **Promote to a DesignKit template-level component** if the pattern is reusable across pages regardless of domain: reading width, article typography, metadata rows, table of contents, loading skeletons, elevation/hover behavior, cover/hero layout.
- **Promote to a named variant** if it's a limited, enumerable visual choice on an existing component: tone, density, elevation, content width, presentation mode.
- **Keep as local custom CSS** only when all of the following hold: it is content- or integration-specific; it cannot be expressed by an existing template, slot, component, or variant; it does not repeat in another Guide; it does not touch template-owned layout. Justify it inline:

  ```tsx
  /**
   * Guide exception:
   * This third-party renderer requires an explicit container height.
   * Page spacing, typography, and responsive layout remain owned by DesignKit.
   */
  ```

  Custom styling with no such comment should be removed or promoted the next time it's touched.

## Reconstruction checklist (add to every Guide)

- [ ] Existing template slots are used before custom wrapper layouts
- [ ] Existing DesignKit or shadcn variants/components are used before custom classes
- [ ] Reusable visual differences are implemented as named components or variants, not repeated `className` blocks
- [ ] Custom CSS is local, minimal, and explicitly justified with a `Guide exception` comment
- [ ] No Tailwind utility strings are stored in domain data
- [ ] Template-owned spacing, width, typography, and responsive behavior are not overridden

## Precedent

- `ArticleCover`, `ArticleByline`, `ArticleToc`, `ArticleBody`, `ArticleBodySkeleton` (`@loykin/designkit`) — extracted from the Publishing guide's hand-rolled article markup; a `tone: ArticleTone` prop replaces raw gradient strings in sample data.
- `InteractiveCard` (`@loykin/designkit`) — the hover-lift-card treatment duplicated across the Publishing, Commerce, Browse, and Blog Feed demos, promoted to one component.
