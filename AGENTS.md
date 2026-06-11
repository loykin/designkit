# DesignKit — AI Agent Instructions

## Project Overview

- **Package**: `@loykin/designkit`
- **Description**: React page template and UI component library with theming support
- **Stack**: React 19, base-ui, CVA, clsx, tailwind-merge, lucide-react, Zustand
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
pnpm test:consumer  # pack + verify installation, types, bundling, single React runtime
```

## Architecture

### Entry Points
- `src/index.ts` — public API exports
- `src/styles/index.css` — published as `@loykin/designkit/styles`

### Source Layout
```
src/
  components/
    ui/          — primitive UI components (button, badge, avatar, card, …)
    templates/   — page-level template components
    shells/      — layout shells (HeaderShell, SidebarShell)
  hooks/         — use-mobile
  lib/           — cn(), styleInjector (useStyleInjector, buildTemplateTheme)
  store/         — useThemeStore (Zustand), types
  styles/        — index.css (design token bridge, CSS custom properties)
```

### Templates (`src/components/templates/`)
| Template | Purpose |
|----------|---------|
| `DataBodyTemplate` | General data, list, tab, and settings pages |
| `DetailBodyTemplate` | Entity and record detail pages |
| `FormWizardBodyTemplate` | Multi-step forms |
| `DashboardBodyTemplate` | Dashboard chrome and panel layout |
| `WorkbenchBodyTemplate` | Editor and multi-pane workspaces |
| `BrowseBodyTemplate` | Filterable browsing experiences |
| `LoginBodyTemplate` | Authentication layouts |
| `DataPage` | Page container with `PageTopBar` |
| `TypographyBodyTemplate` / `ColorsBodyTemplate` | Design reference pages |

### Key Types & Patterns
- `TemplateId` — union of all template id strings (`src/store/types.ts`)
- `ShellId` — `'sidebar' | 'header'`
- `DensityId` — `'compact' | 'default' | 'comfortable'`
- `GlobalTheme` — global theme settings (`radius`, `primaryHue`, `primaryChroma`, `fontScale`, `lineHeight`, `density`, `darkMode`)
- `TemplateOverride` — per-template token overrides keyed by `TemplateId`
- `useStyleInjector()` — React hook that writes CSS custom properties to `<style id="designkit-vars">`
- `buildTemplateTheme()` — returns an inline `React.CSSProperties` token map for external usage

## Styling

- CSS custom properties use `--dk-` prefix for DesignKit-owned tokens
- Shared shadcn variables (`--primary`, `--background`, `--radius`, etc.) are supported as fallbacks
- `useStyleInjector` writes both `:root` (light) and `.dark` (dark tonal) blocks, plus per-template `.layout-<id>` overrides
- State styling uses `data-*` attributes; avoid relying on generated class ordering

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

## Customization Contract

Preferred customization points:
- Shared shadcn-style variables: `--background`, `--primary`, `--border`, `--radius`
- DesignKit variables: `--dk-*`
- The `theme` prop on page templates
- Public layout slots: `actions`, `toolbar`, `header`, `sidebar`, `aside`, and template children
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
- Keep React and ReactDOM as peer dependencies to prevent duplicate runtimes.

## Playground Rules

- Use the playground to demonstrate public APIs and supported customization.
- Playground examples may integrate with `@loykin/gridkit` or other Loykin packages, but those integrations must not silently become core DesignKit dependencies.
- When adding a playground template, verify whether it also needs a public library export.

## Verification

Run checks relevant to the change:

```bash
pnpm type-check
pnpm lint
pnpm test
pnpm build
pnpm test:consumer
```

For visual or styling changes, also inspect the playground — the consumer test does not perform visual regression testing.

Before publishing:

```bash
npm_config_cache=/tmp/designkit-npm-cache npm pack --dry-run
```

## Conventions

- No unnecessary comments — only add when the WHY is non-obvious
- New `--dk-*` variables must have sensible fallbacks for consuming apps
- New public component → export from `src/index.ts` AND `src/components/templates/index.ts` (if a template)
