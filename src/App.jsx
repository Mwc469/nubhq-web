import { Suspense, lazy, Component } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Layout from './pages/Layout'
import NubSpinner from './components/ui/NubSpinner'
import ProtectedRoute from './components/ProtectedRoute'
import AmbientEventLayer from './components/ui/AmbientEventLayer'

// Error boundary to catch React errors
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-900 text-white p-8">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <pre className="bg-black/50 p-4 rounded overflow-auto text-sm">
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-white text-red-900 rounded font-bold"
          >
            Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// Lazy load pages - simplified to core approval experience
const Portal = lazy(() => import('./pages/Portal'))
const GameHub = lazy(() => import('./pages/GameHub'))
const GameQueuePage = lazy(() => import('./pages/GameQueuePage'))
const AITrainer = lazy(() => import('./pages/AITrainer'))
const Settings = lazy(() => import('./pages/Settings'))
const Unlocks = lazy(() => import('./pages/Unlocks'))
const VideoPipeline = lazy(() => import('./pages/VideoPipeline'))
const LeaderboardPage = lazy(() => import('./pages/Leaderboard'))
const Achievements = lazy(() => import('./pages/Achievements'))
const Login = lazy(() => import('./pages/Login'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <NubSpinner size="lg" />
  </div>
)

// Page transition wrapper
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
)

// Animated Routes wrapper
function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Portal entry experience */}
        <Route path="/portal" element={<PageTransition><Portal /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          {/* Hub - the game menu with 4 core tasks */}
          <Route index element={<PageTransition><GameHub /></PageTransition>} />
          {/* Game queues for different approval types */}
          <Route path="play" element={<PageTransition><GameQueuePage /></PageTransition>} />
          <Route path="play/:gameType" element={<PageTransition><GameQueuePage /></PageTransition>} />
          {/* AI Training - answer questions to improve brand voice */}
          <Route path="train" element={<PageTransition><AITrainer /></PageTransition>} />
          {/* Unlocks Gallery - skins, themes, sounds */}
          <Route path="unlocks" element={<PageTransition><Unlocks /></PageTransition>} />
          {/* Leaderboard - weekly rankings */}
          <Route path="leaderboard" element={<PageTransition><LeaderboardPage /></PageTransition>} />
          {/* Achievements gallery */}
          <Route path="achievements" element={<PageTransition><Achievements /></PageTransition>} />
          {/* Video Pipeline */}
          <Route path="pipeline" element={<PageTransition><VideoPipeline /></PageTransition>} />
          {/* Settings */}
          <Route path="settings" element={<PageTransition><Settings /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <AnimatedRoutes />
      </Suspense>
      <AmbientEventLayer />
    </ErrorBoundary>
  )
}

export default App
