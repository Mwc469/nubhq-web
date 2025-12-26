import { Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ApprovalQueue from './pages/ApprovalQueue'
import Calendar from './pages/Calendar'
import ContentCalendar from './pages/ContentCalendar'
import AITrainer from './pages/AITrainer'
import FanMail from './pages/FanMail'
import Settings from './pages/Settings'
import MediaLibrary from './pages/MediaLibrary'
import PostStudio from './pages/PostStudio'
import VideoStudio from './pages/VideoStudio'
import EmailCampaigns from './pages/EmailCampaigns'
import Templates from './pages/Templates'
import Analytics from './pages/Analytics'
import ActivityLog from './pages/ActivityLog'
import Login from './pages/Login'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
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
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
