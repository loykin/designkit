import { create } from 'zustand'
import type { ThemeState } from './types'

export const useThemeStore = create<ThemeState>((set) => ({
  global: {
    radius:        0.5,
    primaryHue:    220,
    primaryChroma: 0.15,
    darkMode:      false,
  },
  overrides: {
    table:     { radius: 0.125 },
    dashboard: { radius: 0.125 },
    cardlist:  { radius: 0.5   },
    tabbed:    { radius: 0.375 },
    form:      { radius: 0.5   },
  },
  activeShell:    'sidebar',
  activeTemplate: 'table',
  setGlobal:   (patch) => set((s) => ({ global: { ...s.global, ...patch } })),
  setOverride: (id, patch) => set((s) => ({
    overrides: { ...s.overrides, [id]: { ...s.overrides[id], ...patch } },
  })),
  setShell:    (shell)    => set({ activeShell: shell }),
  setTemplate: (template) => set({ activeTemplate: template }),
}))
