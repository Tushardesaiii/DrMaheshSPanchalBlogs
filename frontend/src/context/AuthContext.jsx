import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const getApiBase = () => import.meta.env.VITE_API_BASE_URL || ''

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('accessToken'))
  const [loading, setLoading] = useState(true)
  const apiBase = getApiBase()

  const request = async (path, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    }

    const response = await fetch(`${apiBase}${path}`, {
      credentials: 'include',
      headers,
      ...options,
    })

    let payload = {}
    try {
      payload = await response.json()
    } catch (e) {
      console.error('Failed to parse response:', e)
    }

    if (!response.ok) {
      const message = typeof payload?.message === 'string'
        ? payload.message
        : `HTTP ${response.status}: Request failed`
      throw new Error(message)
    }

    return payload
  }

  const login = async (email, password) => {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    const accessToken = data?.data?.accessToken
    if (accessToken) {
      setToken(accessToken)
      localStorage.setItem('accessToken', accessToken)
    }
    setUser(data?.data?.user || null)
    return data
  }

  const logout = async () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('accessToken')
    try {
      await request('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      // Ignore logout errors
    }
  }

  const refresh = async () => {
    try {
      const data = await request('/api/auth/me')
      setUser(data?.data?.user || null)
    } catch (error) {
      setUser(null)
      setToken(null)
      localStorage.removeItem('accessToken')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const value = useMemo(() => ({ user, token, loading, login, logout }), [user, token, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
