import type { ComponentType } from 'react'
import { TypographyBodyTemplate, ColorsBodyTemplate } from '@loykin/designkit'
import {
  FileText,
  LayoutDashboard,
  Table2,
  Layers,
  Type,
  Palette,
  KeyRound,
  BarChart2,
  PanelTop,
  PanelsTopLeft,
  PanelLeftOpen,
  PanelRight,
  Boxes,
} from 'lucide-react'
import { TEMPLATE_DEFINITIONS } from './definitions'
import type { PlaygroundTemplateId } from './definitions'
import type { TemplateCodeBuilder } from './code'
import typographyPreviewSource from '../../../src/components/templates/typography/TypographyBodyTemplate.tsx?raw'
import colorsPreviewSource from '../../../src/components/templates/typography/ColorsBodyTemplate.tsx?raw'
import dataBodyResourceAiGuide from '../../../docs/guides/databody-resource-management.md?raw'

export { TEMPLATE_DEFINITIONS, createTemplateOverrides, getTemplateDefinition } from './definitions'
export type {
  TemplateDefinition,
  TemplateExportKind,
  TemplateGroup,
  TemplateNavigationGroupId,
  TemplateOptionSpec,
  TemplateOptionChoice,
  PlaygroundTemplateId,
} from './definitions'
export type { TemplateCodeBuilder, TemplateCodeContext } from './code'

export interface TemplateConfig {
  id: PlaygroundTemplateId
  label: string
  component: ComponentType<{ theme?: React.CSSProperties }>
  sourceCode?: string
  aiGuide?: string
  buildCode?: TemplateCodeBuilder
  group?: string
  description?: string
}

export type { TemplateNavigationItem, TemplateNavigationGroup } from '@loykin/designkit'

import { buildDataGridTemplateCode } from './demos/table/DataGridTemplateCode'
import { StandardDataGridDemo } from './demos/table/StandardDataGridDemo'
import { InfiniteDataGridDemo } from './demos/table/InfiniteDataGridDemo'
import { DraggableDataGridDemo } from './demos/table/DraggableDataGridDemo'
import { CardGridDemo } from './demos/table/CardGridDemo'
import { CardListDemo } from './demos/table/CardListDemo'
import type { TemplateNavigationGroup } from '@loykin/designkit'
import {
  DataBodyTemplateDemo,
  buildDataBodyTemplateCode,
} from './demos/databody/DataBodyTemplateDemo'
import { DataBodyResourceGuide } from './demos/databody/DataBodyResourceGuide'
import {
  DetailBodyTemplateDemo,
  buildDetailBodyTemplateCode,
} from './demos/databody/DetailBodyTemplateDemo'
import {
  SplitBodyTemplateDemo,
  buildSplitBodyTemplateCode,
} from './demos/databody/SplitBodyTemplateDemo'
import {
  TabbedBodyTemplateDemo,
  buildTabbedBodyTemplateCode,
} from './demos/tabbed/TabbedBodyTemplateDemo'
import { FormBodyTemplateDemo, buildFormBodyTemplateCode } from './demos/form/FormBodyTemplateDemo'
import {
  FormStackedBodyTemplateDemo,
  buildFormStackedBodyTemplateCode,
} from './demos/form/FormStackedBodyTemplateDemo'
import {
  FormWizardBodyTemplateDemo,
  buildFormWizardBodyTemplateCode,
} from './demos/form/FormWizardBodyTemplateDemo'
import {
  FormInlineBodyTemplateDemo,
  buildFormInlineBodyTemplateCode,
} from './demos/form/FormInlineBodyTemplateDemo'
import {
  SectionedBodyTemplateDemo,
  buildSectionedBodyTemplateCode,
} from './demos/sectioned/SectionedBodyTemplateDemo'
import {
  LoginBodyTemplateDemo,
  buildLoginBodyTemplateCode,
} from './demos/auth/LoginBodyTemplateDemo'
import { LoginForgotDemo, buildLoginForgotCode } from './demos/auth/LoginForgotDemo'
import { LoginResetDemo, buildLoginResetCode } from './demos/auth/LoginResetDemo'
import { LoginOtpDemo, buildLoginOtpCode } from './demos/auth/LoginOtpDemo'
import {
  DashboardBodyTemplateDemo,
  buildDashboardTemplateCode,
} from './demos/dashboard/DashboardBodyTemplateDemo'
import { buildWorkbenchTemplateCode } from './demos/workbench/WorkbenchBodyTemplateDemos'
import { WorkbenchPanelEditorDemo } from './demos/workbench/WorkbenchPanelEditorDemo'
import { WorkbenchSqlEditorDemo } from './demos/workbench/WorkbenchSqlEditorDemo'
import { AgentChatDemo, buildAgentChatCode } from './demos/workbench/AgentChatDemo'
import { KubernetesMonitoringDemo } from './demos/databody/KubernetesMonitoringDemo'
import {
  BrowseBodyTemplateDemo,
  buildBrowseBodyTemplateCode,
} from './demos/browse/BrowseBodyTemplateDemo'
import {
  ListDetailBodyTemplateDemo,
  buildListDetailBodyTemplateCode,
} from './demos/listdetail/ListDetailBodyTemplateDemo'
import { PanelTemplateDemo, buildPanelTemplateCode } from './demos/panel/PanelTemplateDemo'
import { buildDetailTemplateCode } from './demos/detail/DetailBodyTemplateDemo'
import { ProductMediaDetailDemo } from './demos/detail/ProductMediaDetailDemo'
import { OrderRecordDetailDemo } from './demos/detail/OrderRecordDetailDemo'
import { ProductFullDetailDemo } from './demos/detail/ProductFullDetailDemo'
import { BoardTableDemo, buildBoardTableCode } from './demos/content/BoardTableDemo'
import { ThreadDetailDemo, buildThreadDetailCode } from './demos/content/ThreadDetailDemo'
import { BlogFeedDemo, buildBlogFeedCode } from './demos/content/BlogFeedDemo'
import { ArticleDetailDemo, buildArticleDetailCode } from './demos/content/ArticleDetailDemo'

const previewComponents: Record<
  PlaygroundTemplateId,
  ComponentType<{ theme?: React.CSSProperties }>
> = {
  'databody-resource-guide': DataBodyResourceGuide,
  table: StandardDataGridDemo,
  'table-infinity': InfiniteDataGridDemo,
  'table-drag': DraggableDataGridDemo,
  'table-card': CardGridDemo,
  'table-card-list': CardListDemo,
  databody: DataBodyTemplateDemo,
  'board-table': BoardTableDemo,
  'blog-feed': BlogFeedDemo,
  'databody-detail': DetailBodyTemplateDemo,
  'databody-split': SplitBodyTemplateDemo,
  tabbed: TabbedBodyTemplateDemo,
  form: FormBodyTemplateDemo,
  'form-stacked': FormStackedBodyTemplateDemo,
  'form-wizard': FormWizardBodyTemplateDemo,
  'form-inline': FormInlineBodyTemplateDemo,
  sectioned: SectionedBodyTemplateDemo,
  typography: TypographyBodyTemplate,
  colors: ColorsBodyTemplate,
  login: LoginBodyTemplateDemo,
  'login-forgot': LoginForgotDemo,
  'login-reset': LoginResetDemo,
  'login-otp': LoginOtpDemo,
  dashboard: DashboardBodyTemplateDemo,
  'workbench-panel-editor': WorkbenchPanelEditorDemo,
  'workbench-sql-editor': WorkbenchSqlEditorDemo,
  'workbench-agent-chat': AgentChatDemo,
  'databody-kubernetes': KubernetesMonitoringDemo,
  browse: BrowseBodyTemplateDemo,
  'list-detail': ListDetailBodyTemplateDemo,
  panel: PanelTemplateDemo,
  detail: ProductMediaDetailDemo,
  'detail-record': OrderRecordDetailDemo,
  'detail-full': ProductFullDetailDemo,
  'thread-detail': ThreadDetailDemo,
  'article-detail': ArticleDetailDemo,
}

const codeBuilders: Partial<Record<PlaygroundTemplateId, TemplateCodeBuilder>> = {
  table: buildDataGridTemplateCode,
  'table-infinity': buildDataGridTemplateCode,
  'table-drag': buildDataGridTemplateCode,
  'table-card': buildDataGridTemplateCode,
  'table-card-list': buildDataGridTemplateCode,
  databody: buildDataBodyTemplateCode,
  'board-table': buildBoardTableCode,
  'blog-feed': buildBlogFeedCode,
  'databody-detail': buildDetailBodyTemplateCode,
  'databody-split': buildSplitBodyTemplateCode,
  tabbed: buildTabbedBodyTemplateCode,
  form: buildFormBodyTemplateCode,
  'form-stacked': buildFormStackedBodyTemplateCode,
  'form-wizard': buildFormWizardBodyTemplateCode,
  login: buildLoginBodyTemplateCode,
  'login-forgot': buildLoginForgotCode,
  'login-reset': buildLoginResetCode,
  'login-otp': buildLoginOtpCode,
  'form-inline': buildFormInlineBodyTemplateCode,
  sectioned: buildSectionedBodyTemplateCode,
  dashboard: buildDashboardTemplateCode,
  'workbench-panel-editor': buildWorkbenchTemplateCode,
  'workbench-sql-editor': buildWorkbenchTemplateCode,
  'workbench-agent-chat': buildAgentChatCode,
  browse: buildBrowseBodyTemplateCode,
  'list-detail': buildListDetailBodyTemplateCode,
  panel: buildPanelTemplateCode,
  detail: buildDetailTemplateCode,
  'detail-record': buildDetailTemplateCode,
  'detail-full': buildDetailTemplateCode,
  'thread-detail': buildThreadDetailCode,
  'article-detail': buildArticleDetailCode,
}

const previewSourceModules = import.meta.glob('./demos/**/*.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

function toPreviewSource(source: string): string {
  const builderStart = source.search(/\nexport function build[A-Z]\w*Code\b/)
  const previewOnly = builderStart === -1 ? source : source.slice(0, builderStart)

  return previewOnly
    .replace(/^import type \{ TemplateCodeContext } from ['"][^'"]+['"]\r?\n/m, '')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd()
}

const previewSourcePathById: Partial<Record<PlaygroundTemplateId, string>> = {
  'databody-resource-guide': './demos/databody/DataBodyResourceGuide.tsx',
  table: './demos/table/StandardDataGridDemo.tsx',
  'table-infinity': './demos/table/InfiniteDataGridDemo.tsx',
  'table-drag': './demos/table/DraggableDataGridDemo.tsx',
  'table-card': './demos/table/CardGridDemo.tsx',
  'table-card-list': './demos/table/CardListDemo.tsx',
  databody: './demos/databody/DataBodyTemplateDemo.tsx',
  'databody-detail': './demos/databody/DetailBodyTemplateDemo.tsx',
  'databody-split': './demos/databody/SplitBodyTemplateDemo.tsx',
  'databody-kubernetes': './demos/databody/KubernetesMonitoringDemo.tsx',
  tabbed: './demos/tabbed/TabbedBodyTemplateDemo.tsx',
  form: './demos/form/FormBodyTemplateDemo.tsx',
  'form-stacked': './demos/form/FormStackedBodyTemplateDemo.tsx',
  'form-wizard': './demos/form/FormWizardBodyTemplateDemo.tsx',
  'form-inline': './demos/form/FormInlineBodyTemplateDemo.tsx',
  sectioned: './demos/sectioned/SectionedBodyTemplateDemo.tsx',
  login: './demos/auth/LoginBodyTemplateDemo.tsx',
  'login-forgot': './demos/auth/LoginForgotDemo.tsx',
  'login-reset': './demos/auth/LoginResetDemo.tsx',
  'login-otp': './demos/auth/LoginOtpDemo.tsx',
  dashboard: './demos/dashboard/DashboardBodyTemplateDemo.tsx',
  'workbench-panel-editor': './demos/workbench/WorkbenchPanelEditorDemo.tsx',
  'workbench-sql-editor': './demos/workbench/WorkbenchSqlEditorDemo.tsx',
  'workbench-agent-chat': './demos/workbench/AgentChatDemo.tsx',
  browse: './demos/browse/BrowseBodyTemplateDemo.tsx',
  'list-detail': './demos/listdetail/ListDetailBodyTemplateDemo.tsx',
  panel: './demos/panel/PanelTemplateDemo.tsx',
  detail: './demos/detail/ProductMediaDetailDemo.tsx',
  'detail-record': './demos/detail/OrderRecordDetailDemo.tsx',
  'detail-full': './demos/detail/ProductFullDetailDemo.tsx',
  'board-table': './demos/content/BoardTableDemo.tsx',
  'blog-feed': './demos/content/BlogFeedDemo.tsx',
  'thread-detail': './demos/content/ThreadDetailDemo.tsx',
  'article-detail': './demos/content/ArticleDetailDemo.tsx',
}

const libraryPreviewSources: Partial<Record<PlaygroundTemplateId, string>> = {
  typography: typographyPreviewSource,
  colors: colorsPreviewSource,
}

export const TEMPLATES: TemplateConfig[] = TEMPLATE_DEFINITIONS.map((definition) => ({
  id: definition.id,
  label: definition.label,
  group: definition.group,
  component: previewComponents[definition.id],
  sourceCode:
    toPreviewSource(previewSourceModules[previewSourcePathById[definition.id] ?? ''] ?? '') ||
    libraryPreviewSources[definition.id],
  buildCode: codeBuilders[definition.id],
  aiGuide: definition.id === 'databody-resource-guide' ? dataBodyResourceAiGuide : undefined,
}))

const iconById: Partial<Record<PlaygroundTemplateId, ComponentType<{ className?: string }>>> = {
  'databody-resource-guide': FileText,
  table: Table2,
  'table-card': Layers,
  databody: LayoutDashboard,
  'board-table': Table2,
  'blog-feed': Layers,
  sectioned: FileText,
  form: FileText,
  'form-wizard': FileText,
  typography: Type,
  colors: Palette,
  login: KeyRound,
  dashboard: BarChart2,
  'workbench-panel-editor': PanelsTopLeft,
  'workbench-sql-editor': PanelsTopLeft,
  'databody-kubernetes': Boxes,
  detail: PanelTop,
  'detail-record': PanelTop,
  'detail-full': PanelTop,
  'thread-detail': FileText,
  'article-detail': FileText,
  'list-detail': PanelLeftOpen,
  panel: PanelRight,
}

const navigationGroupIcon: Partial<Record<string, ComponentType<{ className?: string }>>> = {
  DataBodyTemplate: LayoutDashboard,
  FormWizardBodyTemplate: Layers,
  LoginBodyTemplate: KeyRound,
  DashboardBodyTemplate: BarChart2,
  WorkbenchBodyTemplate: PanelsTopLeft,
  ListDetailBodyTemplate: PanelLeftOpen,
  PanelTemplate: PanelRight,
}

const navigationLabelOrder = [
  'Common',
  'DataBodyTemplate',
  'DetailBodyTemplate',
  'ListDetailBodyTemplate',
  'PanelTemplate',
  'FormWizardBodyTemplate',
  'LoginBodyTemplate',
  'DashboardBodyTemplate',
  'WorkbenchBodyTemplate',
]

export const TEMPLATE_NAVIGATION: TemplateNavigationGroup[] = navigationLabelOrder
  .map((groupId) => {
    const definitions = TEMPLATE_DEFINITIONS.filter((d) => d.navigationGroup === groupId)
    const parentDefinitions = definitions.filter((d) => !d.navigationParent)
    const label = groupId

    return {
      label,
      items: parentDefinitions.map((definition) => {
        const childDefs = definitions.filter((d) => d.navigationParent === definition.id)
        const hasChildren = childDefs.length > 0

        return {
          id: definition.id,
          label:
            definition.navigationSubgroupLabel ?? definition.navigationLabel ?? definition.label,
          icon: iconById[definition.id] ?? navigationGroupIcon[label],
          children: hasChildren
            ? [
                { id: definition.id, label: definition.navigationLabel ?? definition.label },
                ...childDefs.map((child) => ({
                  id: child.id,
                  label: child.navigationLabel ?? child.label,
                })),
              ]
            : [],
        }
      }),
    }
  })
  .filter((group) => group.items.length > 0)
