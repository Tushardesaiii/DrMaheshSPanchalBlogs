import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-shell min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
        <Card className="admin-panel w-full max-w-lg">
          <div className="space-y-4">
            <div>
              <p className="admin-kicker">Admin Login</p>
              <h1 className="admin-title mt-3 text-2xl">Secure Knowledge Console</h1>
              <p className="mt-2 text-sm text-(--color-muted)">
                Authorized administrators only. Use your assigned credentials.
              </p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <p className="admin-field-label">Email</p>
                <Input
                  className="admin-input mt-2"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@platform.com"
                  required
                />
              </div>
              <div>
                <p className="admin-field-label">Password</p>
                <Input
                  className="admin-input mt-2"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="********"
                  required
                />
              </div>
              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                  {error}
                </div>
              ) : null}
              <Button className="admin-button w-full" disabled={submitting}>
                {submitting ? 'Signing in...' : 'Login'}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Login
