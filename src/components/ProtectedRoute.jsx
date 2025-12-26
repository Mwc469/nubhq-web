import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import NubSpinner from './ui/NubSpinner'

// Authentication is enabled in production
const DISABLE_AUTH = false

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // Bypass auth for development/testing
  if (DISABLE_AUTH) {
    return children
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-dark">
        <NubSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login, but save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
