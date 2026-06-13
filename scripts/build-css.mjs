import { execSync } from 'child_process'
import { mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

mkdirSync(join(root, 'dist'), { recursive: true })

execSync(
  'node_modules/.bin/tailwindcss -i src/styles/build-input.css -o dist/styles.css --minify',
  { stdio: 'inherit', cwd: root },
)
