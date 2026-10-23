import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import './index.css'

// Offline support; some hosts (like embedded previews) don't allow it, which is fine.
registerSW({ immediate: true, onRegisterError: () => {} })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
