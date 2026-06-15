import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Kit package styles first — their :root defaults are overridden by the
// designkit bridge below (import order determines cascade winner).
import '@loykin/side-panel/styles'
import '@loykin/filter-input/styles'
import '@loykin/datetime-range/styles'
import '@loykin/gridkit/styles'
import '@loykin/chartkit/styles'
import '@loykin/dashboardkit/styles'
import './index.css'

// Designkit styles last — the basekit adapter section overrides --bk-* tokens.
import '../../src/styles/index.css'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
