import React from 'react'
import {
  Badge,
  Button,
  DetailBodyTemplate,
  PageTopBar,
  Separator,
} from '@loykin/designkit'
import { Heart, PackageCheck, RotateCcw, ShieldCheck, ShoppingCart, Star } from 'lucide-react'
import type { TemplateCodeContext } from '../../code'

const sizes = ['US 7', 'US 8', 'US 9', 'US 10', 'US 11']
const specs = [
  ['Brand', 'Nike'],
  ['Category', 'Lifestyle'],
  ['Upper', 'Engineered mesh'],
  ['Sole', 'Air Max cushioning'],
  ['Weight', '310g'],
]

function ProductGallery() {
  return (
    <div className="grid h-full min-h-96 grid-cols-[5rem_minmax(0,1fr)] gap-3 p-3">
      <div className="flex flex-col gap-2">
        {['270', 'Air', 'Side', 'Sole'].map((label) => (
          <button
            key={label}
            className="flex aspect-square items-center justify-center rounded-(--radius) border bg-muted/40 text-xs font-medium text-muted-foreground"
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex min-h-0 items-center justify-center rounded-(--radius) bg-muted/40 text-8xl">
        👟
      </div>
    </div>
  )
}

function PurchasePanel() {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold">$150</span>
          <Badge variant="secondary">Popular</Badge>
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          ))}
          <span className="ml-1">4.8 · 128 reviews</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Size</span>
          <button className="text-xs text-muted-foreground hover:text-foreground">Size guide</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              className="h-9 rounded-(--radius) border text-xs font-medium hover:bg-muted"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <Button className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          Add to cart
        </Button>
        <Button variant="outline" className="gap-2">
          <Heart className="h-4 w-4" />
          Save
        </Button>
      </div>

      <div className="space-y-2 rounded-(--radius) border p-3 text-xs">
        <div className="flex items-center gap-2">
          <PackageCheck className="h-4 w-4 text-muted-foreground" />
          Free shipping over $100
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-muted-foreground" />
          30-day returns
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          Secure checkout
        </div>
      </div>
    </div>
  )
}

function Summary() {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Color</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-zinc-950 ring-2 ring-ring ring-offset-2 ring-offset-background" />
          <span className="h-5 w-5 rounded-full border bg-white" />
          <span className="h-5 w-5 rounded-full bg-blue-500" />
        </div>
      </div>
      <Separator />
      <p className="text-sm leading-6 text-muted-foreground">
        Lightweight cushioning, breathable mesh, and a sculpted Air unit built for all-day wear.
      </p>
    </div>
  )
}

export function DetailBodyTemplateDemo({ theme }: { theme?: React.CSSProperties }) {
  return (
    <DetailBodyTemplate
      theme={theme}
      topBar={<PageTopBar left="Store / Sneakers / Air Max 270" />}
      eyebrow="Nike · Lifestyle"
      title="Air Max 270"
      description="Everyday sneaker with visible Air cushioning and a breathable mesh upper."
      status={<Badge>In stock</Badge>}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Share</Button>
          <Button size="sm">Publish</Button>
        </div>
      }
      media={<ProductGallery />}
      summary={<Summary />}
      aside={<PurchasePanel />}
    >
      <DetailBodyTemplate.Tab id="overview" label="Overview">
        <DetailBodyTemplate.Section title="Product story" surface="card">
          <p className="text-sm leading-6 text-muted-foreground">
            The Air Max 270 brings visible cushioning to a clean lifestyle silhouette. The upper
            keeps the profile light while the heel unit gives each step a soft, responsive feel.
          </p>
        </DetailBodyTemplate.Section>
      </DetailBodyTemplate.Tab>

      <DetailBodyTemplate.Tab id="specs" label="Specs">
        <DetailBodyTemplate.Section title="Specifications" surface="bordered">
          <div className="divide-y text-sm">
            {specs.map(([label, value]) => (
              <div key={label} className="grid grid-cols-3 gap-3 py-2">
                <span className="text-muted-foreground">{label}</span>
                <span className="col-span-2">{value}</span>
              </div>
            ))}
          </div>
        </DetailBodyTemplate.Section>
      </DetailBodyTemplate.Tab>

      <DetailBodyTemplate.Tab id="shipping" label="Shipping">
        <DetailBodyTemplate.Section title="Shipping and returns" surface="card">
          <p className="text-sm leading-6 text-muted-foreground">
            Ships within 2 business days. Returns are accepted for unworn items within 30 days.
          </p>
        </DetailBodyTemplate.Section>
      </DetailBodyTemplate.Tab>
    </DetailBodyTemplate>
  )
}

export function buildDetailTemplateCode({ themeProp }: TemplateCodeContext) {
  return [
    `import { DetailBodyTemplate, PageTopBar, Badge, Button } from '@loykin/designkit'`,
    `import '@loykin/designkit/styles'`,
    ``,
    `export function ProductDetailPage() {`,
    `  return (`,
    `    <DetailBodyTemplate${themeProp}`,
    `      topBar={<PageTopBar left="Store / Sneakers / Air Max 270" />}`,
    `      eyebrow="Nike · Lifestyle"`,
    `      title="Air Max 270"`,
    `      description="Everyday sneaker with visible Air cushioning."`,
    `      status={<Badge>In stock</Badge>}`,
    `      actions={<Button>Publish</Button>}`,
    `      media={<ProductGallery />}`,
    `      summary={<ProductSummary />}`,
    `      aside={<PurchasePanel />}`,
    `    >`,
    `      <DetailBodyTemplate.Tab id="overview" label="Overview">`,
    `        <DetailBodyTemplate.Section title="Product story" surface="card">`,
    `          {/* product content */}`,
    `        </DetailBodyTemplate.Section>`,
    `      </DetailBodyTemplate.Tab>`,
    `      <DetailBodyTemplate.Tab id="specs" label="Specs">`,
    `        {/* specifications */}`,
    `      </DetailBodyTemplate.Tab>`,
    `    </DetailBodyTemplate>`,
    `  )`,
    `}`,
  ].join('\n')
}

