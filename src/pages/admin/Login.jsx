import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Button, Field, Input, Spinner } from '../../components/ui'
import { Logo } from '../../components/layout/Logo'
import { useAuth } from '../../hooks/useAuth'

export default function AdminLogin() {
  const { session, isAdmin, loading, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && session && isAdmin) return <Navigate to="/admin/dashboard" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await signIn(email, password)
    } catch (err) {
      setError('Identifiants invalides.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-sm rounded-lg border border-line bg-white p-8">
        <Logo />
        <h1 className="mt-6 text-lg font-semibold text-ink">Connexion administration</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Email" htmlFor="email" required>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </Field>
          <Field label="Mot de passe" htmlFor="password" required>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </Field>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <Spinner size={16} /> : null} Se connecter
          </Button>
        </form>
      </div>
    </div>
  )
}
