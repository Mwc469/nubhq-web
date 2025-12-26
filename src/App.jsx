import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Layout from './pages/Layout'
import NubSpinner from './components/ui/NubSpinner'
import ProtectedRoute from './components/ProtectedRoute'
import AmbientEventLayer from './components/ui/AmbientEventLayer'

// Lazy load pages - simplified to core approval experience
const Portal = lazy(() => import('./pages/Portal'))
const GameHub = lazy(() => import('./pages/GameHub'))
const GameQueuePage = lazy(() => import('./pages/GameQueuePage'))
const AITrainer = lazy(() => import('./pages/AITrainer'))
const Settings = lazy(() => import('./pages/Settings'))
const Unlocks = lazy(() => import('./pages/Unlocks'))
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
    <>
      <Suspense fallback={<PageLoader />}>
        <AnimatedRoutes />
      </Suspense>
      <AmbientEventLayer />
    </>
  )
}

export default App
