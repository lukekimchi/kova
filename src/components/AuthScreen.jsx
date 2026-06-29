import { useState } from 'react'

export default function AuthScreen({ onSignIn, onSignUp }) {
  const [mode, setMode]       = useState('login')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState(null)
  const [pending, setPending] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setPending(true)

    const { error } = mode === 'login'
      ? await onSignIn(email, password)
      : await onSignUp(email, password)

    setPending(false)
    if (error) {
      setError(error.message)
    } else if (mode === 'register') {
      setConfirmed(true)
    }
  }

  if (confirmed) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <p className="auth-confirm">Check your email to confirm your account, then log in.</p>
          <button className="btn btn-primary" onClick={() => { setConfirmed(false); setMode('login') }}>
            Back to log in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <p className="auth-wordmark">KO_VA.</p>
          <p className="auth-tagline">Marathon Training.</p>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab${mode === 'login' ? ' active' : ''}`} onClick={() => { setMode('login'); setError(null) }}>
            Log in
          </button>
          <button className={`auth-tab${mode === 'register' ? ' active' : ''}`} onClick={() => { setMode('register'); setError(null) }}>
            Create account
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="auth-input"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            minLength={6}
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}
