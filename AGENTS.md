# DesignKit Agent Guide

## Purpose

`@loykin/designkit` provides shared React page structures, UI components, and
design-token conventions for multiple applications. It should keep interaction
patterns and layout structure consistent without forcing every application to
look identical.

Applications are expected to customize branding, color, typography, density,
and domain content through documented public APIs and CSS variables.

## Repository Boundaries

- `src/` contains the publishable library.
- `src/index.ts` and `src/components/templates/index.ts` define the public API.
- `playground/` demonstrates and configures the library. Playground components
  are not public package APIs unless they are explicitly exported from `src/`.
- `src/styles/index.css` is the stylesheet published as
  `@loykin/designkit/styles`.
- `dist/` is generated output. Change source files and rebuild it instead of
  editing generated files directly.

## Implementation Priority

When adding or changing a screen:

1. Reuse an existing public DesignKit template or UI component.
2. Compose behavior through documented props, children, and slots.
3. Customize appearance through design tokens, CSS variables, `theme`, and
   documented `className` props.
4. Extend an existing component when the behavior is broadly reusable.
5. Add a new public component only when no existing abstraction fits.
6. Keep domain-specific data fetching and business logic outside DesignKit.

Do not copy a DesignKit component into another project merely to make a visual
variation. Add a public variant, slot, or token when the requirement is broadly
reusable.

## Customization Contract

Project-level customization is intentional and supported.

Preferred customization points:

- Shared shadcn-style variables such as `--background`, `--primary`,
  `--border`, and `--radius`.
- DesignKit variables prefixed with `--dk-`.
- The `theme` prop exposed by page templates.
- Public layout slots such as `actions`, `toolbar`, `header`, `sidebar`,
  `aside`, and template children.
- Documented component variants and `className` props.

Avoid:

- Broad global selectors targeting DesignKit's internal DOM.
- `!important` overrides unless required for a documented integration.
- Depending on generated class ordering or undocumented markup.
- Importing files through package-internal paths.
- Moving project-specific workflows or data models into this package.

## Public API Rules

- Consumers must import from `@loykin/designkit` or
  `@loykin/designkit/styles`.
- Export every intended public component and its useful prop types through the
  appropriate index file.
- Treat exported component names, prop names, and behavior as versioned API.
- Prefer additive changes. Breaking changes require a major-version release
  and migration notes.
- Do not present a playground-only demo as an installable template.
- Keep React and ReactDOM as peer dependencies to prevent duplicate runtimes.

## Template Responsibilities

Templates own reusable page structure and interaction layout. Consumers own
application-specific content and business behavior.

- `DataBodyTemplate`: general data, list, tab, and settings pages.
- `DetailBodyTemplate`: entity and record detail pages.
- `FormWizardBodyTemplate`: multi-step forms.
- `DashboardBodyTemplate`: dashboard chrome and panel layout.
- `WorkbenchBodyTemplate`: editor and multi-pane workspaces.
- `BrowseBodyTemplate`: filterable browsing experiences.
- `LoginBodyTemplate`: authentication layouts.

Add new slots before adding narrowly scoped template variants. Add a new
template only when its structural model is meaningfully different.

## Styling Rules

- This package uses Tailwind CSS v4 utility classes and shared CSS variables.
- Preserve the separation between structural utilities and customizable
  tokens.
- Use existing semantic tokens instead of hard-coded brand colors.
- New DesignKit-owned variables must use the `--dk-` prefix.
- Provide sensible fallbacks for variables expected from a consuming app.
- Confirm whether a style belongs in the published stylesheet or in the
  playground before editing CSS.
- Keep light and dark behavior consistent when adding semantic color tokens.

Consumers currently need Tailwind CSS v4 to generate utilities used by the
package. Do not assume that importing `@loykin/designkit/styles` alone produces
all utility CSS.

## Playground Rules

- Use the playground to demonstrate public APIs and supported customization.
- Playground examples may integrate with packages such as `@loykin/gridkit` or
  `@loykin/dashboardkit`, but those integrations must not silently become core
  DesignKit dependencies.
- Code export examples must use public imports and include all required setup.
- When adding a playground template, verify whether it also needs a public
  library export and documentation.

## Verification

Run the checks relevant to the change:

```bash
npm run type-check
npm run lint
npm run test
npm run build
npm run test:consumer
```

The consumer test packs the package and verifies installation, type checking,
production bundling, and a single React runtime. For visual or styling changes,
also inspect the playground because the consumer test does not currently
perform visual regression testing.

Before publishing, inspect the packed file list:

```bash
npm_config_cache=/tmp/designkit-npm-cache npm pack --dry-run
```

## Completion Checklist

- The change belongs in the shared package rather than one application.
- Public exports and prop types are complete.
- Project-specific customization remains possible through supported APIs.
- README or consumer guidance is updated when setup or behavior changes.
- Generated output is rebuilt rather than manually edited.
- Relevant checks pass.

