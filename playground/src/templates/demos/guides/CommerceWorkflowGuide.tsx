import { useMemo, useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { DataGridCard, type DataGridColumnDef } from '@loykin/gridkit'
import {
  Badge,
  BrowseBodyTemplate,
  Button,
  CardContent,
  DetailBodyTemplate,
  InteractiveCard,
  PageTopBar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from '@loykin/designkit'
import { ArrowLeft, Star } from 'lucide-react'

interface Product {
  id: string
  slug: string
  name: string
  brand: string
  category: string
  price: number
  rating: number
  badge?: string
}

const PRODUCTS: Product[] = [
  {
    id: 'p1',
    slug: 'air-max-270',
    name: 'Air Max 270',
    brand: 'Nike',
    category: 'Lifestyle',
    price: 150,
    rating: 4.5,
    badge: 'Popular',
  },
  {
    id: 'p2',
    slug: 'air-zoom-pegasus',
    name: 'Air Zoom Pegasus',
    brand: 'Nike',
    category: 'Running',
    price: 130,
    rating: 4.7,
  },
  {
    id: 'p3',
    slug: 'ultraboost-22',
    name: 'Ultraboost 22',
    brand: 'Adidas',
    category: 'Running',
    price: 190,
    rating: 4.8,
    badge: 'New',
  },
  {
    id: 'p4',
    slug: 'stan-smith',
    name: 'Stan Smith',
    brand: 'Adidas',
    category: 'Lifestyle',
    price: 95,
    rating: 4.3,
  },
  {
    id: 'p5',
    slug: 'fresh-foam-x',
    name: 'Fresh Foam X',
    brand: 'New Balance',
    category: 'Running',
    price: 140,
    rating: 4.6,
  },
  {
    id: 'p6',
    slug: '574-core',
    name: '574 Core',
    brand: 'New Balance',
    category: 'Lifestyle',
    price: 80,
    rating: 4.2,
  },
]

const columns: DataGridColumnDef<Product>[] = [
  { id: 'name', accessorKey: 'name' },
  { id: 'brand', accessorKey: 'brand' },
  { id: 'category', accessorKey: 'category' },
  { id: 'price', accessorKey: 'price' },
]

const commerceQueryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 30_000 } },
})

async function getProducts(category: string, sort: string) {
  await new Promise((resolve) => setTimeout(resolve, 260))
  const rows =
    category === 'all' ? PRODUCTS : PRODUCTS.filter((product) => product.category === category)
  return [...rows].sort((a, b) =>
    sort === 'price-low'
      ? a.price - b.price
      : sort === 'rating'
        ? b.rating - a.rating
        : a.id.localeCompare(b.id),
  )
}

async function getProduct(slug: string) {
  await new Promise((resolve) => setTimeout(resolve, 180))
  return PRODUCTS.find((product) => product.slug === slug) ?? null
}

function ProductCard({ product }: { product: Product }) {
  return (
    <InteractiveCard>
      <div className="relative flex h-40 items-center justify-center bg-muted/50 text-6xl">
        👟{product.badge && <Badge className="absolute right-3 top-3">{product.badge}</Badge>}
      </div>
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs text-muted-foreground">
          {product.brand} · {product.category}
        </p>
        <h2 className="font-semibold">{product.name}</h2>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-semibold">${product.price}</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {product.rating}
          </span>
        </div>
      </CardContent>
    </InteractiveCard>
  )
}

function CatalogPage({ theme, basePath }: { theme?: React.CSSProperties; basePath: string }) {
  const navigate = useNavigate()
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('featured')
  const productsQuery = useQuery({
    queryKey: ['guide', 'commerce', 'products', category, sort],
    queryFn: () => getProducts(category, sort),
  })
  const sidebar = (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Category
      </p>
      {['all', 'Running', 'Lifestyle'].map((value) => (
        <Button
          key={value}
          variant={category === value ? 'secondary' : 'ghost'}
          size="sm"
          className="w-full justify-start"
          onClick={() => setCategory(value)}
        >
          {value === 'all' ? 'All products' : value}
        </Button>
      ))}
    </div>
  )
  const toolbar = (
    <>
      <span className="text-sm text-muted-foreground">
        {productsQuery.data?.length ?? 0} products
      </span>
      <div className="flex-1" />
      <Select value={sort} onValueChange={(value) => value && setSort(value)}>
        <SelectTrigger className="h-8 w-36 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="featured">Featured</SelectItem>
          <SelectItem value="price-low">Price: Low</SelectItem>
          <SelectItem value="rating">Top rated</SelectItem>
        </SelectContent>
      </Select>
    </>
  )

  return (
    <BrowseBodyTemplate
      theme={theme}
      className="layout-guide-commerce"
      topBar={<PageTopBar left="Guides / Commerce" />}
      title="Sneakers"
      description="A filterable catalog connected to a product destination."
      sidebar={sidebar}
      toolbar={toolbar}
    >
      <DataGridCard
        data={productsQuery.data ?? []}
        columns={columns}
        getRowId={(product) => product.id}
        isLoading={productsQuery.isLoading}
        onRowClick={(product) => navigate(`${basePath}/${product.slug}`)}
        minCardWidth={210}
        minColumns={2}
        renderCard={(row) => <ProductCard product={row.original} />}
        styles={{
          root: { overflow: 'visible' },
          frameInner: { overflow: 'visible' },
          content: { paddingInline: 0 },
        }}
      />
    </BrowseBodyTemplate>
  )
}

function ProductPage({
  theme,
  slug,
  basePath,
}: {
  theme?: React.CSSProperties
  slug: string
  basePath: string
}) {
  const navigate = useNavigate()
  const productQuery = useQuery({
    queryKey: ['guide', 'commerce', 'product', slug],
    queryFn: () => getProduct(slug),
  })
  const product = productQuery.data
  if (productQuery.isLoading)
    return (
      <DetailBodyTemplate theme={theme} topBar={<PageTopBar left="Guides / Commerce / Product" />}>
        <div className="h-72 animate-pulse rounded-xl bg-muted" />
      </DetailBodyTemplate>
    )
  if (!product)
    return (
      <DetailBodyTemplate theme={theme}>
        <Button onClick={() => navigate(basePath)}>Back to catalog</Button>
      </DetailBodyTemplate>
    )

  return (
    <DetailBodyTemplate
      theme={theme}
      className="layout-guide-commerce"
      variant="media"
      topBar={
        <PageTopBar
          left={
            <Button variant="ghost" size="sm" onClick={() => navigate(basePath)}>
              <ArrowLeft className="size-4" />
              Catalog / {product.name}
            </Button>
          }
        />
      }
      header={
        <DetailBodyTemplate.Header
          eyebrow={`${product.brand} · ${product.category}`}
          title={product.name}
          description="The detail route owns purchase decisions and product-specific state."
          status={<Badge>In stock</Badge>}
          actions={<Button size="sm">Add to cart</Button>}
        />
      }
      lead={
        <div className="flex min-h-80 items-center justify-center rounded-xl bg-muted/50 text-8xl">
          👟
        </div>
      }
      aside={
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="text-2xl font-semibold">${product.price}</p>
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">Free delivery · 30-day returns</p>
          <Button className="w-full">Choose size</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Product details</h2>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          BrowseBodyTemplate ends at discovery. This DetailBodyTemplate route begins the product
          decision flow without nesting page templates.
        </p>
      </div>
    </DetailBodyTemplate>
  )
}

function CommerceWorkflow({ theme }: { theme?: React.CSSProperties }) {
  const location = useLocation()
  const basePath = location.pathname.split('/').slice(0, 3).join('/')
  const slug = location.pathname.slice(basePath.length + 1)
  return slug ? (
    <ProductPage theme={theme} slug={slug} basePath={basePath} />
  ) : (
    <CatalogPage theme={theme} basePath={basePath} />
  )
}

export function CommerceWorkflowGuide({ theme }: { theme?: React.CSSProperties }) {
  const client = useMemo(() => commerceQueryClient, [])
  return (
    <QueryClientProvider client={client}>
      <CommerceWorkflow theme={theme} />
    </QueryClientProvider>
  )
}
