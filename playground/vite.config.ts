import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: '@loykin/designkit', replacement: resolve(__dirname, '../src/index.ts') },
      { find: '@', replacement: resolve(__dirname, '../src') },
      { find: '~', replacement: resolve(__dirname, 'src') },
    ],
  },
})
