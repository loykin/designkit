import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { existsSync } from 'fs'

const dashboardkitLocal = resolve(__dirname, '../../dashboardkit/dist/index.js')
const dashboardkitAliases = existsSync(dashboardkitLocal)
  ? [
      { find: '@loykin/dashboardkit/react', replacement: resolve(__dirname, '../../dashboardkit/dist/react.js') },
      { find: '@loykin/dashboardkit', replacement: dashboardkitLocal },
    ]
  : []

export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      // Deduplicate React — dashboardkit has its own node_modules/react@19.2.5
      // while playground uses react@19.2.6; force all imports to one instance.
      { find: /^react$/, replacement: resolve(__dirname, '../node_modules/react') },
      { find: /^react\/(.*)$/, replacement: resolve(__dirname, '../node_modules/react/$1') },
      { find: /^react-dom$/, replacement: resolve(__dirname, '../node_modules/react-dom') },
      { find: /^react-dom\/(.*)$/, replacement: resolve(__dirname, '../node_modules/react-dom/$1') },
      ...dashboardkitAliases,
      { find: '@loykin/designkit', replacement: resolve(__dirname, '../src/index.ts') },
      { find: '@', replacement: resolve(__dirname, '../src') },
      { find: '~', replacement: resolve(__dirname, 'src') },
    ],
  },
})
