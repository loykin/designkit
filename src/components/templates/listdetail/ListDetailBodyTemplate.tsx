import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { DataPage } from '../datapage/DataPage'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export interface ListDetailBodyTemplateProps {
  theme?: CSSProperties
  className?: string
  topBar?: ReactNode
  /** List pane content — typically a DataGrid, DataGridList, or navigation list */
  list: ReactNode
  /**
   * Detail pane content. When undefined, `emptyDetail` is shown on desktop
   * and the list pane fills the screen on mobile.
   */
  detail?: ReactNode
  /** Placeholder rendered in the detail pane when nothing is selected */
  emptyDetail?: ReactNode
  /** Width of the list pane in px. Default: 320 */
  listWidth?: number
  listClassName?: string
  detailClassName?: string
  /** Called when the mobile back button is pressed — use to clear the selected item */
  onBack?: () => void
  /** Label for the mobile back button. Default: "Back" */
  backLabel?: string
}

export function ListDetailBodyTemplate({
  theme,
  className,
  topBar,
  list,
  detail,
  emptyDetail,
  listWidth = 320,
  listClassName,
  detailClassName,
  onBack,
  backLabel = 'Back',
}: ListDetailBodyTemplateProps) {
  return (
    <DataPage
      className={cn('layout-list-detail', className)}
      style={{ '--ld-list-width': `${listWidth}px`, ...theme } as CSSProperties}
    >
      {topBar && <div className="shrink-0">{topBar}</div>}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside
          className={cn(
            'min-h-0 shrink-0 overflow-hidden border-r',
            detail
              ? 'hidden lg:flex lg:w-[var(--ld-list-width)] lg:flex-col'
              : 'flex w-full flex-col lg:w-[var(--ld-list-width)]',
            listClassName,
          )}
        >
          {list}
        </aside>
        <main
          className={cn(
            'flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden',
            !detail && 'hidden lg:flex',
            detailClassName,
          )}
        >
          {detail && onBack && (
            <div className="flex shrink-0 items-center border-b px-3 py-2 lg:hidden">
              <Button variant="ghost" size="sm" className="-ml-1 gap-1" onClick={onBack}>
                <ChevronLeft className="h-4 w-4" />
                {backLabel}
              </Button>
            </div>
          )}
          <div className="min-h-0 flex-1 overflow-auto">{detail ?? emptyDetail}</div>
        </main>
      </div>
    </DataPage>
  )
}
