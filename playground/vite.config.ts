import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'

const require = createRequire(import.meta.url)
const reactCodeMirrorEntry = require.resolve('@uiw/react-codemirror')
const resolveFromReactCodeMirror = (id: string) =>
  require.resolve(id, { paths: [dirname(reactCodeMirrorEntry)] })
const basicSetupEntry = require.resolve('@uiw/codemirror-extensions-basic-setup', {
  paths: [dirname(reactCodeMirrorEntry)],
})
const resolveFromBasicSetup = (id: string) =>
  require.resolve(id, { paths: [dirname(basicSetupEntry)] })

export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: '@codemirror/state',
        replacement: resolveFromReactCodeMirror('@codemirror/state'),
      },
      {
        find: '@codemirror/view',
        replacement: resolveFromReactCodeMirror('@codemirror/view'),
      },
      {
        find: '@codemirror/language',
        replacement: resolveFromBasicSetup('@codemirror/language'),
      },
      { find: '@loykin/designkit', replacement: resolve(__dirname, '../src/index.ts') },
      { find: '@', replacement: resolve(__dirname, '../src') },
      { find: '~', replacement: resolve(__dirname, 'src') },
    ],
    dedupe: ['@lezer/common', '@lezer/highlight'],
  },
})
