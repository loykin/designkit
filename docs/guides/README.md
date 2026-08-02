# DesignKit Implementation Guides

The Playground's **Guides** group contains complete product flows. Existing template groups remain visual API references; they do not receive an AI guide merely because a workflow uses that template.

| Workflow            | Pattern ID            | Connected destinations                 | Contract                                        |
| ------------------- | --------------------- | -------------------------------------- | ----------------------------------------------- |
| Resource Management | `managed-table`       | table → detail Sheet; create/edit page | [Managed Table](./managed-table.md)             |
| Forms               | `form-workflow`       | create, edit, and settings pages       | [Stacked Form](./form-workflow.md)              |
| Publishing          | `publishing-workflow` | blog collection → article route        | [Publishing Workflow](./publishing-workflow.md) |
| Commerce            | `commerce-workflow`   | filtered catalog → product route       | [Commerce Workflow](./commerce-workflow.md)     |

## How to use these guides

1. Choose the guide by the product workflow, not by a component name or sample entity.
2. Give the complete guide Markdown and its Playground source to the AI.
3. Preserve route, query, action-placement, loading, and page-template boundaries.
4. Replace mock API functions and sample records with application code.
5. Use existing template demos only to compare supported visual variants.

Each route renders exactly one page-level template. A workflow may connect different templates across routes, but must never nest one page-level template inside another.
