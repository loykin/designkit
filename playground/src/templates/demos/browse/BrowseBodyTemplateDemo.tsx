import React, { useState, useMemo } from 'react'
import {
  BrowseBodyTemplate,
  PageTopBar,
  Badge,
  Checkbox,
  Separator,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@loykin/designkit'
import { DataGridCard, type DataGridColumnDef } from '@loykin/gridkit'
import { LayoutGrid, LayoutList, Star } from 'lucide-react'
import { Button } from '@loykin/designkit'
import type { TemplateCodeContext } from '../../code'

// ─── Types & data ─────────────────────────────────────────────────────────────

interface Product {
  id: string
  name: string
  brand: string
  category: string
  color: string
  price: number
  rating: number
  badge?: 'New' | 'Popular' | 'Sale'
}

const PRODUCTS: Product[] = [
  { id:  '1', name: 'Air Max 270',       brand: 'Nike',        category: 'Lifestyle', color: 'Black',  price: 150, rating: 4.5, badge: 'Popular' },
  { id:  '2', name: 'Air Zoom Pegasus',  brand: 'Nike',        category: 'Running',   color: 'White',  price: 130, rating: 4.7 },
  { id:  '3', name: 'React Infinity',    brand: 'Nike',        category: 'Running',   color: 'Blue',   price: 160, rating: 4.6, badge: 'New' },
  { id:  '4', name: 'Free RN 5.0',       brand: 'Nike',        category: 'Training',  color: 'Grey',   price: 110, rating: 4.4 },
  { id:  '5', name: 'Ultraboost 22',     brand: 'Adidas',      category: 'Running',   color: 'Black',  price: 190, rating: 4.8, badge: 'New' },
  { id:  '6', name: 'Stan Smith',        brand: 'Adidas',      category: 'Lifestyle', color: 'White',  price: 95,  rating: 4.3 },
  { id:  '7', name: 'Forum Low',         brand: 'Adidas',      category: 'Lifestyle', color: 'White',  price: 100, rating: 4.1 },
  { id:  '8', name: 'Supernova',         brand: 'Adidas',      category: 'Running',   color: 'Blue',   price: 120, rating: 4.3 },
  { id:  '9', name: 'NMD_R1',            brand: 'Adidas',      category: 'Lifestyle', color: 'Black',  price: 140, rating: 4.5, badge: 'Sale' },
  { id: '10', name: 'Fresh Foam X',      brand: 'New Balance', category: 'Running',   color: 'Grey',   price: 140, rating: 4.6 },
  { id: '11', name: '574 Core',          brand: 'New Balance', category: 'Lifestyle', color: 'Navy',   price: 80,  rating: 4.2 },
  { id: '12', name: '1080 v12',          brand: 'New Balance', category: 'Running',   color: 'Black',  price: 185, rating: 4.9, badge: 'Popular' },
]

const BRANDS     = ['Nike', 'Adidas', 'New Balance']
const CATEGORIES = ['Lifestyle', 'Running', 'Training']
const COLORS     = ['Black', 'White', 'Grey', 'Blue', 'Navy']
const PRICE_CAPS = [
  { label: 'Under $100', max: 99 },
  { label: 'Under $150', max: 149 },
  { label: 'Under $200', max: 199 },
]

const COLOR_SWATCH: Record<string, string> = {
  Black: 'bg-zinc-900',
  White: 'bg-white border border-zinc-300',
  Grey:  'bg-zinc-400',
  Blue:  'bg-blue-500',
  Navy:  'bg-blue-900',
}

const BADGE_VARIANT: Record<string, 'default' | 'secondary' | 'destructive'> = {
  New:     'default',
  Popular: 'secondary',
  Sale:    'destructive',
}

const columns: DataGridColumnDef<Product>[] = [
  { id: 'id',       accessorKey: 'id' },
  { id: 'name',     accessorKey: 'name' },
  { id: 'brand',    accessorKey: 'brand' },
  { id: 'category', accessorKey: 'category' },
  { id: 'color',    accessorKey: 'color' },
  { id: 'price',    accessorKey: 'price' },
]

// ─── Filter state ─────────────────────────────────────────────────────────────

interface Filters {
  brands:     string[]
  categories: string[]
  colors:     string[]
  maxPrice:   number | null
}

const EMPTY: Filters = { brands: [], categories: [], colors: [], maxPrice: null }

function countActive(f: Filters) {
  return f.brands.length + f.categories.length + f.colors.length + (f.maxPrice !== null ? 1 : 0)
}

// ─── Small pieces ─────────────────────────────────────────────────────────────

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function CheckItem({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 select-none">
      <Checkbox checked={checked} onCheckedChange={onToggle} className="h-3.5 w-3.5 rounded-sm" />
      <span className="text-sm">{label}</span>
    </label>
  )
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`h-2.5 w-2.5 ${i < Math.round(value) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`} />
      ))}
      <span className="ml-1 text-[11px] text-muted-foreground">{value}</span>
    </div>
  )
}

// ─── Product card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-(--radius) border bg-card transition-shadow hover:shadow-md cursor-pointer h-full">
      <div className="relative flex h-36 items-center justify-center bg-muted/40 text-5xl select-none">
        👟
        {product.badge && (
          <Badge
            variant={BADGE_VARIANT[product.badge]}
            className="absolute top-2 right-2 text-[10px] px-1.5 py-0"
          >
            {product.badge}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <p className="text-[11px] text-muted-foreground">{product.brand}</p>
          <p className="text-sm font-medium leading-tight">{product.name}</p>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm font-semibold">${product.price}</span>
          <div className="flex items-center gap-1.5">
            <div className={`h-3 w-3 rounded-full ${COLOR_SWATCH[product.color] ?? 'bg-zinc-300'}`} />
            <span className="text-[11px] text-muted-foreground">{product.color}</span>
          </div>
        </div>
        <StarRating value={product.rating} />
      </div>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function FilterSidebar({
  filters,
  onToggle,
  onSetPrice,
}: {
  filters: Filters
  onToggle: (key: keyof Pick<Filters, 'brands' | 'categories' | 'colors'>, value: string) => void
  onSetPrice: (max: number | null) => void
}) {
  return (
    <div className="space-y-5">
      <FilterGroup title="Brand">
        {BRANDS.map((b) => (
          <CheckItem key={b} label={b} checked={filters.brands.includes(b)}
            onToggle={() => onToggle('brands', b)} />
        ))}
      </FilterGroup>

      <Separator />

      <FilterGroup title="Category">
        {CATEGORIES.map((c) => (
          <CheckItem key={c} label={c} checked={filters.categories.includes(c)}
            onToggle={() => onToggle('categories', c)} />
        ))}
      </FilterGroup>

      <Separator />

      <FilterGroup title="Color">
        {COLORS.map((c) => (
          <label key={c} className="flex cursor-pointer items-center gap-2.5 select-none">
            <Checkbox checked={filters.colors.includes(c)} onCheckedChange={() => onToggle('colors', c)}
              className="h-3.5 w-3.5 rounded-sm" />
            <div className={`h-3 w-3 rounded-full ${COLOR_SWATCH[c] ?? 'bg-zinc-300'}`} />
            <span className="text-sm">{c}</span>
          </label>
        ))}
      </FilterGroup>

      <Separator />

      <FilterGroup title="Price">
        {PRICE_CAPS.map((r) => (
          <CheckItem key={r.label} label={r.label}
            checked={filters.maxPrice === r.max}
            onToggle={() => onSetPrice(filters.maxPrice === r.max ? null : r.max)} />
        ))}
      </FilterGroup>
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

export function BrowseBodyTemplateDemo({ theme }: { theme?: React.CSSProperties }) {
  const [filters, setFilters] = useState<Filters>(EMPTY)
  const [sort, setSort] = useState('featured')

  const toggle = (key: keyof Pick<Filters, 'brands' | 'categories' | 'colors'>, value: string) =>
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }))

  const filteredProducts = useMemo(() => {
    const list = PRODUCTS.filter((p) => {
      if (filters.brands.length     && !filters.brands.includes(p.brand))       return false
      if (filters.categories.length && !filters.categories.includes(p.category)) return false
      if (filters.colors.length     && !filters.colors.includes(p.color))       return false
      return !(filters.maxPrice !== null && p.price > filters.maxPrice);

    })
    if (sort === 'price-asc')  return [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') return [...list].sort((a, b) => b.price - a.price)
    if (sort === 'rating')     return [...list].sort((a, b) => b.rating - a.rating)
    return list
  }, [filters, sort])

  const activeCount = countActive(filters)

  const sidebar = (
    <FilterSidebar
      filters={filters}
      onToggle={toggle}
      onSetPrice={(max) => setFilters((f) => ({ ...f, maxPrice: max }))}
    />
  )

  const toolbar = (
    <>
      <span className="text-sm text-muted-foreground shrink-0">
        {filteredProducts.length} products
      </span>
      <div className="flex-1" />
      <Select value={sort} onValueChange={setSort}>
        <SelectTrigger className="h-8 w-36 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="featured">Featured</SelectItem>
          <SelectItem value="price-asc">Price: Low → High</SelectItem>
          <SelectItem value="price-desc">Price: High → Low</SelectItem>
          <SelectItem value="rating">Top Rated</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon-sm"><LayoutGrid className="h-3.5 w-3.5" /></Button>
        <Button variant="ghost" size="icon-sm"><LayoutList className="h-3.5 w-3.5" /></Button>
      </div>
      {activeCount > 0 && (
        <Button variant="ghost" size="sm" className="h-8 text-xs"
          onClick={() => setFilters(EMPTY)}>
          Clear ({activeCount})
        </Button>
      )}
    </>
  )

  return (
    <BrowseBodyTemplate
      theme={theme}
      topBar={<PageTopBar left="Store / Women" />}
      title="Sneakers"
      sidebar={sidebar}
      sidebarTitle="Filters"
      toolbar={toolbar}
    >
      <DataGridCard
        data={filteredProducts}
        columns={columns}
        getRowId={(row) => row.id}
        minCardWidth={180}
        minColumns={2}
        renderCard={(row) => <ProductCard product={row.original} />}
      />
    </BrowseBodyTemplate>
  )
}

export function buildBrowseBodyTemplateCode({ themeProp }: TemplateCodeContext) {
  return [
    `import { BrowseBodyTemplate, PageTopBar, Checkbox, Separator } from '@loykin/designkit'`,
    `import { DataGridCard, type DataGridColumnDef } from '@loykin/gridkit'`,
    ``,
    `export function ProductListPage() {`,
    `  const [filters, setFilters] = useState(EMPTY_FILTERS)`,
    `  const filtered = useMemo(() => applyFilters(products, filters), [filters])`,
    ``,
    `  return (`,
    `    <BrowseBodyTemplate${themeProp}`,
    `      topBar={<PageTopBar left="Store / Women" />}`,
    `      title="Sneakers"`,
    `      sidebar={<FilterPanel filters={filters} onChange={setFilters} />}`,
    `      toolbar={<SortToolbar />}`,
    `    >`,
    `      <DataGridCard`,
    `        data={filtered}`,
    `        columns={columns}`,
    `        getRowId={(row) => row.id}`,
    `        tableHeight={480}`,
    `        minCardWidth={180}`,
    `        renderCard={(row) => <ProductCard product={row.original} />}`,
    `      />`,
    `    </BrowseBodyTemplate>`,
    `  )`,
    `}`,
  ].join('\n')
}
