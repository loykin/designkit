# Commerce Workflow Contract for AI

Use this guide to build a discovery-to-decision commerce experience. The executable reference is **Guides / Commerce / Catalog → Product**.

## Identity

- Pattern ID: `commerce-workflow`
- Catalog route template: `BrowseBodyTemplate`
- Product route template: `DetailBodyTemplate`
- Server state: TanStack Query
- Executable source: `playground/src/templates/demos/guides/CommerceWorkflowGuide.tsx`

The existing **Browse / Catalog** and product detail template demos remain visual references. This Guide defines their behavioral connection.

Read [AI UI Implementation Contract](./ai-ui-implementation-contract.md) first. Product cards use DesignKit `InteractiveCard` for the clickable, hover-lifting shell — the same component the Publishing guide uses — not a hand-rolled `<div className="... hover:shadow-md ...">`.

## Route contract

```text
/products                 → filterable and sortable catalog
/products/:productSlug    → linkable product destination
```

Selecting a product card navigates to the product route. Browser Back and the product breadcrumb return to the catalog. A product decision page is not a Sheet and must not be rendered inside the catalog template.

## Query and filter ownership

- `CatalogPage` owns category, search, sort, pagination, and `['commerce', 'products', ...inputs]`.
- Every server-state input belongs in the query key.
- `ProductPage` owns `['commerce', 'product', slug]`.
- Filters stay in `BrowseBodyTemplate.sidebar`; sort and result count stay in `toolbar`.
- Initial loading replaces only catalog cards. Background refetch keeps current cards mounted.

## Layout and action rules

- Catalog discovery actions and filters remain on the catalog route.
- Product-specific status, price, variants, purchase action, and delivery information belong on the detail route.
- Use `DetailBodyTemplate` media layout when product media is a primary decision input.
- Render exactly one page-level template per route.

## AI reconstruction checklist

- [ ] Real catalog and product routes
- [ ] `BrowseBodyTemplate` catalog and `DetailBodyTemplate` product
- [ ] Filters and sort included in the catalog query key
- [ ] Product card click navigates to a slug route
- [ ] Product breadcrumb returns to catalog
- [ ] Purchase action exists only on the product route
- [ ] No nested page templates and no product Sheet
- [ ] Product cards use `InteractiveCard`, not a hand-rolled hover/elevation `className` block
