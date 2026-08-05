# Changelog

All notable changes to `@loykin/designkit` are documented here.

## Unreleased

- Added `InteractiveCard` (hover-lift/elevation clickable card shell) and
  `ArticleCover`, `ArticleByline`, `ArticleToc`, `ArticleBody`,
  `ArticleBodySkeleton`, `ArticleCardPreview` (article/blog content
  primitives, with a semantic `ArticleTone` instead of raw gradient class
  strings). `ArticleCardPreview` composes the full card shape (cover,
  category, title, excerpt, byline, read time); extracted after the
  Publishing Workflow guide and Blog Feed demo were found to duplicate that
  entire card near verbatim. Extracted from near-identical hand-rolled
  markup that had been copied across the Publishing Workflow guide, Commerce
  Workflow guide, Blog Feed demo, and Browse demo.
- Added `WorkbenchBodyTemplate.Section` for grouping related controls (e.g. an
  options/inspector pane) into labeled sections.
- Added the Tailwind v4 `@theme inline` bridge and class-based `.dark` variant to
  `@loykin/designkit/styles` so consumers can use DesignKit without installing
  shadcn CSS separately.
- Added explicit semantic border utilities to template separators.
- Added `PageTopBar.minHeight` for taller right-slot controls while preserving
  the existing `height` behavior.
- Exported `Breadcrumb` from the public package entry.
- Removed unused TanStack packages from published dependencies and moved the
  playground-only table type dependency to the playground.
- Added MIT `LICENSE` and CSS-preserving `sideEffects` metadata.
- Added initial tests for token generation and public API coverage.
- Added `WorkbenchBodyTemplate.onResize`, synchronized pane size props, and
  keyboard-accessible resize handles.
- Removed playground navigation state usage from DesignKit internals, added
  `CurrentTemplateId`, and kept old playground ids under deprecated
  `LegacyTemplateId`/`TemplateId` compatibility.
- Added `useStyleInjector({ scope })` for container-scoped runtime theme
  injection.
- Removed the DesignKit-owned `--gridkit-*` adapter; sibling kits should consume
  shared semantic tokens such as `--primary`, `--border`, and `--radius`.
