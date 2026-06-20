import type { ComponentType } from 'react'
import type { TemplateId } from '@/store/types'

export interface TemplateNavigationItem {
  id: TemplateId
  label: string
  icon?: ComponentType<{ className?: string }>
  children?: TemplateNavigationItem[]
}

export interface TemplateNavigationGroup {
  label: string
  items: TemplateNavigationItem[]
}

export { DashboardBodyTemplate, DashboardPanel } from './dashboard/DashboardBodyTemplate'
export type {
  DashboardBodyTemplateProps,
  DashboardPanelProps,
} from './dashboard/DashboardBodyTemplate'
export { WorkbenchBodyTemplate } from './workbench/WorkbenchBodyTemplate'
export type { WorkbenchBodyTemplateProps } from './workbench/WorkbenchBodyTemplate'
export { DataBodyTemplate } from './databody/DataBodyTemplate'
export { BrowseBodyTemplate } from './browse/BrowseBodyTemplate'
export type { BrowseBodyTemplateProps } from './browse/BrowseBodyTemplate'
export { DetailBodyTemplate } from './detail/DetailBodyTemplate'
export { ListDetailBodyTemplate } from './listdetail/ListDetailBodyTemplate'
export type { ListDetailBodyTemplateProps } from './listdetail/ListDetailBodyTemplate'
export { PanelTemplate } from './panel/PanelTemplate'
export type { PanelTemplateProps, PanelTemplateSectionProps } from './panel/PanelTemplate'
export type {
  DetailBodyTemplateProps,
  DetailBodyHeaderProps,
  DetailBodyTabProps,
  DetailBodySectionProps,
  DetailBodyVariant,
} from './detail/DetailBodyTemplate'
export { FormWizardBodyTemplate } from './form/FormWizardBodyTemplate'
export type {
  FormWizardBodyTemplateProps,
  FormWizardStep,
  FormWizardVariant,
} from './form/FormWizardBodyTemplate'
export { TypographyBodyTemplate } from './typography/TypographyBodyTemplate'
export type { TypographyBodyTemplateProps } from './typography/TypographyBodyTemplate'
export { ColorsBodyTemplate } from './typography/ColorsBodyTemplate'
export type { ColorsBodyTemplateProps } from './typography/ColorsBodyTemplate'
export { DataPage } from './datapage/DataPage'
export { LoginBodyTemplate } from './auth/LoginBodyTemplate'
export type {
  LoginBodyTemplateProps,
  LoginLayout,
  LoginSide,
  LoginCard,
  LoginBg,
  LoginCardWidth,
} from './auth/LoginBodyTemplate'
export { PageTopBar, buildTopBar, PageBreadcrumb } from './datapage/PageTopBar'
export type { PageTopBarProps, PageTopBarVariant, PageBreadcrumbItem } from './datapage/PageTopBar'
export type {
  DataPageActionsProps,
  DataPageContentProps,
  DataPageFooterProps,
  DataPageGroupBodyProps,
  DataPageGroupHeaderProps,
  DataPageGroupProps,
  DataPageGroupToolbarProps,
  DataPageHeaderProps,
  DataPageProps,
  DataPageTabProps,
  DataPageTabsProps,
  DataPageTitleBlockProps,
} from './datapage/DataPage'
export type {
  DataBodyBodyProps,
  DataBodyTabProps,
  DataBodySectionProps,
  DataBodySummaryProps,
  DataBodyGroupProps,
  DataBodyRowProps,
  DataBodyFieldProps,
  DataBodyTemplateProps,
  GroupLayout,
  GroupVariant,
} from './databody/DataBodyTemplate'
