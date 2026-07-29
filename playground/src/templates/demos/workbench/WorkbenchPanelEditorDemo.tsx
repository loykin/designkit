import { useState, type CSSProperties } from 'react'
import {
  Badge,
  Button,
  PageTopBar,
  WorkbenchBodyTemplate,
} from '@loykin/designkit'
import {
  FileCode2,
  PanelRightClose,
  PanelRightOpen,
  Save,
  X,
} from 'lucide-react'
import {
  PanelInspector,
  PanelPreview,
  QueryPane,
} from './WorkbenchBodyTemplateDemos'

export function WorkbenchPanelEditorDemo({ theme }: { theme?: CSSProperties }) {
  const [rightCollapsed, setRightCollapsed] = useState(false)
  const [bottomCollapsed, setBottomCollapsed] = useState(false)

  return (
    <WorkbenchBodyTemplate
      theme={theme}
      className="layout-workbench-panel-editor"
      topBar={
        <PageTopBar
          left="Dashboards / Infrastructure / Edit panel"
          right={
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="sm"><X />Cancel</Button>
              <Button variant="outline" size="sm">Apply</Button>
              <Button size="sm"><Save />Save</Button>
            </div>
          }
        />
      }
      headerRight={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBottomCollapsed((value) => !value)}
          >
            <FileCode2 />Query
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setRightCollapsed((value) => !value)}
          >
            {rightCollapsed ? <PanelRightOpen /> : <PanelRightClose />}
          </Button>
        </>
      }
      title="Panel editor"
      status={<Badge variant="outline">Draft</Badge>}
      description="Latency panel"
      mainPane={<PanelPreview />}
      rightPane={<PanelInspector />}
      bottomPane={<QueryPane />}
      rightPaneCollapsed={rightCollapsed}
      bottomPaneCollapsed={bottomCollapsed}
      rightPaneWidth={340}
      bottomPaneHeight={220}
    />
  )
}
