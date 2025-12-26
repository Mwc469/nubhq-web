import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout'
import NubSpinner from './components/ui/NubSpinner'
import ProtectedRoute from './components/ProtectedRoute'

// Lazy load all pages for code splitting
const Portal = lazy(() => import('./pages/Portal'))
const GameHub = lazy(() => import('./pages/GameHub'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const ApprovalQueue = lazy(() => import('./pages/ApprovalQueue'))
const ContentCalendar = lazy(() => import('./pages/ContentCalendar'))
const AITrainer = lazy(() => import('./pages/AITrainer'))
const FanMail = lazy(() => import('./pages/FanMail'))
const Settings = lazy(() => import('./pages/Settings'))
const MediaLibrary = lazy(() => import('./pages/MediaLibrary'))
const PostStudio = lazy(() => import('./pages/PostStudio'))
const VideoStudio = lazy(() => import('./pages/VideoStudio'))
const EmailCampaigns = lazy(() => import('./pages/EmailCampaigns'))
const Templates = lazy(() => import('./pages/Templates'))
const Analytics = lazy(() => import('./pages/Analytics'))
const ActivityLog = lazy(() => import('./pages/ActivityLog'))
const Login = lazy(() => import('./pages/Login'))
const QAChecklist = lazy(() => import('./pages/QAChecklist'))
const GameQueuePage = lazy(() => import('./pages/GameQueuePage'))
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
          {/* GameHub is the new default - game-like dashboard */}
          <Route index element={<GameHub />} />
          {/* Keep old dashboard accessible */}
          <Route path="dashboard-classic" element={<Dashboard />} />
          <Route path="approvals" element={<ApprovalQueue />} />
          <Route path="calendar" element={<ContentCalendar />} />
          <Route path="ai-trainer" element={<AITrainer />} />
          <Route path="fan-mail" element={<FanMail />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="post-studio" element={<PostStudio />} />
          <Route path="video-studio" element={<VideoStudio />} />
          <Route path="email-campaigns" element={<EmailCampaigns />} />
          <Route path="templates" element={<Templates />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="activity" element={<ActivityLog />} />
          <Route path="qa-checklist" element={<QAChecklist />} />
          <Route path="game-queue" element={<GameQueuePage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
