# Changelog

All notable changes to `@loykin/designkit` are documented here.

## Unreleased

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
