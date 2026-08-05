# DesignKit — AI Agent Instructions

## Project Overview

- **Package**: `@loykin/designkit`
- **Description**: React page template and UI component library with theming support
- **Stack**: React 19, Tailwind CSS v4, shadcn/ui conventions, base-ui, CVA, clsx, tailwind-merge, lucide-react, Zustand
- **Monorepo**: root (library), `playground/` (Vite dev server)

## Commands

```bash
pnpm build          # type-check + tsup + CSS build
pnpm build:js       # tsup only
pnpm build:css      # CSS only
pnpm dev            # watch mode + playground dev server
pnpm type-check     # tsc --noEmit
pnpm lint           # eslint
pnpm test           # vitest run
pnpm test:consumer  # pack + verify Tailwind discovery, installation, types, bundling, single React runtime
```

## Architecture

### Entry Points

- `src/index.ts` — public API exports
- `src/styles/index.css` — token bridge used to build `@loykin/designkit/styles`

### Source Layout

```
src/
  components/
    ui/          — primitive UI components (button, badge, avatar, card, …)
    patterns/    — reusable content compositions, not page-level (PanelTemplate, InteractiveCard, Article*)
    templates/   — page-level template components
    shells/      — layout shells (HeaderShell, SidebarShell)
  hooks/         — use-mobile
  lib/           — cn(), styleInjector (useStyleInjector, buildTemplateTheme)
  store/         — useThemeStore (Zustand), types
  styles/        — index.css (design token bridge, CSS custom properties)
```

DesignKit's components form three tiers: `ui/` atomic primitives (shadcn-derived; never edited to satisfy a call site, see below) → `patterns/` reusable compositions of those primitives that are not themselves a full page (a panel's content, a clickable card shell, an article's cover/byline) → `templates/` full page-level shells that compose primitives and patterns into a route. When a visual pattern repeats across more than one screen, it belongs in `patterns/` if it's not a full page, or as a new `templates/` entry if it is.

### Templates (`src/components/templates/`)

| Template                                        | Purpose                                     |
| ----------------------------------------------- | ------------------------------------------- |
| `DataBodyTemplate`                              | General data, list, tab, and settings pages |
| `DetailBodyTemplate`                            | Entity and record detail pages              |
| `FormWizardBodyTemplate`                        | Multi-step forms                            |
| `DashboardBodyTemplate`                         | Dashboard chrome and panel layout           |
| `WorkbenchBodyTemplate`                         | Editor and multi-pane workspaces            |
| `BrowseBodyTemplate`                            | Filterable browsing experiences             |
| `LoginBodyTemplate`                             | Authentication layouts                      |
| `DataPage`                                      | Page container with `PageTopBar`            |
| `TypographyBodyTemplate` / `ColorsBodyTemplate` | Design reference pages                      |

### Key Types & Patterns

- `TemplateId` — union of all template id strings (`src/store/types.ts`)
- `ShellId` — `'sidebar' | 'header'`
- `DensityId` — `'compact' | 'default' | 'comfortable'`
- `GlobalTheme` — global theme settings (`radius`, `primaryHue`, `primaryChroma`, `fontScale`, `lineHeight`, `density`, `darkMode`)
- `TemplateOverride` — per-template token overrides keyed by `TemplateId`
- `useStyleInjector()` — React hook that writes CSS custom properties to `<style id="designkit-vars">`; accepts `{ scope }` for container-scoped injection
- `buildTemplateTheme()` — returns an inline `React.CSSProperties` token map for external usage

## Styling

- Tailwind CSS v4 is a required peer dependency and part of DesignKit's public consumer contract.
- DesignKit follows shadcn/ui's source-based model: package components contain Tailwind class strings, and the consuming application's Tailwind build generates their utilities.
- shadcn/ui is an architecture and semantic-token convention, not a DesignKit runtime dependency; do not add the shadcn CLI or package as a runtime dependency.
- `@loykin/designkit/styles` registers the published `dist` directory with `@source`; consumers import it after `tailwindcss` in the same global CSS entry.
- Never bundle `tailwindcss`, `tailwindcss/utilities`, or pre-built global utility classes into DesignKit's published CSS.
- Do not add a Tailwind class prefix solely to isolate DesignKit. Utility ordering and deduplication come from the single consumer-owned Tailwind build.
- CSS custom properties use `--designkit-` prefix for DesignKit-owned tokens
- Shared shadcn variables (`--primary`, `--background`, `--radius`, etc.) are supported as fallbacks
- Loykin kits share semantic tokens first (`--primary`, `--border`, `--radius`) and use package-specific variables only as local escape hatches; do not make sibling kits depend on `--designkit-*`
- Shared token fallback order is shared semantic token first, package namespace second, literal fallback last
- Shared token types are part of the contract: colors are CSS colors, preferably OKLCH; `--radius` is a CSS length, not a scale factor
- Dark mode is class-based through `.dark`; avoid package defaults based on `prefers-color-scheme`
- `useStyleInjector` writes `:root` by default, or the configured `scope`, plus dark tonal and per-template `.layout-<id>` overrides inside `@layer designkit`
- Because `useStyleInjector` writes inside `@layer designkit`, unlayered app CSS wins over injected runtime tokens by design
- State styling uses `data-*` attributes; avoid relying on generated class ordering
- GridKit's `DataGridCard` applies its own `padding: 16px` card-grid padding by default (correct for standalone GridKit usage — GridKit's own playground relies on it unmodified). When `DataGridCard` is nested inside a DesignKit page template, that default doubles up with the page's own `--designkit-page-padding-x`. Always pass `styles={{ content: { paddingInline: 0 } }}` in that case — do not modify GridKit's default, and do not skip this on a new demo just because an existing one already has it right.

## Repository Boundaries

- `src/` contains the publishable library. `src/index.ts` and `src/components/templates/index.ts` define the public API.
- `playground/` demonstrates and configures the library. Playground components are not public package APIs unless explicitly exported from `src/`.
- `dist/` is generated output — change source files and rebuild; never edit generated files directly.

## Implementation Priority

When adding or changing a screen:

1. Reuse an existing public DesignKit template or UI component.
2. Compose behavior through documented props, children, and slots.
3. Customize appearance through design tokens, CSS variables, and documented `className` props.
4. Extend an existing component when the behavior is broadly reusable.
5. Add a new public component only when no existing abstraction fits.
6. Keep domain-specific data fetching and business logic outside DesignKit.

Do not copy a DesignKit component into another project to make a visual variation — add a public variant, slot, or token when the requirement is broadly reusable.

Never edit files under `src/components/ui/*` (the shadcn/ui-derived primitives — `button.tsx`, `input.tsx`, `select.tsx`, etc.) to satisfy a call site's need, including adding a new CVA variant, size, or prop. These primitives are the shared foundation every DesignKit template and every consumer depends on; changing them is a deliberate decision for whoever owns the design system, not something to do reactively while building a screen or fixing a bug elsewhere. If a call site needs sizing or behavior a primitive doesn't expose, work within what already exists, or stop and report the gap instead of extending the primitive.

Do not nest one page-level template (`DataBodyTemplate`, `WorkbenchBodyTemplate`, `DashboardBodyTemplate`, `BrowseBodyTemplate`, `DetailBodyTemplate`, etc.) inside another page-level template's slot (`leftPane`, `rightPane`, `bottomPane`, `mainPane`, `children`, …). Every page-level template already wraps its content in `DataPage`; nesting two of them nests two page shells and duplicates chrome (headers, padding, and any built-in navigation-like pane). Pick the one template that fits and compose inside it — if its slots aren't expressive enough, extend that template instead of wrapping it in a second one.

## Implementation Guides

- Before implementing or reviewing a product workflow, inspect `docs/guides/manifest.json` and select the matching contract in `docs/guides/`.
- Entries under the Playground's **Guides** navigation are normative end-to-end implementation contracts. Existing template groups are visual API references only; do not infer product structure from a template demo when a matching Guide exists.
- The current guide IDs are `managed-table`, `kubernetes-workspace`, `form-workflow`, `publishing-workflow`, and `commerce-workflow`.
- Do not add an AI Guide to a visual template merely because a workflow happens to use that template.
- Before writing or reviewing a Guide's executable TSX, read `docs/guides/ai-ui-implementation-contract.md`. A Guide demo is copied more literally than its prose; hand-rolled Tailwind in the demo teaches the wrong lesson regardless of what the Markdown says.

### Guide maintenance gate

Guide maintenance is part of DesignKit development, not optional follow-up documentation. Before marking a change complete, determine whether it changes or demonstrates any of the following:

- page hierarchy, route destinations, or template selection;
- action, toolbar, filter, form, detail, pagination, loading, refresh, or error placement;
- query/state boundaries or the component boundary intended to isolate updates;
- a workflow already named in `docs/guides/manifest.json`;
- a new complete product workflow shown in the Playground.

If any item applies, update every affected AI Guide in the same change. A Guide-impacting change is incomplete until all applicable surfaces below agree:

1. The executable Playground Guide demo.
2. Its canonical `docs/guides/<guide-id>.md` contract, including code and review checklist.
3. `docs/guides/manifest.json` metadata and `docs/guides/README.md` index.
4. Playground definition, `patternId`, raw Markdown import, AI Guide mapping, source mapping, and Guides navigation.
5. The root npm `README.md` discovery table and an `npx @loykin/designkit guide <guide-id>` example.
6. `docs/consumer-guide.md` cross-references when template selection or consumer behavior changed.
7. Guide registry, distribution, CLI, and packed-consumer tests.
8. This `AGENTS.md` when the rule future agents must follow changed.

The CLI reads the canonical Markdown through `docs/guides/manifest.json`. Never maintain separate CLI-only guide prose. After changing a Guide, run both `node cli/designkit.mjs guide list` and `node cli/designkit.mjs guide <guide-id> --prompt` and verify that the new content is present. When no Guide is affected, explicitly record that conclusion in the final handoff instead of silently skipping the check.

### Form workflow — required contract

For every ordinary create, edit, or settings screen, read and follow `docs/guides/form-workflow.md` before changing code.

- Use a full route page by default. A Sheet is not the default form container.
- Use one `DataBodyTemplate` root and `DataBodyTemplate.Group layout="stacked"` for every semantic form section.
- Create, edit, and settings domains do not select different layouts. They all use the stacked form shape; only the number of Groups and save boundaries vary.
- Implement each semantic Group as a named component, like tab-scoped content. Keep section-only state, pending indicators, validation, and errors inside that section boundary when possible.
- The route component owns only page-level breadcrumb, title, description, and routing concerns. Do not lift Group-specific state into the page header.
- One create/edit operation normally owns one form across all Groups and one bottom action row. Split settings into separate forms only when those categories are independently saved.
- Keep Cancel before the right-aligned primary submit action. Validation text belongs directly below its field; form-level failure belongs inside the same form boundary above its actions.
- Form libraries are application choices and must not change the visual contract. The executable Playground example uses React Hook Form only to prove shared state across modular Groups; `react-hook-form` must remain a Playground-only dependency and must not be added to DesignKit dependencies or peer dependencies.

## Customization Contract

Preferred customization points:

- Shared shadcn-style variables: `--background`, `--primary`, `--border`, `--radius`
- DesignKit variables: `--designkit-*`
- The `theme` prop on page templates
- Public layout slots: `actions`, `status`, `toolbar`, `header`, `sidebar`, `aside`, and template children
- Documented component variants and `className` props

Avoid:

- Broad global selectors targeting DesignKit's internal DOM
- `!important` overrides unless required for a documented integration
- Importing files through package-internal paths
- Moving project-specific workflows or data models into this package

## Public API Rules

- Consumers import from `@loykin/designkit` or `@loykin/designkit/styles` only.
- Export every intended public component and its useful prop types through the appropriate index file.
- Treat exported component names, prop names, and behavior as versioned API.
- Prefer additive changes; breaking changes require a major-version bump and migration notes.
- Do not remove an exported API directly. Keep a deprecated export for at least one release and document the migration in `CHANGELOG.md`.
- Keep React and ReactDOM as peer dependencies to prevent duplicate runtimes.
- Keep Tailwind CSS v4 as a peer dependency; Tailwind v3 and Tailwind-free consumers are outside the supported contract.

## Playground Rules

- Use the playground to demonstrate public APIs and supported customization.
- Playground examples may integrate with `@loykin/gridkit` or other Loykin packages, but those integrations must not silently become core DesignKit dependencies.
- When adding a playground template, verify whether it also needs a public library export.
- Every playground demo is rendered inside `SidebarShell`/`HeaderShell` (`playground/src/App.tsx`), which already provides app-level navigation chrome. A demo must not add its own top-level navigation-style sidebar or header — that duplicates the shell. Before marking a new or changed demo done, load it in the browser at both `/sidebar/<id>` and `/header/<id>` and visually confirm there is exactly one navigation sidebar/header on screen.

## Verification

Run checks relevant to the change:

```bash
pnpm type-check
pnpm lint
pnpm test
pnpm build
pnpm test:consumer
```

The consumer test must verify package installation, types, bundling, a single
React runtime, Tailwind source discovery, and responsive utility ordering.

For visual or styling changes, also inspect the playground — the consumer test does not perform visual regression testing.

Before publishing:

```bash
npm_config_cache=/tmp/designkit-npm-cache npm pack --dry-run
```

## Conventions

- No unnecessary comments — only add when the WHY is non-obvious
- New `--designkit-*` variables must have sensible fallbacks for consuming apps
- New public component → export from `src/index.ts` AND `src/components/templates/index.ts` (if a template)
- New public template → also update the Template Selection table in `docs/consumer-guide.md`
