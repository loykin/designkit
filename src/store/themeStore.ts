import { create } from 'zustand'
import { createTemplateOverrides } from '@/components/templates/definitions'
import type { ThemeState } from './types'

export const useThemeStore = create<ThemeState>((set) => ({
  global: {
    radius:        0.5,
    primaryHue:    220,
    primaryChroma: 0.15,
    fontScale:     1,
    lineHeight:    1,
    density:       'default',
    darkMode:      false,
  },
  overrides: createTemplateOverrides(),
  activeShell:    'sidebar',
  activeTemplate: 'table',
  setGlobal:   (patch) => set((s) => ({ global: { ...s.global, ...patch } })),
  setOverride: (id, patch) => set((s) => ({
    overrides: { ...s.overrides, [id]: { ...s.overrides[id], ...patch } },
  })),
  setShell:    (shell)    => set({ activeShell: shell }),
  setTemplate: (template) => set({ activeTemplate: template }),
}))
