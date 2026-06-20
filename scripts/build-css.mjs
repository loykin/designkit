import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

mkdirSync(join(root, 'dist'), { recursive: true })

const tokens = readFileSync(join(root, 'src/styles/index.css'), 'utf8')

// Consumers compile DesignKit's utility classes with their own Tailwind v4 build.
// The source path is relative to the published stylesheet in dist/.
writeFileSync(join(root, 'dist/styles.css'), `@source "./";\n\n${tokens}`)
