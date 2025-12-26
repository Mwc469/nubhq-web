import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout'
import NubSpinner from './components/ui/NubSpinner'
import ProtectedRoute from './components/ProtectedRoute'

// Lazy load pages - simplified to core approval experience
const Portal = lazy(() => import('./pages/Portal'))
const GameHub = lazy(() => import('./pages/GameHub'))
const GameQueuePage = lazy(() => import('./pages/GameQueuePage'))
const AITrainer = lazy(() => import('./pages/AITrainer'))
const Settings = lazy(() => import('./pages/Settings'))
const Login = lazy(() => import('./pages/Login'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <NubSpinner size="lg" />
  </div>
)

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Portal entry experience */}
        <Route path="/portal" element={<Portal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          {/* Hub - the game menu with 4 core tasks */}
          <Route index element={<GameHub />} />
          {/* Game queues for different approval types */}
          <Route path="play" element={<GameQueuePage />} />
          <Route path="play/:gameType" element={<GameQueuePage />} />
          {/* AI Training - answer questions to improve brand voice */}
          <Route path="train" element={<AITrainer />} />
          {/* Settings */}
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
