import React from 'react'
import {
  Badge,
  Button,
  DetailBodyTemplate,
  PageTopBar,
  Separator,
} from '@loykin/designkit'
import {
  Clock3,
  CreditCard,
  Heart,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  UserRound,
  Warehouse,
} from 'lucide-react'
import type { TemplateCodeContext } from '../../code'

const sizes = ['US 7', 'US 8', 'US 9', 'US 10', 'US 11']
const specs = [
  ['Brand', 'Nike'],
  ['Category', 'Lifestyle'],
  ['Upper', 'Engineered mesh'],
  ['Sole', 'Air Max cushioning'],
  ['Weight', '310g'],
]
const inventory = [
  ['Online', '842 pairs', 'Ready'],
  ['Seoul flagship', '18 pairs', 'Low'],
  ['Busan store', '42 pairs', 'Ready'],
]
const orderFields = [
  ['Order ID', 'ORD-2026-0527-1842'],
  ['Customer', 'Mina Park'],
  ['Payment', 'Captured'],
  ['Fulfillment', 'Partially shipped'],
  ['Risk', 'Low'],
]
const orderEvents = [
  ['10:24', 'Payment captured', 'Visa ending 4902'],
  ['10:31', 'Warehouse assigned', 'Seoul FC-02'],
  ['11:08', 'First parcel shipped', 'Tracking KR1842091'],
]

function ProductGallery() {
  return (
    <div className="grid h-full min-h-[28rem] grid-cols-[5rem_minmax(0,1fr)] gap-3 p-3">
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
      <div className="relative flex min-h-0 items-center justify-center overflow-hidden rounded-(--radius) bg-muted/40">
        <div className="absolute left-5 top-5 rounded-full bg-background/80 px-3 py-1 text-xs font-medium shadow-sm">
          Hero media
        </div>
        <div className="text-[9rem]">👟</div>
        <div className="absolute bottom-4 right-4 grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
          <span className="rounded-full bg-background/80 px-2 py-1">Mesh</span>
          <span className="rounded-full bg-background/80 px-2 py-1">Air</span>
          <span className="rounded-full bg-background/80 px-2 py-1">270</span>
        </div>
      </div>
    </div>
  )
}

function ProductAsideSlot() {
  return (
    <div className="space-y-4 rounded-(--radius) border bg-card p-4 text-card-foreground shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Retail price</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-2xl font-semibold">$150</span>
            <Badge variant="secondary">Popular</Badge>
          </div>
        </div>
        <Button variant="ghost" size="icon-sm">
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <Warehouse className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Inventory</span>
        </div>
        <div className="mt-2 space-y-1.5 text-xs">
          {inventory.map(([location, count, status]) => (
            <div key={location} className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">{location}</span>
              <span>{count}</span>
              <Badge variant={status === 'Low' ? 'destructive' : 'outline'} className="h-5 text-[10px]">
                {status}
              </Badge>
            </div>
          ))}
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

      <div className="space-y-2 rounded-(--radius) bg-muted/40 p-3 text-xs">
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
    <div className="grid h-full gap-3 sm:grid-cols-2 xl:grid-cols-1">
      <div className="rounded-(--radius) bg-muted/40 p-3">
        <p className="text-xs text-muted-foreground">Rating</p>
        <div className="mt-2 flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <p className="mt-1 text-sm font-medium">4.8 from 128 reviews</p>
      </div>
      <div className="rounded-(--radius) bg-muted/40 p-3">
        <p className="text-xs text-muted-foreground">Colorways</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="h-6 w-6 rounded-full bg-zinc-950 ring-2 ring-ring ring-offset-2 ring-offset-background" />
          <span className="h-6 w-6 rounded-full border bg-white" />
          <span className="h-6 w-6 rounded-full bg-blue-500" />
        </div>
      </div>
      <div className="rounded-(--radius) bg-muted/40 p-3 sm:col-span-2 xl:col-span-1">
        <p className="text-xs text-muted-foreground">Fulfillment</p>
        <div className="mt-2 flex items-center gap-2 text-sm font-medium">
          <Truck className="h-4 w-4" />
          Ships in 2 business days
        </div>
      </div>
    </div>
  )
}

function ProductLeadSlot({ variant }: { variant: 'media' | 'full' }) {
  return (
    <div
      className={[
        'grid gap-(--dk-panel-gap)',
        variant === 'media' && 'xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]',
        variant === 'full' && 'xl:grid-cols-1',
      ].filter(Boolean).join(' ')}
    >
      <div className="min-h-0 overflow-hidden rounded-(--radius) border bg-card">
        <ProductGallery />
      </div>
      <div className="min-h-0 rounded-(--radius) border bg-card p-(--dk-panel-gap) text-card-foreground">
        <Summary />
      </div>
    </div>
  )
}

function RecordLeadSlot() {
  return (
    <div className="space-y-(--dk-panel-gap)">
      <DetailBodyTemplate.Section title="Order record" surface="card">
        <div className="divide-y text-sm">
          {orderFields.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 py-2">
              <span className="text-muted-foreground">{label}</span>
              <span className="min-w-0 truncate font-medium">{value}</span>
            </div>
          ))}
        </div>
      </DetailBodyTemplate.Section>

      <DetailBodyTemplate.Section title="Operational signals" surface="bordered">
        <div className="grid gap-2 text-xs">
          <div className="flex items-center justify-between rounded-(--radius) bg-muted/40 px-3 py-2">
            <span className="text-muted-foreground">SLA remaining</span>
            <span className="font-medium">3h 12m</span>
          </div>
          <div className="flex items-center justify-between rounded-(--radius) bg-muted/40 px-3 py-2">
            <span className="text-muted-foreground">Fraud score</span>
            <span className="font-medium">12 / 100</span>
          </div>
          <div className="flex items-center justify-between rounded-(--radius) bg-muted/40 px-3 py-2">
            <span className="text-muted-foreground">Open tasks</span>
            <span className="font-medium">2</span>
          </div>
        </div>
      </DetailBodyTemplate.Section>
    </div>
  )
}

function RecordAsideSlot() {
  return (
    <div className="space-y-4 rounded-(--radius) border bg-card p-4 text-card-foreground shadow-sm">
      <div>
        <p className="text-xs text-muted-foreground">Current state</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xl font-semibold">Needs review</span>
          <Badge variant="secondary">Ops</Badge>
        </div>
      </div>

      <div className="grid gap-2">
        <Button size="sm">Release hold</Button>
        <Button variant="outline" size="sm">Contact customer</Button>
      </div>

      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <UserRound className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Assigned to</span>
        </div>
        <p className="text-sm text-muted-foreground">Operations / Jisoo Han</p>
      </div>

      <div className="space-y-2 rounded-(--radius) bg-muted/40 p-3 text-xs">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-muted-foreground" />
          SLA due today 16:00
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          Payment captured
        </div>
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-muted-foreground" />
          One parcel pending
        </div>
      </div>
    </div>
  )
}

function ProductContentTabs() {
  return [
    <DetailBodyTemplate.Tab key="overview" id="overview" label="Overview">
        <div className="grid gap-(--dk-panel-gap) xl:grid-cols-[minmax(0,1fr)_20rem]">
          <DetailBodyTemplate.Section title="Product story" surface="card">
            <div className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                The Air Max 270 brings visible cushioning to a clean lifestyle silhouette. The upper
                keeps the profile light while the heel unit gives each step a soft, responsive feel.
              </p>
              <p>
                This page uses the detail template's hero media, summary panel, sticky action aside,
                and tabbed detail region instead of composing a plain data page manually.
              </p>
            </div>
          </DetailBodyTemplate.Section>
          <DetailBodyTemplate.Section title="Highlights" surface="bordered">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Visible Air Max unit</li>
              <li>Breathable mesh construction</li>
              <li>Padded low-cut collar</li>
              <li>Rubber outsole for traction</li>
            </ul>
          </DetailBodyTemplate.Section>
        </div>
    </DetailBodyTemplate.Tab>,

    <DetailBodyTemplate.Tab key="specs" id="specs" label="Specs">
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
    </DetailBodyTemplate.Tab>,

    <DetailBodyTemplate.Tab key="shipping" id="shipping" label="Shipping">
        <div className="grid gap-(--dk-panel-gap) md:grid-cols-3">
          {[
            ['Standard', '2-4 business days', 'Free over $100'],
            ['Express', '1-2 business days', '$12'],
            ['Returns', '30 days', 'Unworn items only'],
          ].map(([title, detail, caption]) => (
            <DetailBodyTemplate.Section key={title} title={title} surface="card">
              <p className="text-sm font-medium">{detail}</p>
              <p className="mt-1 text-xs text-muted-foreground">{caption}</p>
            </DetailBodyTemplate.Section>
          ))}
        </div>
    </DetailBodyTemplate.Tab>,
  ]
}

function RecordContentTabs() {
  return [
    <DetailBodyTemplate.Tab key="timeline" id="timeline" label="Timeline">
        <DetailBodyTemplate.Section title="Activity timeline" surface="card">
          <div className="divide-y text-sm">
            {orderEvents.map(([time, title, detail]) => (
              <div key={`${time}-${title}`} className="grid grid-cols-[4rem_minmax(0,1fr)] gap-3 py-3">
                <span className="text-xs text-muted-foreground">{time}</span>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </DetailBodyTemplate.Section>
    </DetailBodyTemplate.Tab>,

    <DetailBodyTemplate.Tab key="items" id="items" label="Items" count={3}>
        <DetailBodyTemplate.Section title="Order items" surface="bordered">
          <div className="divide-y text-sm">
            {[
              ['Air Max 270 / US 9', '1', '$150'],
              ['Everyday socks / Black', '2', '$24'],
              ['Shipping protection', '1', '$3'],
            ].map(([item, qty, total]) => (
              <div key={item} className="grid grid-cols-[minmax(0,1fr)_3rem_4rem] gap-3 py-2">
                <span className="min-w-0 truncate">{item}</span>
                <span className="text-muted-foreground">{qty}</span>
                <span className="text-right font-medium">{total}</span>
              </div>
            ))}
          </div>
        </DetailBodyTemplate.Section>
    </DetailBodyTemplate.Tab>,

    <DetailBodyTemplate.Tab key="notes" id="notes" label="Notes">
        <DetailBodyTemplate.Section title="Internal notes" surface="card">
          <p className="text-sm leading-6 text-muted-foreground">
            Customer requested delivery before Friday. Warehouse hold was added after partial
            shipment because one item needs stock confirmation.
          </p>
        </DetailBodyTemplate.Section>
    </DetailBodyTemplate.Tab>,
  ]
}

export function DetailBodyTemplateDemo({
  theme,
  detailVariant = 'media',
}: {
  theme?: React.CSSProperties
  detailVariant?: string
}) {
  const variant = detailVariant === 'full' ? 'full' : detailVariant === 'record' ? 'record' : 'media'
  const isRecord = variant === 'record'
  const productVariant = variant === 'full' ? 'full' : 'media'

  return (
    <DetailBodyTemplate
      variant={variant}
      theme={theme}
      topBar={<PageTopBar left={isRecord ? 'Operations / Orders / ORD-2026-0527-1842' : 'Store / Sneakers / Air Max 270'} />}
      header={
        <DetailBodyTemplate.Header
          eyebrow={isRecord ? 'Order · Operations' : 'Nike · Lifestyle'}
          title={isRecord ? 'ORD-2026-0527-1842' : 'Air Max 270'}
          description={isRecord ? 'Single order record with payment, fulfillment, activity, and operational controls.' : 'Everyday sneaker with visible Air cushioning and a breathable mesh upper.'}
          status={<Badge>{isRecord ? 'Needs review' : 'In stock'}</Badge>}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm">{isRecord ? 'Add note' : 'Share'}</Button>
              <Button size="sm">{isRecord ? 'Resolve' : 'Publish'}</Button>
            </div>
          }
        />
      }
      lead={isRecord ? <RecordLeadSlot /> : <ProductLeadSlot variant={productVariant} />}
      aside={isRecord ? <RecordAsideSlot /> : <ProductAsideSlot />}
    >
      {isRecord ? RecordContentTabs() : ProductContentTabs()}
    </DetailBodyTemplate>
  )
}

export function buildDetailTemplateCode({ definition, themeProp }: TemplateCodeContext) {
  const variant = definition.id === 'detail-record'
    ? 'record'
    : definition.id === 'detail-full'
      ? 'full'
      : 'media'

  if (variant === 'record') {
    return [
      `import { DetailBodyTemplate, PageTopBar, Badge, Button } from '@loykin/designkit'`,
      `import '@loykin/designkit/styles'`,
      ``,
      `export function OrderRecordPage() {`,
      `  return (`,
      `    <DetailBodyTemplate${themeProp}`,
      `      variant="record"`,
      `      topBar={<PageTopBar left="Operations / Orders / ORD-2026-0527-1842" />}`,
      `      header={<DetailBodyTemplate.Header`,
      `        eyebrow="Order · Operations"`,
      `        title="ORD-2026-0527-1842"`,
      `        description="Single record with activity, metadata, and operational controls."`,
      `        status={<Badge>Needs review</Badge>}`,
      `        actions={<Button>Resolve</Button>}`,
      `      />}`,
      `      lead={<RecordLeadSlot />}`,
      `      aside={<RecordAsideSlot />}`,
      `    >`,
      `      <DetailBodyTemplate.Tab id="timeline" label="Timeline">`,
      `        <DetailBodyTemplate.Section title="Activity timeline" surface="card">`,
      `          {/* record activity */}`,
      `        </DetailBodyTemplate.Section>`,
      `      </DetailBodyTemplate.Tab>`,
      `      <DetailBodyTemplate.Tab id="items" label="Items">`,
      `        {/* related rows */}`,
      `      </DetailBodyTemplate.Tab>`,
      `    </DetailBodyTemplate>`,
      `  )`,
      `}`,
    ].join('\n')
  }

  if (variant === 'full') {
    return [
      `import { DetailBodyTemplate, PageTopBar, Badge, Button } from '@loykin/designkit'`,
      `import '@loykin/designkit/styles'`,
      ``,
      `export function FullDetailPage() {`,
      `  return (`,
      `    <DetailBodyTemplate${themeProp}`,
      `      variant="full"`,
      `      topBar={<PageTopBar left="Store / Sneakers / Air Max 270" />}`,
      `      header={<DetailBodyTemplate.Header`,
      `        eyebrow="Nike · Lifestyle"`,
      `        title="Air Max 270"`,
      `        description="Detail page with lead and actions grouped above the content."`,
      `        status={<Badge>In stock</Badge>}`,
      `        actions={<Button>Publish</Button>}`,
      `      />}`,
      `      lead={<ProductLeadSlot />}`,
      `      aside={<ProductAsideSlot />}`,
      `    >`,
      `      <DetailBodyTemplate.Tab id="overview" label="Overview">`,
      `        <DetailBodyTemplate.Section title="Product story" surface="card">`,
      `          {/* primary content below the full-width lead area */}`,
      `        </DetailBodyTemplate.Section>`,
      `      </DetailBodyTemplate.Tab>`,
      `    </DetailBodyTemplate>`,
      `  )`,
      `}`,
    ].join('\n')
  }

  return [
    `import { DetailBodyTemplate, PageTopBar, Badge, Button } from '@loykin/designkit'`,
    `import '@loykin/designkit/styles'`,
    ``,
    `export function ProductDetailPage() {`,
    `  return (`,
    `    <DetailBodyTemplate${themeProp}`,
    `      variant="media"`,
    `      topBar={<PageTopBar left="Store / Sneakers / Air Max 270" />}`,
    `      header={<DetailBodyTemplate.Header`,
    `        eyebrow="Nike · Lifestyle"`,
    `        title="Air Max 270"`,
    `        description="Everyday sneaker with visible Air cushioning."`,
    `        status={<Badge>In stock</Badge>}`,
    `        actions={<Button>Publish</Button>}`,
    `      />}`,
    `      lead={<ProductLeadSlot />}`,
    `      aside={<ProductAsideSlot />}`,
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
