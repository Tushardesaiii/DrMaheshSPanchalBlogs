import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const getApiBase = () => import.meta.env.VITE_API_BASE_URL || ''

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const apiBase = getApiBase()

  const request = async (path, options = {}) => {
    const response = await fetch(`${apiBase}${path}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    })

    const payload = await response.json().catch(() => ({}))

    if (!response.ok) {
      const message = payload?.message || 'Request failed'
      throw new Error(message)
    }

    return payload
  }

  const login = async (email, password) => {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setUser(data?.data?.user || null)
    return data
  }

  const logout = async () => {
    setUser(null)
    try {
      await request('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      // Ignore logout errors so UI updates immediately.
    }
  }

  const refresh = async () => {
    try {
      const data = await request('/api/auth/me')
      setUser(data?.data?.user || null)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
