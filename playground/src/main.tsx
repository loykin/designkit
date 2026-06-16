import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Tailwind + shared vars first — kit package CSS overrides the reset that follows.
import './index.css'

// Kit package styles after Tailwind — their CSS wins over the border-width:0 reset.
// --bk-* tokens are hardcoded here; the designkit bridge below overrides them.
import '@loykin/side-panel/styles'
import '@loykin/filter-input/styles'
import '@loykin/datetime-range/styles'
import '@loykin/gridkit/styles'
import '@loykin/chartkit/styles'
import '@loykin/dashboardkit/styles'

// Designkit bridge last — overrides --bk-* tokens set above.
import '../../src/styles/index.css'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
