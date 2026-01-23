import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/700.css'
import '@fontsource/open-sans/400.css'
import '@fontsource/open-sans/600.css'
import './index.css'
import './mobile-optimizations.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </GlobalErrorBoundary>
  </StrictMode>,
)
