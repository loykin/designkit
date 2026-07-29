import type { CSSProperties } from 'react'
import {
  Badge,
  Button,
  DetailBodyTemplate,
  PageTopBar,
} from '@loykin/designkit'
import {
  RecordAsideSlot,
  RecordContentTabs,
  RecordLeadSlot,
} from './DetailBodyTemplateDemo'

export function OrderRecordDetailDemo({ theme }: { theme?: CSSProperties }) {
  return (
    <DetailBodyTemplate
      variant="record"
      theme={theme}
      topBar={<PageTopBar left="Operations / Orders / ORD-2026-0527-1842" />}
      header={
        <DetailBodyTemplate.Header
          eyebrow="Order · Operations"
          title="ORD-2026-0527-1842"
          description="Single order record with payment, fulfillment, activity, and operational controls."
          status={<Badge>Needs review</Badge>}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Add note</Button>
              <Button size="sm">Resolve</Button>
            </div>
          }
        />
      }
      lead={<RecordLeadSlot />}
      aside={<RecordAsideSlot />}
    >
      {RecordContentTabs()}
    </DetailBodyTemplate>
  )
}
