import { Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ApprovalQueue from './pages/ApprovalQueue'
import Calendar from './pages/Calendar'
import AITrainer from './pages/AITrainer'
import FanMail from './pages/FanMail'
import Settings from './pages/Settings'
import MediaLibrary from './pages/MediaLibrary'
import Login from './pages/Login'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="approvals" element={<ApprovalQueue />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="ai-trainer" element={<AITrainer />} />
        <Route path="fan-mail" element={<FanMail />} />
        <Route path="media" element={<MediaLibrary />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
