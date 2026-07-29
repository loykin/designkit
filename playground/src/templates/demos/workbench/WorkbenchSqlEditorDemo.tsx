import { useState, type CSSProperties } from 'react'
import {
  Badge,
  Button,
  PageTopBar,
  WorkbenchBodyTemplate,
} from '@loykin/designkit'
import { Database, Play, SlidersHorizontal } from 'lucide-react'
import {
  ResultsPane,
  SchemaBrowser,
  SqlEditor,
} from './WorkbenchBodyTemplateDemos'

export function WorkbenchSqlEditorDemo({ theme }: { theme?: CSSProperties }) {
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [bottomCollapsed, setBottomCollapsed] = useState(false)

  return (
    <WorkbenchBodyTemplate
      theme={theme}
      className="layout-workbench-sql-editor"
      topBar={
        <PageTopBar
          left="Data / Query editor"
          right={
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm"><SlidersHorizontal />Explain</Button>
              <Button size="sm"><Play />Run</Button>
            </div>
          }
        />
      }
      headerRight={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLeftCollapsed((value) => !value)}
          >
            <Database />Schema
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBottomCollapsed((value) => !value)}
          >
            Results
          </Button>
        </>
      }
      title="SQL editor"
      status={<Badge variant="default">Connected</Badge>}
      description="Warehouse analytics"
      leftPane={<SchemaBrowser />}
      mainPane={<SqlEditor />}
      bottomPane={<ResultsPane />}
      leftPaneCollapsed={leftCollapsed}
      bottomPaneCollapsed={bottomCollapsed}
      leftPaneWidth={280}
      bottomPaneHeight={230}
    />
  )
}
