import { defineConfig } from 'tsup'
import { resolve } from 'path'

export default defineConfig({
  entry:     ['src/index.ts'],
  format:    ['esm', 'cjs'],
  dts:       true,
  sourcemap: true,
  clean:     true,
  onSuccess: 'node scripts/build-css.mjs && echo \'declare const styles: string; export default styles;\' > dist/styles.d.ts',
  external:  [
    'react',
    'react-dom',
    '@loykin/gridkit',
    '@tanstack/react-table',
    '@tanstack/react-virtual',
  ], // @loykin/gridkit: devDep — external so demo files reference it at runtime without bundling
  treeshake: true,
  esbuildOptions(options) {
    options.alias = { '@': resolve(__dirname, './src') }
  },
})
