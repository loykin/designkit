import { create } from 'zustand'
import type { ThemeState, TemplateOverride, TemplateId } from './types'

export const useThemeStore = create<ThemeState>((set) => ({
  global: {
    radius: 0.5,
    primaryHue: 220,
    primaryChroma: 0.15,
    fontScale: 1,
    lineHeight: 1,
    density: 'default',
    darkMode: false,
  },
  overrides: {} as Record<TemplateId, TemplateOverride>,
  activeShell: 'sidebar',
  activeTemplate: 'table',
  setGlobal: (patch) => set((s) => ({ global: { ...s.global, ...patch } })),
  setOverride: (id, patch) =>
    set((s) => ({
      overrides: { ...s.overrides, [id]: { ...s.overrides[id], ...patch } },
    })),
  setShell: (shell) => set({ activeShell: shell }),
  setTemplate: (template) => set({ activeTemplate: template }),
}))
