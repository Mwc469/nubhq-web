import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from './contexts/ToastContext'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { FloatingXpProvider } from './components/ui/FloatingXp'
import { logger } from './lib/logger'
import './index.css'
import App from './App.jsx'

// Root error boundary
class RootErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ROOT ERROR:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#1a1a1b',
          color: 'white',
          padding: '2rem',
          fontFamily: 'monospace'
        }}>
          <h1 style={{ color: '#E91E8C', marginBottom: '1rem' }}>App Crashed</h1>
          <pre style={{
            background: 'rgba(0,0,0,0.5)',
            padding: '1rem',
            borderRadius: '8px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
          <button
            onClick={() => {
              localStorage.clear()
              window.location.reload()
            }}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#E91E8C',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Clear Storage & Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

console.log('🚀 NubHQ starting...')

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ToastProvider>
            <ThemeProvider>
              <AuthProvider>
                <FloatingXpProvider>
                  <App />
                </FloatingXpProvider>
              </AuthProvider>
            </ThemeProvider>
          </ToastProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </RootErrorBoundary>
  </StrictMode>,
)

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        logger.log('SW registered:', registration.scope)
      })
      .catch((error) => {
        logger.error('SW registration failed:', error)
      })
  })
}
