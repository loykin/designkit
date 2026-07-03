import { describe, expect, it } from 'vitest'
import * as DesignKit from './index'

describe('public API', () => {
  it('exports core UI primitives and templates', () => {
    expect(DesignKit).toEqual(
      expect.objectContaining({
        Avatar: expect.any(Function),
        Badge: expect.any(Function),
        Breadcrumb: expect.any(Function),
        Button: expect.any(Function),
        Card: expect.any(Function),
        Checkbox: expect.any(Function),
        DataBodyTemplate: expect.any(Function),
        DataPage: expect.any(Function),
        DetailBodyTemplate: expect.any(Function),
        FormWizardBodyTemplate: expect.any(Function),
        Input: expect.any(Function),
        Label: expect.any(Function),
        ListDetailBodyTemplate: expect.any(Function),
        LoginBodyTemplate: expect.any(Function),
        PageTopBar: expect.any(Function),
        PanelTemplate: expect.any(Function),
        Select: expect.any(Function),
        SidebarProvider: expect.any(Function),
        Tabs: expect.any(Function),
        WorkbenchBodyTemplate: expect.any(Function),
        buildTemplateTheme: expect.any(Function),
        buildTopBar: expect.any(Function),
        cn: expect.any(Function),
        useStyleInjector: expect.any(Function),
        useThemeStore: expect.any(Function),
      }),
    )
  })
})
