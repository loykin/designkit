import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, SlidersHorizontal, Plus } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CardItem {
  id: string
  title: string
  subtitle?: string
  badge?: string
  meta?: string
  color?: string
}

export interface CardListBodyTemplateProps {
  title?: string
  actions?: React.ReactNode
  filters?: React.ReactNode
  items?: CardItem[]
  /** Number of columns in the grid */
  cols?: 2 | 3 | 4
  renderCard?: (item: CardItem) => React.ReactNode
}

// ─── Demo defaults ────────────────────────────────────────────────────────────

const demoItems: CardItem[] = [
  { id: '1', title: 'Sony WH-1000XM5',      subtitle: 'Noise-cancelling headphones', badge: 'Best Seller', meta: '$349', color: 'from-violet-500 to-purple-600' },
  { id: '2', title: 'Keychron Q1 Pro',       subtitle: 'Mechanical keyboard',         badge: 'New',         meta: '$199', color: 'from-blue-500 to-indigo-600'   },
  { id: '3', title: 'LG 4K UltraFine 27"',   subtitle: 'USB-C monitor',               badge: 'Sale',        meta: '$599', color: 'from-slate-600 to-slate-800'   },
  { id: '4', title: 'Logitech MX Master 3S', subtitle: 'Wireless mouse',              badge: undefined,     meta: '$99',  color: 'from-emerald-500 to-teal-600'  },
  { id: '5', title: 'Elgato Key Light',      subtitle: 'Studio lighting',             badge: 'Sale',        meta: '$149', color: 'from-amber-400 to-orange-500'  },
  { id: '6', title: 'Samsung T7 1TB',        subtitle: 'Portable SSD',               badge: undefined,     meta: '$79',  color: 'from-rose-500 to-pink-600'     },
]

const demoFilterGroups = [
  { label: 'Category',   options: ['All', 'Audio', 'Input', 'Display', 'Storage'] },
  { label: 'Price',      options: ['Under $50', '$50–$200', 'Over $200'] },
]

function DefaultCard({ item }: { item: CardItem }) {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all cursor-pointer">
      <div className={`h-36 bg-gradient-to-br ${item.color} flex items-center justify-center relative`}>
        <div className="w-16 h-16 rounded-[--radius] bg-white/20 backdrop-blur-sm" />
        {item.badge && (
          <Badge className="absolute top-2 left-2 text-xs bg-white/20 text-white border-white/30">{item.badge}</Badge>
        )}
      </div>
      <CardContent className="p-3">
        <p className="font-medium text-sm leading-tight">{item.title}</p>
        {item.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>}
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold">{item.meta}</span>
          <Button size="sm" className="h-7 text-xs">Add</Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Template ─────────────────────────────────────────────────────────────────

const colClass: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
}

export function CardListBodyTemplate({
  title = 'Products',
  actions,
  filters,
  items = demoItems,
  cols = 3,
  renderCard,
}: CardListBodyTemplateProps) {
  return (
    <div className="h-full flex gap-0">
      {/* Filter sidebar */}
      <aside className="w-48 shrink-0 border-r p-4 overflow-auto flex flex-col gap-4">
        {filters ?? demoFilterGroups.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{group.label}</p>
            <div className="space-y-1">
              {group.options.map((opt) => (
                <button key={opt} className={`block w-full text-left px-2 py-1.5 rounded-[--radius] text-sm transition-colors ${opt === 'All' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b shrink-0">
          <h1 className="text-base font-semibold mr-auto">{title}</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 h-9 w-48" />
          </div>
          {actions ?? (
            <>
              <Button variant="outline" size="sm" className="gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5" />Filter
              </Button>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />New
              </Button>
            </>
          )}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-auto p-6">
          <div className={`grid ${colClass[cols]} gap-4`}>
            {items.map((item) => (
              <div key={item.id}>
                {renderCard ? renderCard(item) : <DefaultCard item={item} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
