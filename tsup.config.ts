import { defineConfig } from 'tsup'
import { resolve } from 'path'

export default defineConfig({
  entry:     ['src/index.ts'],
  format:    ['esm', 'cjs'],
  dts:       true,
  sourcemap: true,
  clean:     true,
  external:  ['react', 'react-dom'],
  treeshake: true,
  esbuildOptions(options) {
    options.alias = { '@': resolve(__dirname, './src') }
  },
})
