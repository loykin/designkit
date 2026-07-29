import type { CSSProperties } from 'react'
import {
  Badge,
  Button,
  DetailBodyTemplate,
  PageTopBar,
} from '@loykin/designkit'
import {
  ProductAsideSlot,
  ProductContentTabs,
  ProductLeadSlot,
} from './DetailBodyTemplateDemo'

export function ProductFullDetailDemo({ theme }: { theme?: CSSProperties }) {
  return (
    <DetailBodyTemplate
      variant="full"
      theme={theme}
      topBar={<PageTopBar left="Store / Sneakers / Air Max 270" />}
      header={
        <DetailBodyTemplate.Header
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
        />
      }
      lead={<ProductLeadSlot variant="full" />}
      aside={<ProductAsideSlot />}
    >
      {ProductContentTabs()}
    </DetailBodyTemplate>
  )
}
