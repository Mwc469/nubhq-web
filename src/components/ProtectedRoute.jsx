import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import NubSpinner from './ui/NubSpinner'

// TODO: Set to false to re-enable authentication
const DISABLE_AUTH = true

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
