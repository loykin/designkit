import { create } from 'zustand'
import type { ThemeState } from './types'

export const useThemeStore = create<ThemeState>((set) => ({
  global: {
    radius:        0.5,
    primaryHue:    220,
    primaryChroma: 0.15,
    fontScale:     1,
    lineHeight:    1,
    darkMode:      false,
  },
  overrides: {
    table:          { radius: 0.125 },
    'table-infinity': { radius: 0.125 },
    'table-drag':     { radius: 0.125 },
    'table-card':     { radius: 0.375 },
    'table-card-list': { radius: 0.375 },
    dashboard:      { radius: 0.125 },
    typography:     { radius: 0.375 },
    tabbed:         { radius: 0.375 },
    form:           { radius: 0.5   },
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
