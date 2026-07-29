import type { DataGridTemplateVariant } from '../../definitions'
import type { TemplateCodeContext } from '../../code'

export function buildDataGridTemplateCode({
  definition,
  themeProp,
  layoutClassName,
}: TemplateCodeContext) {
  const variant = definition.preview?.variant as DataGridTemplateVariant | undefined
  const isCard = variant === 'card' || variant === 'card-list'
  const componentName =
    variant === 'infinity'
      ? 'DataGridInfinity'
      : variant === 'drag'
        ? 'DataGridDrag'
        : isCard
          ? 'DataGridCard'
          : 'DataGrid'

  const cardRenderCode = isCard
    ? [
        '',
        `function renderCard(row: { original: User }) {`,
        `  const user = row.original`,
        `  return (`,
        `    <div className="rounded-lg border bg-card p-3 text-card-foreground">`,
        `      <p className="text-sm font-medium">{user.name}</p>`,
        `      <p className="text-xs text-muted-foreground">{user.email}</p>`,
        `    </div>`,
        `  )`,
        `}`,
      ].join('\n')
    : ''

  const cardProp = isCard ? `\n        renderCard={renderCard}` : ''
  const cardColumnsProp = variant === 'card-list' ? `\n        cardColumns={1}` : ''

  return [
    `import { DataBodyTemplate, PageTopBar } from '@loykin/designkit'`,
    `import { ${componentName}, type DataGridColumnDef } from '@loykin/gridkit'`,
    `import '@loykin/designkit/styles'`,
    '',
    `type User = Record<string, unknown> & { id: string; name: string; email: string }`,
    '',
    `const data: User[] = []`,
    `const columns: DataGridColumnDef<User>[] = [`,
    `  { id: 'name', accessorKey: 'name', header: 'Name' },`,
    `  { id: 'email', accessorKey: 'email', header: 'Email' },`,
    `]`,
    cardRenderCode,
    '',
    `export function MyPage() {`,
    `  return (`,
    `    <DataBodyTemplate${themeProp}`,
    `      className="${layoutClassName}"`,
    `      topBar={<PageTopBar left="Data / Users" />}`,
    `      title="Users"`,
    `    >`,
    `      <DataBodyTemplate.Body>`,
    `        <${componentName}`,
    `          data={data}`,
    `          columns={columns}`,
    `          getRowId={(row) => row.id}${cardProp}${cardColumnsProp}`,
    `          tableHeight={420}`,
    `        />`,
    `      </DataBodyTemplate.Body>`,
    `    </DataBodyTemplate>`,
    `  )`,
    `}`,
  ]
    .filter(Boolean)
    .join('\n')
}
