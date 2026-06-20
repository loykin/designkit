import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  Badge,
  Button,
  DetailBodyTemplate,
  PageTopBar,
} from '@loykin/designkit'
import './index.css'

function LeadSlot({ label }: { label: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--dk-panel-gap)',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(12rem, 18rem)',
      }}
    >
      <div style={{ minHeight: 160, border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
        {label} lead
      </div>
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
        Summary
      </div>
    </div>
  )
}

function AsideSlot({ label }: { label: string }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
      <p>{label} actions</p>
      <Button size="sm">Save</Button>
    </div>
  )
}

function DetailCase({ variant }: { variant: 'media' | 'record' | 'full' }) {
  return (
    <div style={{ height: 560, border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      <DetailBodyTemplate
        variant={variant}
        topBar={<PageTopBar left={`Consumer / ${variant}`} />}
        header={
          <DetailBodyTemplate.Header
            eyebrow="Consumer check"
            title={`${variant} detail`}
            description="Installed from the packed @loykin/designkit package."
            status={<Badge>{variant}</Badge>}
            actions={<Button size="sm">Action</Button>}
          />
        }
        lead={<LeadSlot label={variant} />}
        aside={<AsideSlot label={variant} />}
      >
        <DetailBodyTemplate.Tab id="overview" label="Overview">
          <DetailBodyTemplate.Section title="Overview" surface="card">
            Primary detail content.
          </DetailBodyTemplate.Section>
        </DetailBodyTemplate.Tab>
        <DetailBodyTemplate.Tab id="activity" label="Activity" count={2}>
          <DetailBodyTemplate.Section title="Activity" surface="bordered">
            Related activity content.
          </DetailBodyTemplate.Section>
        </DetailBodyTemplate.Tab>
      </DetailBodyTemplate>
    </div>
  )
}

function App() {
  return (
    <main style={{ display: 'grid', gap: 24, padding: 24 }}>
      <div data-consumer-responsive-check className="hidden md:block">
        Responsive utility check
      </div>
      <DetailCase variant="media" />
      <DetailCase variant="record" />
      <DetailCase variant="full" />
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
