import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const templateDir = join(repoRoot, 'scripts/consumer-template')
const pkg = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'))
const playgroundPkg = JSON.parse(readFileSync(join(repoRoot, 'playground/package.json'), 'utf8'))

const workDir = mkdtempSync(join(tmpdir(), 'designkit-consumer-'))
const appDir = join(workDir, 'app')

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repoRoot,
    stdio: options.capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
    encoding: 'utf8',
    env: {
      ...process.env,
      npm_config_cache: process.env.npm_config_cache ?? join(workDir, 'npm-cache'),
      ...options.env,
    },
  })

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status}`)
  }

  return result.stdout ?? ''
}

function version(section, name) {
  const value = pkg[section]?.[name] ?? playgroundPkg[section]?.[name]
  if (!value) {
    throw new Error(`Missing ${section}.${name} in package metadata`)
  }
  return value
}

try {
  mkdirSync(appDir, { recursive: true })

  const packOutput = run('npm', ['pack', '--json', '--pack-destination', workDir], {
    capture: true,
  })
  const packInfo = JSON.parse(packOutput)
  const tarballPath = join(workDir, packInfo[0].filename)

  writeFileSync(
    join(appDir, 'package.json'),
    `${JSON.stringify(
      {
        name: 'designkit-consumer-verification',
        private: true,
        type: 'module',
        scripts: {
          'type-check': 'tsc --noEmit',
          build: 'vite build',
        },
        dependencies: {
          '@loykin/designkit': `file:${tarballPath}`,
          '@types/react': version('devDependencies', '@types/react'),
          '@types/react-dom': version('devDependencies', '@types/react-dom'),
          '@vitejs/plugin-react': version('devDependencies', '@vitejs/plugin-react'),
          '@tailwindcss/vite': version('devDependencies', '@tailwindcss/vite'),
          react: version('peerDependencies', 'react'),
          'react-dom': version('peerDependencies', 'react-dom'),
          tailwindcss: version('peerDependencies', 'tailwindcss'),
          typescript: version('devDependencies', 'typescript'),
          vite: version('devDependencies', 'vite'),
        },
        devDependencies: {},
      },
      null,
      2,
    )}\n`,
  )

  writeFileSync(
    join(appDir, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          useDefineForClassFields: true,
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          allowJs: false,
          skipLibCheck: false,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          strict: true,
          forceConsistentCasingInFileNames: true,
          module: 'ESNext',
          moduleResolution: 'Bundler',
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: 'react-jsx',
          types: ['vite/client'],
        },
        include: ['src'],
      },
      null,
      2,
    )}\n`,
  )

  writeFileSync(join(appDir, 'vite.config.ts'), readFileSync(join(templateDir, 'vite.config.ts'), 'utf8'))
  writeFileSync(join(appDir, 'index.html'), readFileSync(join(templateDir, 'index.html'), 'utf8'))
  mkdirSync(join(appDir, 'src'), { recursive: true })
  writeFileSync(join(appDir, 'src/main.tsx'), readFileSync(join(templateDir, 'src/main.tsx'), 'utf8'))
  writeFileSync(join(appDir, 'src/index.css'), readFileSync(join(templateDir, 'src/index.css'), 'utf8'))

  run('pnpm', ['install', '--ignore-scripts'], { cwd: appDir })

  const duplicateCheck = run('node', [
    '-e',
    `
const path = require('node:path')
const entry = require.resolve('@loykin/designkit')
const root = path.resolve(path.dirname(entry), '..')
const appReact = require.resolve('react')
const designkitReact = require.resolve('react', { paths: [root] })
const appReactDom = require.resolve('react-dom')
const designkitReactDom = require.resolve('react-dom', { paths: [root] })
if (appReact !== designkitReact) throw new Error('Duplicate React instance: ' + designkitReact)
if (appReactDom !== designkitReactDom) throw new Error('Duplicate ReactDOM instance: ' + designkitReactDom)
console.log(JSON.stringify({ appReact, designkitReact, appReactDom, designkitReactDom }, null, 2))
`,
  ], { cwd: appDir, capture: true })

  const nestedReact = join(appDir, 'node_modules/@loykin/designkit/node_modules/react')
  const nestedReactDom = join(appDir, 'node_modules/@loykin/designkit/node_modules/react-dom')
  if (existsSync(nestedReact) || existsSync(nestedReactDom)) {
    throw new Error('React or ReactDOM was installed inside @loykin/designkit')
  }

  run('pnpm', ['type-check'], { cwd: appDir })
  run('pnpm', ['build'], { cwd: appDir })

  const publishedStyles = readFileSync(join(appDir, 'node_modules/@loykin/designkit/dist/styles.css'), 'utf8')
  if (!publishedStyles.startsWith('@source "./";')) {
    throw new Error('Published styles do not register DesignKit dist as a Tailwind source')
  }
  if (/\.hidden\s*\{\s*display:\s*none/.test(publishedStyles)) {
    throw new Error('Published styles contain pre-built Tailwind utilities')
  }

  const cssAsset = readdirSync(join(appDir, 'dist/assets')).find((file) => file.endsWith('.css'))
  if (!cssAsset) throw new Error('Consumer build did not emit a CSS asset')
  const consumerCss = readFileSync(join(appDir, 'dist/assets', cssAsset), 'utf8')
  const hiddenIndex = consumerCss.indexOf('.hidden{display:none}')
  const responsiveBlockIndex = consumerCss.indexOf('.md\\:block')
  if (hiddenIndex === -1) {
    throw new Error('Consumer Tailwind build did not discover DesignKit utility classes')
  }
  if (!consumerCss.includes('.min-h-svh{min-height:100svh}')) {
    throw new Error('Consumer Tailwind build did not scan the published DesignKit package')
  }
  if (responsiveBlockIndex === -1) {
    throw new Error('Consumer Tailwind build did not emit the responsive override regression case')
  }
  if (responsiveBlockIndex < hiddenIndex) {
    throw new Error('Responsive application utility was emitted before the base hidden utility')
  }

  console.log(duplicateCheck.trim())
  console.log(`Consumer package verification passed: ${appDir}`)
} finally {
  if (process.env.KEEP_DESIGNKIT_CONSUMER_TEST !== '1') {
    rmSync(workDir, { recursive: true, force: true })
  }
}
