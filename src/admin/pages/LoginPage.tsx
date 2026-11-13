import { useState, type FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Field } from '../components/form'
import { ME_QUERY_KEY } from '../components/RequireAdmin'
import { adminService, errorMessage } from '../services/admin.service'

export function LoginPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const queryClient = useQueryClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await adminService.login(email, password)
      await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY })
      const next = params.get('next')
      navigate(next?.startsWith('/admin') ? next : '/admin', { replace: true })
    } catch (err) {
      setError(errorMessage(err) === 'Wrong email or password' ? 'الإيميل أو الباسورد غلط' : errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center p-4">
      <form onSubmit={onSubmit} className="grid w-full max-w-sm gap-5 rounded-lg border border-line bg-surface p-6 shadow-sm">
        <div>
          <img src="/images/tg-mark.png" alt="Timber Glow" className="mb-4 h-8 w-auto" />
          <h1 className="text-xl font-bold">دخول الداشبورد</h1>
        </div>
        <Field label="الإيميل">
          {(id) => <Input id={id} type="email" dir="ltr" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />}
        </Field>
        <Field label="الباسورد">
          {(id) => (
            <Input
              id={id}
              type="password"
              dir="ltr"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
        </Field>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        <Button type="submit" disabled={busy}>
          {busy ? 'جاري الدخول…' : 'دخول'}
        </Button>
      </form>
    </div>
  )
}
