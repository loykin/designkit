import { createElement, type ComponentType } from 'react'
import type { TemplateId } from '@loykin/designkit'
import { TypographyBodyTemplate, ColorsBodyTemplate } from '@loykin/designkit'
import { FileText, LayoutDashboard, Table2, Layers, Type, Palette, KeyRound } from 'lucide-react'
import { TEMPLATE_DEFINITIONS } from './definitions'
import type { TemplateCodeBuilder } from './code'

export { TEMPLATE_DEFINITIONS, createTemplateOverrides, getTemplateDefinition } from './definitions'
export type {
  TemplateDefinition,
  TemplateExportKind,
  TemplateGroup,
  TemplateNavigationGroupId,
  TemplateOptionSpec,
  TemplateOptionChoice,
} from './definitions'
export type { TemplateCodeBuilder, TemplateCodeContext } from './code'

export interface TemplateConfig {
  id: TemplateId
  label: string
  component: ComponentType<{ theme?: React.CSSProperties }>
  buildCode?: TemplateCodeBuilder
  group?: string
  description?: string
}

export type { TemplateNavigationItem, TemplateNavigationGroup } from '@loykin/designkit'

import { DataGridTemplateDemo, buildDataGridTemplateCode } from './demos/table/DataGridTemplateDemo'
import type { TemplateNavigationGroup } from '@loykin/designkit'
import type { DataGridTemplateVariant } from './demos/table/DataGridTemplateDemo'
import { DataBodyTemplateDemo, buildDataBodyTemplateCode } from './demos/databody/DataBodyTemplateDemo'
import {
  DetailBodyTemplateDemo,
  buildDetailBodyTemplateCode,
} from './demos/databody/DetailBodyTemplateDemo'
import { SplitBodyTemplateDemo, buildSplitBodyTemplateCode } from './demos/databody/SplitBodyTemplateDemo'
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
import { LoginBodyTemplateDemo, buildLoginBodyTemplateCode } from './demos/auth/LoginBodyTemplateDemo'
import { LoginForgotDemo, buildLoginForgotCode } from './demos/auth/LoginForgotDemo'
import { LoginResetDemo, buildLoginResetCode } from './demos/auth/LoginResetDemo'
import { LoginOtpDemo, buildLoginOtpCode } from './demos/auth/LoginOtpDemo'

function DataGridTemplatePreview(props: {
  theme?: React.CSSProperties
  variant: DataGridTemplateVariant
  layoutClassName: string
  title: React.ReactNode
  description?: React.ReactNode
  topBarShow?: string
  topBarVariant?: string
  topBarBg?: string
}) {
  return createElement(DataGridTemplateDemo, props)
}

function createDataGridPreview(id: TemplateId) {
  const definition = TEMPLATE_DEFINITIONS.find((item) => item.id === id)
  return function DataGridPreview({
    theme,
    topBarShow,
    topBarVariant,
    topBarBg,
  }: {
    theme?: React.CSSProperties
    topBarShow?: string
    topBarVariant?: string
    topBarBg?: string
  }) {
    return createElement(DataGridTemplatePreview, {
      theme,
      variant: definition?.preview?.variant ?? 'standard',
      layoutClassName: definition?.layoutClassName ?? `layout-${id}`,
      title: definition?.preview?.title ?? 'Users',
      description: definition?.preview?.description,
      topBarShow,
      topBarVariant,
      topBarBg,
    })
  }
}

const previewComponents: Record<TemplateId, ComponentType<{ theme?: React.CSSProperties }>> = {
  table: createDataGridPreview('table'),
  'table-infinity': createDataGridPreview('table-infinity'),
  'table-drag': createDataGridPreview('table-drag'),
  'table-card': createDataGridPreview('table-card'),
  'table-card-list': createDataGridPreview('table-card-list'),
  databody: DataBodyTemplateDemo,
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
}

const codeBuilders: Partial<Record<TemplateId, TemplateCodeBuilder>> = {
  table: buildDataGridTemplateCode,
  'table-infinity': buildDataGridTemplateCode,
  'table-drag': buildDataGridTemplateCode,
  'table-card': buildDataGridTemplateCode,
  'table-card-list': buildDataGridTemplateCode,
  databody: buildDataBodyTemplateCode,
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
}

export const TEMPLATES: TemplateConfig[] = TEMPLATE_DEFINITIONS.map((definition) => ({
  id: definition.id,
  label: definition.label,
  group: definition.group,
  component: previewComponents[definition.id],
  buildCode: codeBuilders[definition.id],
}))

const iconById: Partial<Record<TemplateId, ComponentType<{ className?: string }>>> = {
  table: Table2,
  'table-card': Layers,
  databody: LayoutDashboard,
  sectioned: FileText,
  form: FileText,
  'form-wizard': FileText,
  typography: Type,
  colors: Palette,
  login: KeyRound,
}

const navigationGroupIcon: Partial<Record<string, ComponentType<{ className?: string }>>> = {
  DataBodyTemplate: LayoutDashboard,
  FormWizardBodyTemplate: Layers,
  LoginBodyTemplate: KeyRound,
}

const navigationLabelOrder = ['Common', 'DataBodyTemplate', 'FormWizardBodyTemplate', 'LoginBodyTemplate']

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
