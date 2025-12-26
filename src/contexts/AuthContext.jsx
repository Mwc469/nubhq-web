import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

const AuthContext = createContext(null)

const API_URL = (import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')

// Token storage keys
const ACCESS_TOKEN_KEY = 'nubhq_access_token'
const REFRESH_TOKEN_KEY = 'nubhq_refresh_token'

// Global token getter for apiUtils (since it can't use hooks)
let globalTokenGetter = null
let globalTokenRefresher = null
let globalLogoutFn = null

export function getAccessToken() {
  return globalTokenGetter?.() ?? localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function refreshAccessToken() {
  return globalTokenRefresher?.()
}

export function forceLogout() {
  globalLogoutFn?.()
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem(ACCESS_TOKEN_KEY))
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem(REFRESH_TOKEN_KEY))
  const [loading, setLoading] = useState(true)
  const refreshPromiseRef = useRef(null)

  // Store tokens in localStorage and state
  const storeTokens = useCallback((access, refresh) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access)
    if (refresh) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
    }
    setAccessToken(access)
    if (refresh) {
      setRefreshToken(refresh)
    }
  }, [])

  // Clear all tokens
  const clearTokens = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    setAccessToken(null)
    setRefreshToken(null)
    setUser(null)
  }, [])

  // Refresh the access token using the refresh token
  const doRefreshToken = useCallback(async () => {
    const currentRefreshToken = refreshToken || localStorage.getItem(REFRESH_TOKEN_KEY)

    if (!currentRefreshToken) {
      clearTokens()
      return null
    }

    // Prevent multiple simultaneous refresh attempts
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current
    }

    refreshPromiseRef.current = (async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: currentRefreshToken }),
        })

        if (!response.ok) {
          clearTokens()
          return null
        }

        const data = await response.json()
        storeTokens(data.access_token, data.refresh_token)
        return data.access_token
      } catch (error) {
        console.error('Token refresh failed:', error)
        clearTokens()
        return null
      } finally {
        refreshPromiseRef.current = null
      }
    })()

    return refreshPromiseRef.current
  }, [refreshToken, storeTokens, clearTokens])

  // Set up global functions for apiUtils
  useEffect(() => {
    globalTokenGetter = () => accessToken || localStorage.getItem(ACCESS_TOKEN_KEY)
    globalTokenRefresher = doRefreshToken
    globalLogoutFn = clearTokens

    return () => {
      globalTokenGetter = null
      globalTokenRefresher = null
      globalLogoutFn = null
    }
  }, [accessToken, doRefreshToken, clearTokens])

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = accessToken || localStorage.getItem(ACCESS_TOKEN_KEY)
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else if (response.status === 401) {
          // Try to refresh the token
          const newToken = await doRefreshToken()
          if (newToken) {
            // Retry fetching user with new token
            const retryResponse = await fetch(`${API_URL}/api/auth/me`, {
              headers: {
                Authorization: `Bearer ${newToken}`,
              },
            })
            if (retryResponse.ok) {
              const userData = await retryResponse.json()
              setUser(userData)
            } else {
              clearTokens()
            }
          }
        } else {
          clearTokens()
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
        clearTokens()
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [accessToken, doRefreshToken, clearTokens])

  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/api/auth/login/json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Login failed')
    }

    const data = await response.json()
    storeTokens(data.access_token, data.refresh_token)

    // Fetch user data
    const userResponse = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    })

    if (userResponse.ok) {
      const userData = await userResponse.json()
      setUser(userData)
    }

    return data
  }

  const register = async (email, password, displayName) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, display_name: displayName }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Registration failed')
    }

    const userData = await response.json()
    // Auto-login after registration
    await login(email, password)
    return userData
  }

  const logout = useCallback(() => {
    clearTokens()
  }, [clearTokens])

  const value = {
    user,
    token: accessToken,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    refreshToken: doRefreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
